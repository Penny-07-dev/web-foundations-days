# School Database Design

## 1. Tables

**Students:** This table stores each student's ID, name, and email address. The student ID is the primary key, and each email address must be unique.

**Courses:** This table stores the courses offered by the school. Each course has a unique course ID and a course name.

**Enrolments:** This table records which students have enrolled in which courses. It also stores each student's grade for a course. The enrolment ID is the primary key, while student ID and course ID are foreign keys.

## 2. Relationships

A student can have many enrolments, but each enrolment belongs to one student. This is a one-to-many relationship between students and enrolments.

A course can have many enrolments, but each enrolment belongs to one course. This is a one-to-many relationship between courses and enrolments.

Students and courses have a many-to-many relationship because one student can take several courses and one course can have several students. The enrolments table connects the two tables and records each student's participation. A unique constraint on student ID and course ID prevents the same student from enrolling in the same course twice.

## 3. Index

The primary keys automatically provide indexes for identifying records efficiently. An additional index on `enrolments(course_id)` would help the database find all students enrolled in a particular course more quickly.

## 4. SQL vs NoSQL

I chose a relational SQL database because school records have clear relationships between students, courses, and enrolments. Primary keys and foreign keys help maintain data integrity, while joins make it possible to retrieve related information. SQL also supports constraints that prevent duplicate enrolments and ensure required information is provided. A NoSQL database can be useful for flexible or rapidly changing data, but a relational database is a suitable choice for this structured school system.
