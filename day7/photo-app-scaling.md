# SnapShare Photo-App Scaling Plan

## 1. Assumptions

SnapShare is a photo-sharing application where users upload photos and view feed pages from people they follow.

The following assumptions are used:

- SnapShare has 10 million registered users.
- 10% of registered users are active each day.
- Each daily active user uploads one photo per day.
- Each daily active user views 50 feed pages per day.
- Each original photo averages 2 MB.
- Each original photo has one thumbnail averaging 50 KB.
- A day has 86,400 seconds, and a year has 365 days.
- Storage calculations use decimal units: 1 MB = 1,000 KB and 1 TB = 1,000,000 MB.
- Traffic is averaged across 24 hours, and peak feed traffic is five times the average.
- Each uploaded photo is retained for at least one year.
- The calculations exclude storage replication, backups, and temporary files.

## 2. Traffic and Storage Calculations

### Daily Active Users

Daily active users (DAU) = Registered users × Daily activity rate

DAU = 10,000,000 × 0.10 = **1,000,000 users per day**

### Uploads Per Second

Daily uploads = 1,000,000 users × 1 photo = 1,000,000 uploads per day.

Average uploads per second = 1,000,000 ÷ 86,400

Average uploads per second = **11.57 uploads per second**, approximately 12.

### Feed Views Per Second

Daily feed views = 1,000,000 users × 50 pages = 50,000,000 feed views per day.

Average feed views per second = 50,000,000 ÷ 86,400

Average feed views per second = **578.70 feed views per second**, approximately 579.

Peak feed views per second = 578.70 × 5

Peak feed views per second = **2,893.52 feed views per second**, approximately 2,894.

The application should be designed to handle peak traffic without becoming unavailable or significantly slower.

### Photo Storage Per Year

Annual uploads = 1,000,000 × 365 = 365,000,000 photos.

Original photo storage per year:

365,000,000 × 2 MB = 730,000,000 MB = **730 TB**.

Thumbnail storage per year:

365,000,000 × 50 KB = 18,250,000,000 KB = **18.25 TB**.

Total new photo and thumbnail storage per year:

730 TB + 18.25 TB = **748.25 TB per year**.

This is the estimated storage for one year of new uploads, before replication, backups, and other overhead. Actual storage requirements increase as more years of photos are retained.

## 3. Read-Heavy or Write-Heavy?

SnapShare is a **read-heavy system** because users view 50 feed pages per day but upload only one photo per day. Feed views occur much more frequently than uploads.

The design should therefore optimize photo delivery and feed retrieval. A CDN can deliver photos close to users, a cache can serve frequently requested feed data, and a database read replica can handle read queries. The load balancer and multiple application servers distribute requests. Uploads and thumbnail creation should be handled reliably without slowing down feed browsing.

## 4. Why Photos Should Not Be Stored Inside the Database

Original photos and thumbnails are large binary files. Storing them directly inside the database would increase database size, backups, and recovery time, while making database operations more expensive and difficult to scale.

Instead, SnapShare should store photo files in **object storage**, which is designed for large files and can scale independently. The database should store photo metadata, such as the photo ID, owner ID, caption, upload time, privacy settings, and object-storage key or URL.

## 5. Architecture Diagram

```text
                    +----------------------+
                    |        Users         |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |         CDN          |
                    | Cached photo delivery|
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |    Load Balancer     |
                    +----------+-----------+
                               |
                 +-------------+-------------+
                 |             |             |
                 v             v             v
          +-------------+ +-------------+ +-------------+
          | App Server 1| | App Server 2| | App Server N|
          +------+------+ +------+------+ +------+------+
                 |             |                |
                 +-------------+----------------+
                               |
                   +-----------+-----------+
                   |                       |
                   v                       v
            +-------------+        +------------------+
            |    Cache    |        | Primary Database |
            +-------------+        +--------+---------+
                                             |
                                             v
                                    +------------------+
                                    |  Read Replica    |
                                    +------------------+

          Upload processing:
          App Servers
               |
               v
        +------------------+       +------------------+
        |  Object Storage  |       |  Message Queue   |
        | Original photos  |       +--------+---------+
        | and thumbnails   |                |
        +------------------+                v
                                   +------------------+
                                   | Thumbnail Worker |
                                   +--------+---------+
                                            |
                                            v
                                   +------------------+
                                   |  Object Storage  |
                                   | Saved thumbnails |
                                   +------------------+
```

## 6. Components and the Problems They Solve

1. **CDN:** Delivers cached photos from locations closer to users, reducing latency and the load on the application servers.
2. **Load balancer:** Distributes incoming requests across healthy application servers to prevent one server from becoming overloaded.
3. **Application servers:** Handle business logic, authentication, photo-upload requests, feed generation, and interactions with storage services.
4. **Cache:** Keeps frequently requested feed data and metadata readily available, reducing repeated database queries.
5. **Primary database:** Stores durable application records, including users, follows, captions, permissions, and photo metadata.
6. **Database read replica:** Handles suitable read queries separately from the primary database, reducing read pressure on the primary.
7. **Object storage:** Stores original photos and generated thumbnails as files, allowing image storage to scale independently of the database.
8. **Message queue:** Holds thumbnail-generation jobs so that uploads can complete without waiting for image processing.
9. **Thumbnail worker:** Consumes queued jobs, creates smaller thumbnail versions, and saves them to object storage.

## 7. Photo Upload Flow

1. A user signs in and selects a photo to upload.
2. The application server authenticates the user and validates the file type, size, and upload permissions.
3. The photo is uploaded to object storage, either through the application server or using a secure, time-limited upload URL.
4. Once the original photo has been stored successfully, the application records its metadata and storage key in the primary database.
5. The application places a thumbnail-generation job on the message queue.
6. The application confirms the upload to the user without waiting for thumbnail generation to finish.
7. A thumbnail worker retrieves the job and reads the original photo from object storage.
8. The worker resizes and compresses the photo to create a thumbnail, then saves the thumbnail in object storage.
9. The worker updates the photo metadata to indicate that the thumbnail is ready, or records a failure for retry if processing fails.
10. When someone views a feed, the application retrieves feed metadata using the cache or database and provides photo URLs; the CDN serves cached photos and thumbnails where available.

## 8. Trade-Offs

### Trade-Off 1: CDN Caching vs. Freshness

A CDN improves photo-loading speed and reduces traffic to the origin storage. However, cached content may become outdated when a photo is changed or deleted. Cache expiration and invalidation policies are needed, especially for private or deleted content.

### Trade-Off 2: Asynchronous Thumbnails vs. Immediate Availability

A message queue lets uploads finish quickly and allows thumbnail processing to scale independently. However, thumbnails may not be available immediately, and failed jobs require retries, monitoring, and dead-letter handling.

### Trade-Off 3: Read Replicas vs. Data Consistency

Read replicas reduce pressure on the primary database and improve read capacity. However, replication can lag, meaning a newly uploaded photo or updated metadata might not appear immediately when read from a replica.

### Trade-Off 4: Object Storage vs. Simplicity

Object storage scales well for large image files and separates file storage from database operations. However, the application must manage file permissions, storage keys, upload failures, and coordination between database records and stored objects.

## 9. Conclusion

SnapShare should use a scalable, read-optimized architecture because feed browsing greatly exceeds photo uploads. With one million daily active users, the system receives approximately 12 uploads per second and 579 feed views per second on average, with peak feed traffic of about 2,894 views per second. It needs an estimated 748.25 TB of additional original-photo and thumbnail storage each year.

A CDN, load balancer, multiple application servers, cache, primary database with a read replica, object storage, message queue, and thumbnail worker provide a foundation for scaling while maintaining performance and reliability.
