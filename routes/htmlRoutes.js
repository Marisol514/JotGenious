// HTML ind
const htmlRoutes = require('express').Router()

// GET route for index
htmlRoutes.get('/', (req, res) => {
    readFromFile('./assets/index.html').then((data) => res.json(JSON.parse(data)));
});



module.exports = htmlRoutes;