Here’s the main code for the **book collection REST API** (`server.js`). It provides endpoints to list, add, view, update, and delete books.

```js
const express = require("express");
const { randomUUID } = require("node:crypto");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "32kb" }));

// Books are stored in memory and reset when the server restarts.
const books = new Map();

function validateBook(data, { partial = false } = {}) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return "Request body must be a JSON object.";
  }

  const allowedFields = new Set(["title", "author", "isbn", "year", "genre"]);
  const unknownField = Object.keys(data).find(key => !allowedFields.has(key));

  if (unknownField) {
    return `Unknown field: ${unknownField}.`;
  }

  if (!partial && (!("title" in data) || !("author" in data))) {
    return "Both title and author are required.";
  }

  for (const field of ["title", "author", "isbn", "genre"]) {
    if (field in data &&
        (typeof data[field] !== "string" || data[field].trim() === "")) {
      return `${field} must be a non-empty string.`;
    }
  }

  if ("year" in data && (!Number.isInteger(data.year) || data.year < 0)) {
    return "year must be a non-negative integer.";
  }

  if (partial && Object.keys(data).length === 0) {
    return "Provide at least one field to update.";
  }

  return null;
}

// List all books
app.get("/api/books", (req, res) => {
  res.json([...books.values()]);
});

// Get one book
app.get("/api/books/:id", (req, res) => {
  const book = books.get(req.params.id);

  if (!book) {
    return res.status(404).json({ error: "Book not found." });
  }

  res.json(book);
});

// Add a book
app.post("/api/books", (req, res) => {
  const validationError = validateBook(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const book = {
    id: randomUUID(),
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    ...(req.body.isbn !== undefined && { isbn: req.body.isbn.trim() }),
    ...(req.body.year !== undefined && { year: req.body.year }),
    ...(req.body.genre !== undefined && { genre: req.body.genre.trim() })
  };

  books.set(book.id, book);
  res.location(`/api/books/${book.id}`).status(201).json(book);
});

// Replace a book
app.put("/api/books/:id", (req, res) => {
  if (!books.has(req.params.id)) {
    return res.status(404).json({ error: "Book not found." });
  }

  const validationError = validateBook(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const book = {
    id: req.params.id,
    title: req.body.title.trim(),
    author: req.body.author.trim(),
    ...(req.body.isbn !== undefined && { isbn: req.body.isbn.trim() }),
    ...(req.body.year !== undefined && { year: req.body.year }),
    ...(req.body.genre !== undefined && { genre: req.body.genre.trim() })
  };

  books.set(book.id, book);
  res.json(book);
});

// Update selected fields on a book
app.patch("/api/books/:id", (req, res) => {
  const existingBook = books.get(req.params.id);

  if (!existingBook) {
    return res.status(404).json({ error: "Book not found." });
  }

  const validationError = validateBook(req.body, { partial: true });

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const updates = { ...req.body };

  for (const field of ["title", "author", "isbn", "genre"]) {
    if (field in updates) {
      updates[field] = updates[field].trim();
    }
  }

  const updatedBook = { ...existingBook, ...updates };
  books.set(updatedBook.id, updatedBook);
  res.json(updatedBook);
});

// Delete a book
app.delete("/api/books/:id", (req, res) => {
  if (!books.has(req.params.id)) {
    return res.status(404).json({ error: "Book not found." });
  }

  books.delete(req.params.id);
  res.status(204).end();
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Handle invalid JSON
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      error: "Request body contains invalid JSON."
    });
  }

  next(error);
});

// Handle other server errors
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => {
  console.log(`Book collection API listening on http://localhost:${port}`);
});
```
