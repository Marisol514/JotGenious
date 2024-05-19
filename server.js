//creates an express application
const express = require('express');
//utility for working with file and directory paths
const path = require('path');
//brings in the apiRoutes.js file
const apiRoutes = require('./routes/apiRoutes');

//creates a port variable and opens it at 3001 if a different port is not set
const PORT = process.env.PORT || 3001;

//configurs the app that you will use, a new express application instance
const app = express();

//middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

apiRoutes(app);

//calls the index.html file when the localhost:3001 is called
app.get('/', (req, res) =>
res.sendFile(path.join(__dirname, '/public/index.html'))
);

//calls the notes.html page when api/notes is typed
app.get('/notes', (req, res) =>
res.sendFile(path.join(__dirname, '/public/notes.html'))
);

//sets the port to listen at 3001 local host
app.listen(PORT, () =>
console.log(`App listening at https://localhost:${PORT}`)
);