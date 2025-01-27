const notesContainer = document.getElementById("notes-container");
const noteModal = new bootstrap.Modal(document.getElementById("note-modal"));
const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");
const saveNoteBtn = document.getElementById("save-note-btn");
const searchInput = document.getElementById("search-input");
const sortNotes = document.getElementById("sort-notes");
const toggleDarkMode = document.getElementById("toggle-dark-mode");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let editingNoteIndex = null;

const renderNotes = () => {
  notesContainer.innerHTML = "";
  notes.forEach((note, index) => {
    const noteCard = document.createElement("div");
    noteCard.className = "note-card";
    noteCard.innerHTML = `
                    <h5>${note.title}</h5>
                    <p>${note.content}</p>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-sm btn-secondary me-2" onclick="editNote(${index})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteNote(${index})">Delete</button>
                    </div>
                `;
    notesContainer.appendChild(noteCard);
  });
};

const saveNotes = () => {
  localStorage.setItem("notes", JSON.stringify(notes));
  renderNotes();
};

const addNote = () => {
  const newNote = {
    title: noteTitle.value,
    content: noteContent.value,
    date: new Date().toISOString(),
  };

  if (editingNoteIndex !== null) {
    notes[editingNoteIndex] = newNote;
    editingNoteIndex = null;
  } else {
    notes.push(newNote);
  }

  saveNotes();
  noteModal.hide();
};

const editNote = (index) => {
  editingNoteIndex = index;
  const note = notes[index];
  noteTitle.value = note.title;
  noteContent.value = note.content;
  noteModal.show();
};

const deleteNote = (index) => {
  if (confirm("Are you sure you want to delete this note?")) {
    notes.splice(index, 1);
    saveNotes();
  }
};

saveNoteBtn.addEventListener("click", addNote);

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  notesContainer.innerHTML = "";
  notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    )
    .forEach((note, index) => {
      const noteCard = document.createElement("div");
      noteCard.className = "note-card";
      noteCard.innerHTML = `
                        <h5>${note.title}</h5>
                        <p>${note.content}</p>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-sm btn-secondary me-2" onclick="editNote(${index})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteNote(${index})">Delete</button>
                        </div>
                    `;
      notesContainer.appendChild(noteCard);
    });
});

sortNotes.addEventListener("change", () => {
  const sortBy = sortNotes.value;
  if (sortBy === "title") {
    notes.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    notes.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  saveNotes();
});

toggleDarkMode.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

renderNotes();
