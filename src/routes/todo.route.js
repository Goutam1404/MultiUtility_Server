import {
  createTodo,
  getAllTodo,
  deleteTodo,
  updateTodo,
} from "../controllers/todo.controller.js";

import {
  addTask,
  updateTask,
  getTask,
  deleteTask,
  toggleTask,
} from "../controllers/task.controller.js";

import { Router } from "express";
import { useAuth } from "../middleware/user.middleware.js";

const todosRouter = Router();
todosRouter.post("/create", useAuth, createTodo);
todosRouter.get("/", useAuth, getAllTodo); //getting all todos
todosRouter.patch("/:todoId", useAuth, updateTodo);
todosRouter.delete("/:todoId", useAuth, deleteTodo);

todosRouter.get("/task/:todoId", useAuth, getTask); //getting all tasks
todosRouter.post("/task/:todoId", useAuth, addTask); //title as task
todosRouter.patch("/task/edit/:todoId/:taskId", useAuth, updateTask);
todosRouter.patch("/task/toggle/:todoId/:taskId", useAuth, toggleTask);
todosRouter.delete("/task/:todoId/:taskId", useAuth, deleteTask);

export default todosRouter;
