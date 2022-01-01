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
    console.log("line 50 server.js");
    const newNote = req.body;
   fs.readFile(notes_db, (err, data) => {
        currentNotes = (JSON.parse(data).notes);
        newNote.id = uuidv4();
        console.log(newNote);
        currentNotes.push(newNote);
        console.log("line 57" + (currentNotes));
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
    console.log('this is the note that will be deleted: ' + req.params.id)
    const idToDelete = req.params.id;
    fs.readFile(notes_db, (err, data) => {
        currentNotes = (JSON.parse(data).notes);
        
        // gets the whole noteToDelete object (from just the id that we were passed) into its own array, so it can log it in the console or be accessed, in case that's useful
        const noteToDelete = currentNotes.filter(note => note.id === idToDelete);
        console.log(noteToDelete)

        // makes an array of the notes excluding the note that was clicked delete
        notesAfterDeleting = currentNotes.filter(note => note.id !== idToDelete);

        // write the db file with the new array excluding the deleted note
        fs.writeFile(notes_db, JSON.stringify({ notes: notesAfterDeleting }, null, 2), function (err) {
            if (err) throw err;
            console.log('Deleted!')
            res.json(notesAfterDeleting);
        });
        
    })
})

// catch any undesignated website url and go to home
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// functions



