// Declare variables to store references to DOM elements
let noteForm; // Form element for notes
let noteTitle; // Input field for note title
let noteText; // Textarea field for note content
let saveNoteBtn; // Button to save a note
let newNoteBtn; // Button to create a new note
let clearBtn; // Button to clear the form
let noteList; // List element to display notes

// Check if the current page is the '/notes' page
if (window.location.pathname === '/notes') {
  // If on the '/notes' page, assign references to DOM elements
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelector('.list-group');
}

// Function to show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Function to hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// Variable to store the active note being edited
let activeNote = {};

// Function to fetch notes from the server
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

// Function to save a note to the server
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });

// Function to delete a note from the server
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

// Function to render the active note in the form
const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// Event handler to save a note
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Event handler to delete a note
const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target.parentElement;
  const noteId = JSON.parse(note.dataset.note).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Event handler to view a note
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.dataset.note);
  renderActiveNote();
};

// Event handler to create a new note view
const handleNewNoteView = () => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};

// Event handler to render buttons based on form state
const handleRenderBtns = () => {
  show(clearBtn);
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    hide(clearBtn);
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Function to render the list of notes
const renderNoteList = async (notes) => {
  const jsonNotes = await notes.json();
  noteList.innerHTML = '';

  if (jsonNotes.length === 0) {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    liEl.textContent = 'No saved Notes';
    noteList.append(liEl);
  }

  jsonNotes.forEach((note) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');
    liEl.textContent = note.title;
    liEl.dataset.note = JSON.stringify(note);
    liEl.addEventListener('click', handleNoteView);
    
    const delBtnEl = document.createElement('i');
    delBtnEl.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
    delBtnEl.addEventListener('click', handleNoteDelete);

    liEl.appendChild(delBtnEl);
    noteList.appendChild(liEl);
  });
};

// Function to fetch and render notes
const getAndRenderNotes = () => getNotes().then(renderNoteList);

// Event listeners for note form elements
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', renderActiveNote);
  noteForm.addEventListener('input', handleRenderBtns);
}

// Initial fetch and render of notes
getAndRenderNotes();
