
# Library Books REST API Design

## Base URL

`https://api.example.com`

## 1. List All Books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns a list of all books in the library.
- **Success status:** 200 OK

## 2. Get One Book

- **Method:** GET
- **Path:** `/books/{id}`
- **Description:** Returns details of a single book using its ID.
- **Success status:** 200 OK

## 3. Create a Book

- **Method:** POST
- **Path:** `/books`
- **Description:** Adds a new book to the library.
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "year": 1958
}
```

- **Success status:** 201 Created

## 4. Update a Book

- **Method:** PUT
- **Path:** `/books/{id}`
- **Description:** Replaces the details of an existing book.
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "year": 1958
}
```

- **Success status:** 200 OK

## 5. Delete a Book

- **Method:** DELETE
- **Path:** `/books/{id}`
- **Description:** Removes a book from the library using its ID.
- **Success status:** 204 No Content

## 6. List Books by Author

- **Method:** GET
- **Path:** `/books?author=Chinua%20Achebe`
- **Description:** Returns books written by the specified author.
- **Example request:** `GET /books?author=Chinua%20Achebe`
- **Success status:** 200 OK

## Error Responses

### 400 Bad Request

- **Description:** The request contains invalid data.
- **Example:** Creating a book without a required title or author.

### 404 Not Found

- **Description:** The requested resource does not exist.
- **Example:** Requesting `GET /books/999` when book ID 999 does not exist.
