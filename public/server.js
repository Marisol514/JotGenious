const express = require('express');
const path = require('path');
const api = require('./routes/apiRoutes.js') 

const PORT = process.env.PORT || 3001
const app = express();

// Middleware code 
//express.json express.urlencoded express.static 
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use('/api', api);

app.use(express.static('public'));

// GET code for the /notes route 
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET code the home page. * (wildcard) captures all other addresses  
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// 
app.listen(PORT, () => {
    console.log('app is listening http://localhost:' + PORT)
})