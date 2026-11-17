
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My Notes</title>
  <style>
    :root {
      color-scheme: light;
      font-family: Arial, sans-serif;
      color: #222;
      background: #f2f2f2;
    }

    body {
      margin: 0;
      padding: 24px 16px;
    }

    .app {
      width: min(100%, 600px);
      margin: 0 auto;
    }

    h1 {
      text-align: center;
    }

    textarea {
      box-sizing: border-box;
      display: block;
      width: 100%;
      min-height: 120px;
      padding: 12px;
      border: 1px solid #aaa;
      border-radius: 5px;
      font: inherit;
      resize: vertical;
    }

    button {
      margin: 5px 5px 5px 0;
      padding: 8px 12px;
      border: 0;
      border-radius: 4px;
      background: #e2e2e2;
      color: #222;
      font: inherit;
      cursor: pointer;
    }

    button:hover {
      background: #d2d2d2;
    }

    .primary {
      margin-top: 10px;
      background: #1769aa;
      color: white;
    }

    .primary:hover {
      background: #12568d;
    }

    .note {
      margin-top: 12px;
      padding: 12px;
      border-radius: 5px;
      background: white;
      overflow-wrap: anywhere;
    }

    .note p {
      margin: 0 0 8px;
      white-space: pre-wrap;
    }

    .empty {
      color: #666;
      text-align: center;
    }

    .status {
      min-height: 1.25em;
      color: #a12622;
    }
  </style>
</head>
<body>
  <main class="app">
    <h1>My Notes</h1>
    <label for="note-text">Write a note</label>
    <textarea id="note-text" placeholder="Write your note"></textarea>
    <button class="primary" id="save-note" type="button">Add Note</button>
    <button id="cancel-edit" type="button" hidden>Cancel edit</button>
    <p class="status" id="status" role="status" aria-live="polite"></p>
    <section id="notes" aria-label="Saved notes"></section>
  </main>

  <script>
    const STORAGE_KEY = "my-notes";
    const input = document.querySelector("#note-text");
    const saveButton = document.querySelector("#save-note");
    const cancelButton = document.querySelector("#cancel-edit");
    const status = document.querySelector("#status");
    const notesElement = document.querySelector("#notes");
    let notes = loadNotes();
    let editingId = null;

    function loadNotes() {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(saved) ? saved : [];
      } catch {
        return [];
      }
    }

    function persistNotes() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        status.textContent = "";
        return true;
      } catch {
        status.textContent = "Could not save notes in this browser.";
        return false;
      }
    }

    function renderNotes() {
      notesElement.replaceChildren();

      if (notes.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty";
        emptyMessage.textContent = "No notes yet.";
        notesElement.append(emptyMessage);
        return;
      }

      for (const note of notes) {
        const card = document.createElement("article");
        card.className = "note";

        const content = document.createElement("p");
        content.textContent = note.text;
        card.append(content);

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => startEditing(note));
        card.append(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteNote(note.id));
        card.append(deleteButton);

        notesElement.append(card);
      }
    }

    function saveNote() {
      const text = input.value.trim();

      if (!text) {
        status.textContent = "Please write a note.";
        input.focus();
        return;
      }

      const previousNotes = notes;

      if (editingId === null) {
        notes = [...notes, { id: crypto.randomUUID(), text }];
      } else {
        notes = notes.map(note =>
          note.id === editingId ? { ...note, text } : note
        );
      }

      if (!persistNotes()) {
        notes = previousNotes;
        return;
      }

      finishEditing();
      renderNotes();
    }

    function startEditing(note) {
      input.value = note.text;
      editingId = note.id;
      saveButton.textContent = "Update Note";
      cancelButton.hidden = false;
      status.textContent = "";
      input.focus();
    }

    function finishEditing() {
      editingId = null;
      input.value = "";
      saveButton.textContent = "Add Note";
      cancelButton.hidden = true;
    }

    function deleteNote(id) {
      const previousNotes = notes;
      notes = notes.filter(note => note.id !== id);

      if (!persistNotes()) {
        notes = previousNotes;
        return;
      }

      if (editingId === id) {
        finishEditing();
      }

      renderNotes();
    }

    saveButton.addEventListener("click", saveNote);

    cancelButton.addEventListener("click", () => {
      finishEditing();
      status.textContent = "";
    });

    input.addEventListener("keydown", event => {
      if (event.ctrlKey && event.key === "Enter") {
        saveNote();
      }
    });

    renderNotes();
  </script>
</body>
</html>
```