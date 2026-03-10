import {
  createTodo,
  getAllTodo,
  deleteTodo,
  updateTodo,
} from "../controllers/todo.controller.js";
import { Router } from "express";
import { useAuth } from "../middleware/user.middleware.js";

const todosRouter = Router();
todosRouter.post("/create/", useAuth, createTodo);
todosRouter.get("/", useAuth, getAllTodo); //getting all todos
todosRouter.post("/update/:todoId", useAuth, updateTodo);
todosRouter.delete("/delete/:todoId", useAuth, deleteTodo);

export default todosRouter;
