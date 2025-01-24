const express = require('express');
const { AddNotes, GetNotes, delNote,update } = require('../controller/NoteController'); // Ensure delNote is imported
const { validateToken } = require('../middleware/authmidle'); // Corrected path for middleware
const router = express.Router();

// Routes
router.post('/addnote', validateToken, AddNotes); // Add a new note
router.get('/getnotes', validateToken, GetNotes); // Get all notes for the logged-in user
router.delete('/deletenote/:id', validateToken, delNote); // Delete a specific note by ID
router.put('/update/:id',validateToken,update)

module.exports = router;
