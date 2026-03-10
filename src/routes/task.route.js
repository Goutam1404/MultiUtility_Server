import { Router } from "express";
import {
  addTask,
  updateTask,
  getTask,
  deleteTask,
  toggleTask,
} from "../controllers/task.controller.js";
import { useAuth } from "../middleware/user.middleware.js";

const taskRouter = Router();

taskRouter.get("/:todoId", useAuth, getTask);
taskRouter.post("/:todoId", useAuth, addTask);
taskRouter.post("/edit/:todoId/:taskId", useAuth, updateTask);
taskRouter.post("/toggle/:todoId/:taskId", useAuth, toggleTask);
taskRouter.delete("/delete/:todoId/:taskId", useAuth, deleteTask);

export default taskRouter;
