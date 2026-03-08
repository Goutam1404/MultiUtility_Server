import {Router} from "express";
import { useAuth } from "../middleware/user.middleware.js";
import { createNote, deleteNote, getAllNote, togglePin, updateNote } from "../controllers/note.controller";

const notesRouter= Router();
notesRouter.get("/",useAuth,getAllNote);
notesRouter.post("/create",useAuth,createNote);
notesRouter.post("/edit/:id",useAuth,updateNote);
notesRouter.post("/pin/:id",useAuth,togglePin);
notesRouter.delete("/delete/:id",useAuth,deleteNote);

export default notesRouter