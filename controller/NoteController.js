const NotesModel = require("../models/NotesModel.js");

// Function to Add a Note
const AddNotes = async (req, res) => {
  try {
    const { id: userId } = req.user; // Destructure `id` from the JWT payload
    console.log("User ID from token:", userId); // Debug log

    const { title, text } = req.body;

    // Validate input
    if (!title || !text) {
      return res.status(400).send({
        code: 400,
        success: false,
        message: "Title and text are required",
        error: true,
      });
    }

    // Create and save the note
    const newNote = new NotesModel({ title, text, userId });
    console.log("New Note:", newNote); // Debug log
    await newNote.save();

    return res.status(201).send({
      code: 201,
      success: true,
      message: "Note created successfully",
      error: false,
    });
  } catch (error) {
    console.error("Error adding note:", error);
    return res.status(500).send({
      code: 500,
      success: false,
      message: "Server error",
      error: true,
    });
  }
};

// Function to Fetch Notes
const GetNotes = async (req, res) => {
  try {
    const { id: userId } = req.user; // Destructure `id` from the JWT payload

    // Fetch notes for the logged-in user
    const notes = await NotesModel.find({ userId });

    if (!notes || notes.length === 0) {
      return res.status(404).send({
        code: 404,
        success: false,
        message: "No notes found for the logged-in user",
        error: true,
      });
    }

    return res.status(200).send({
      code: 200,
      success: true,
      message: "Notes fetched successfully",
      data: notes, // Return the user's notes
      error: false,
    });
  } catch (error) {
    return res.status(500).send({
      code: 500,
      success: false,
      message: "Server error",
      error: true,
    });
  }
};

// Function to Delete a Note
const delNote = async (req, res) => {
  try {
    const { id } = req.params; // Get the note ID from request parameters

    // Find and delete the note
    const deletedNote = await NotesModel.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      note: deletedNote,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params; // Note ID
    const userId = req.user.id; // User ID from the token

    console.log("Updating note with ID:", id);
    console.log("User ID:", userId);

    const { title, text } = req.body;

    // Check if the note exists and belongs to the user
    const note = await NotesModel.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found or not authorized." });
    }

    // Update the note
    note.title = title;
    note.text = text;
    await note.save();

    res.status(200).json({ success: true, message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Export the Functions
module.exports = {
  AddNotes,
  GetNotes,
  delNote,
  update
};
