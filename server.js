const express = require('express');
const path = require('path');
const fs = require('fs');
// require uuid for making unique id numbers for notes
const { v4: uuidv4 } = require('uuid')



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

// notes_db will be our db.json file with notes information
const notes_db = path.join(__dirname, './db/db.json');


// routes for HTML
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});




// routes for API
// GET notes from the database
app.get('/api/notes', (req, res) => {
    // read notes_db database and return response with parsed data
    fs.readFile(notes_db, (err, data) => {
        dataParsed = JSON.parse(data);
        res.json(dataParsed.notes);
    });
});

// POST new note to the database
app.post('/api/notes', (req, res) => {
    console.log("line 51 server.js");
    const newNote = req.body;
   fs.readFile(notes_db, (err, data) => {
        currentNotes = (JSON.parse(data).notes);
        newNote.id = uuidv4();
        console.log(newNote);
        currentNotes.push(newNote);
        console.log("line 62" + (currentNotes));
        fs.writeFile(notes_db, 
            JSON.stringify({notes: currentNotes }, null, 2), function (err) {
            if (err) throw err;
            console.log('Updated!');
            res.json(currentNotes);
        });
    });
    

});

// DELETE a note from the db.json, given a note id
app.delete('/api/notes/:id', (req, res) => {
    console.log('line 71' + req.params.id)
})

// catch any undesignated website url and go to home
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// functions



