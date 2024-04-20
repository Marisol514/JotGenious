// Routes for GET POST notes
const notes = require('express').Router();
const { readFromFile, readAndAppend } = require('../helpers/fsUtils')

notes.get('/notes', (req, res) =>
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

notes.post('/notes', (req, res) => {
   const parsedData = readAndAppend(req.body, './db/db.json')
   res.json(parsedData)
}
)

module.exports = notes;