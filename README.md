# Student Management REST API

A beginner-friendly REST API built with Node.js and Express.js. It demonstrates CRUD operations and basic request validation.

## Features

- Create, read, update, and delete student records
- Validate name, department, year, and email
- Reject duplicate email addresses
- Return useful HTTP status codes and error messages
- JSON request and response bodies

## Requirements

- Node.js (LTS recommended)
- VS Code or another code editor
- Postman, Thunder Client, or curl for testing

## Setup

Open a terminal in this project folder and run:

```bash
npm install
npm start
```

Open `http://localhost:3000` in a browser to see the API status message.

## Endpoints

| Method | URL | Purpose |
|---|---|---|
| GET | `/` | API status and endpoint list |
| GET | `/students` | List all students |
| GET | `/students/1` | Get one student |
| POST | `/students` | Create a student |
| PUT | `/students/1` | Update a student |
| DELETE | `/students/1` | Delete a student |

## Example POST body

In Postman, choose `POST`, enter `http://localhost:3000/students`, then choose **Body → raw → JSON**:

```json
{
  "name": "Arun Kumar",
  "department": "IT",
  "year": 2,
  "email": "arun@example.com"
}
```

For PUT, send the same four fields to `http://localhost:3000/students/1`.

## Validation rules

- Name and department must be non-empty text.
- Year must be an integer from 1 to 4.
- Email must use a basic valid email format.
- Email addresses must be unique.

## Important limitation

This starter version stores records in a JavaScript array, so changes disappear when the server restarts. It is for learning and API testing. Add MongoDB for persistent storage before using it as a real student system.
