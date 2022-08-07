const express = require('express');
const path = require('path');
const { readFromFile, readAndAppend,readAndDelete  } = require('./helpers/fsUtils');
const uuid = require('./helpers/uuid');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => 
    {
        readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
    }
);

// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text ) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.delete(`/api/notes/:id`, (req, res) => {
    console.info(`${req.method} request received to delete a note`);
    const id = req.params.id.toLowerCase();

    if (id) {
        readAndDelete(id, './db/db.json');

        const response = {
            status: 'success',
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Errpr in deleting note');
    }
});

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀`));
