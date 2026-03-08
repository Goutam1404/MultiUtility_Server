import { Note } from "../models/note.model";

const createNote = async (req, res) => {
  try {
    const { title, description } = req.body();
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const note = await Note.create({ title, description });
    await note.save();

    return res.status(200).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create a note",
      error: error.message,
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { title, description } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { title, description } },
      { new: true, runValidators: true }
    );
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found or unauthorized." });
    }

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update the note",
      error: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, user: userId });
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found or unauthorized." });
    }

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the note",
      error: error.message,
    });
  }
};

const getAllNote = async (req, res) => {
  try {
    const userId = req.userId;

    const notes = await Note.find({ user: userId });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched the notes",
      count: notes.length,
      data: notes,
    });
  } catch (error) {}
};

const togglePin = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const note = await Note.findOne({ user: userId, _id: id });
    if (!note)
      return res.status(404).json({
        success: false,
        message: "Failed to find the note",
      });
    note.isPinned = !note.isPinned;
    await note.save();
    return res.status(200).json({
      success: true,
      message: `Note ${note.isPinned ? "pinned" : "unpinned"}`,
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to toggle pin",
      error,
    });
  }
};

export { createNote, updateNote, deleteNote, getAllNote, togglePin };
