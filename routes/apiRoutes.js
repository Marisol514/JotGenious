// Import necessary modules
const fs = require('fs'); // Module for file system operations
const path = require('path'); // Module for working with file and directory paths
const { v4: uuidv4 } = require('uuid'); // Module for generating UUIDs

// Define the file path for the JSON database file
const dbFilePath = path.join(__dirname, '../db/db.json');

// Function to load data from db.json
const loadData = () => {
  try {
    // Read data from the database file and parse it as JSON
    const rawData = fs.readFileSync(dbFilePath);
    return JSON.parse(rawData);
  } catch (error) {
    // Return an empty array if there's an error reading or parsing the file
    return [];
  }
};

// Function to save data to db.json
const saveData = (data) => {
  // Write data to the database file, formatting it as JSON with indentation for readability
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

// Export a function that sets up routes for handling notes in the application
module.exports = function (app) {
  // Route to get all notes from the database
  app.get('/api/notes', (req, res) => {
    // Load data from the database file
    const data = loadData();
    // Send the loaded data as JSON in the response
    res.json(data);
  });

  // Route to get a specific note by its ID
  app.get('/api/notes/:id', (req, res) => {
    // Extract the note ID from the request parameters
    const textId = req.params.id;
    // Load data from the database file
    const data = loadData();
    // Find the note with the specified ID
    const selectedNote = data.find(note => note.id === textId);
    // If the note is found, send it as JSON in the response
    // If not found, send a 404 Not Found status with an error message
    if (selectedNote) { 
      res.json(selectedNote);
    } else {
      res.status(404).send('Note not found');
    }
  });

  // Route to add a new note to the database
  app.post('/api/notes', (req, res) => {
    // Extract title and text from the request body
    const submittedData = {
      title: req.body.title,
      text: req.body.text,
      // Generate a unique ID for the new note
      id: uuidv4(),
    };

    // Load data from the database file
    const data = loadData();
    // Add the new note to the loaded data
    data.push(submittedData);
    // Save the updated data to the database file
    saveData(data);
    // Redirect the client to the home page after adding the note
    res.send('<script>window.location.href="/";</script>');
  });

  // Route to delete a note from the database by its ID
  app.delete('/api/notes/:id', (req, res) => {
    // Extract the ID of the note to be deleted from the request parameters
    const deleteId = req.params.id;
    // Load data from the database file
    let data = loadData();
    // Filter out the note with the specified ID from the loaded data
    data = data.filter(note => note.id !== deleteId);
    // Save the updated data to the database file
    saveData(data);
    // Send a 204 No Content status to indicate successful deletion
    res.sendStatus(204);
  });
};
