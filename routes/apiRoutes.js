const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbFilePath = path.join(__dirname, '../db/db.json');

// Load data from db.json
const loadData = () => {
  try {
    const rawData = fs.readFileSync(dbFilePath);
    return JSON.parse(rawData);
  } catch (error) {
    return [];
  }
};

// Save data to db.json
const saveData = (data) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
};

module.exports = function (app) {
  //gets the array stored in the notes
  app.get('/api/notes', (req, res) => {
    const data = loadData();
    res.json(data);
  });

  //looks for a specific id within the array for one note
  app.get('/api/notes/:id', (req, res) => {
    const textId = req.params.id;
    const data = loadData();
    const selectedNote = data.find(note => note.id ===textId);
    //sets it up so that if the selected note is not found, then an error populates
    if (selectedNote) { 
      res.json(selectedNote);
      } else {
        res.status(404).send('Note not found');
      }
  })

  //sets up to post to the notes page, requiring a title, and a text. It gives a unique id
  app.post('/api/notes', (req, res) => {
    const submittedData = {
      title: req.body.title,
      text: req.body.text,
      id: uuidv4(),
    };

    const data = loadData();
    data.push(submittedData);

    saveData(data);

    res.send('<script>window.location.href="/";</script>');
  });

  //sets up the file so that tasks can be deleted 
  app.delete('/api/notes/:id', (req, res) => {
    const deleteId = req.params.id;

      let data = loadData();
      data = data.filter(note => note.id !== deleteId);

      saveData(data);
      //often used with delete requests to indicate successful deletion
      res.sendStatus(204);
    });
};