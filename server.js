const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Allows the API to read JSON request bodies.
app.use(express.json());

// Demo storage only: data resets when the server restarts.
// Use MongoDB for permanent storage in a later version.
let students = [
  {
    id: 1,
    name: "Vahiesh",
    department: "IT",
    year: 4,
    email: "vahiesh@example.com"
  },
  {
    id: 2,
    name: "Priya",
    department: "CSE",
    year: 3,
    email: "priya@example.com"
  }
];

let nextId = 3;

function validateStudent(data) {
  const errors = [];

  if (typeof data.name !== "string" || data.name.trim() === "") {
    errors.push("Name is required and must be text.");
  }

  if (
    typeof data.department !== "string" ||
    data.department.trim() === ""
  ) {
    errors.push("Department is required and must be text.");
  }

  if (!Number.isInteger(data.year) || data.year < 1 || data.year > 4) {
    errors.push("Year must be a whole number between 1 and 4.");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof data.email !== "string" || !emailPattern.test(data.email.trim())) {
    errors.push("A valid email address is required.");
  }

  return errors;
}

// Home route: quick API status check.
app.get("/", (req, res) => {
  res.json({
    message: "Student Management REST API is running.",
    endpoints: {
      listStudents: "GET /students",
      getStudent: "GET /students/:id",
      createStudent: "POST /students",
      updateStudent: "PUT /students/:id",
      deleteStudent: "DELETE /students/:id"
    }
  });
});

// READ: get every student.
app.get("/students", (req, res) => {
  res.json({
    count: students.length,
    data: students
  });
});

// READ: get one student by ID.
app.get("/students/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Student ID must be a positive integer." });
  }

  const student = students.find((item) => item.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }

  res.json({ data: student });
});

// CREATE: add a student after validation.
app.post("/students", (req, res) => {
  const errors = validateStudent(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed.",
      errors
    });
  }

  const email = req.body.email.trim().toLowerCase();
  const emailExists = students.some((student) => student.email.toLowerCase() === email);

  if (emailExists) {
    return res.status(409).json({ message: "A student with this email already exists." });
  }

  const student = {
    id: nextId++,
    name: req.body.name.trim(),
    department: req.body.department.trim(),
    year: req.body.year,
    email
  };

  students.push(student);
  res.status(201).json({
    message: "Student created successfully.",
    data: student
  });
});

// UPDATE: replace the editable student fields after validation.
app.put("/students/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Student ID must be a positive integer." });
  }

  const studentIndex = students.findIndex((item) => item.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: "Student not found." });
  }

  const errors = validateStudent(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Validation failed.",
      errors
    });
  }

  const email = req.body.email.trim().toLowerCase();
  const emailExists = students.some(
    (student) => student.id !== id && student.email.toLowerCase() === email
  );

  if (emailExists) {
    return res.status(409).json({ message: "Another student already uses this email." });
  }

  students[studentIndex] = {
    id,
    name: req.body.name.trim(),
    department: req.body.department.trim(),
    year: req.body.year,
    email
  };

  res.json({
    message: "Student updated successfully.",
    data: students[studentIndex]
  });
});

// DELETE: remove a student by ID.
app.delete("/students/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: "Student ID must be a positive integer." });
  }

  const studentIndex = students.findIndex((item) => item.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: "Student not found." });
  }

  const deletedStudent = students.splice(studentIndex, 1)[0];

  res.json({
    message: "Student deleted successfully.",
    data: deletedStudent
  });
});

// Return a clear error for invalid JSON.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON body." });
  }

  next(err);
});

// Handle requests to endpoints that do not exist.
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Student Management API running at http://localhost:${PORT}`);
  console.log("Try GET http://localhost:3000/students");
});
