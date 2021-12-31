const express = require('express');
const path = require('path');
const fs = require('fs');


// define port
const PORT = process.env.PORT || 3001;

// make express application
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
// parse incoming JSON data
app.use(express.json());
// serve static files
app.use(express.static(path.join(__dirname, 'public')));

// make an id counter for saving and loading notes with unique id
let idCount = 1;

const notes_db = path.join(__dirname, './db/db.json');


// routes for HTML
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});



// routes for API
// GET notes from the database
app.get('/api/notes', (req, res) => {
    // read notes_db database and return respond with parsed data
    fs.readFile(notes_db, (err, data) => {
        dataParsed = JSON.parse(data)
        res.json(dataParsed);
    });
});

// POST new note to the database

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });