import { Task } from "../models/task.model.js";
import { Todo } from "../models/todo.model";

const addTask = async (req, res) => {
  try {
    //fetching user id and todo id
    const { todoId } = req.params;
    const { title } = req.body;
    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Task is required" });
    }
    //finding the todo table
    const table = await Todo.findOne({ _id: todoId, user: req.userId });
    if (!table) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found" });
    }
    //Creating the task
    const task = await Task.create({ task: title, todo: todoId });
    await task.save();
    // table.tasks.push({ task });
    // await table.save();
    return res
      .status(200)
      .json({ success: true, message: "Added the task", task });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add task",
      error: error.message,
    });
  }
};

const getTask = async (req, res) => {
  try {
    const { todoId } = req.params;
    const tasks = await Task.find({ todo: todoId });
    if (!tasks) {
      return res
        .status(401)
        .json({ success: false, message: "Table not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "All task found", tasks });
  } catch (error) {
    return res.stauts(500).json({
      success: false,
      message: "Error in fethcing tasks",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    //getting userId , table Id and task Id
    const { taskText } = req.body;
    const { todoId, taskId } = req.params;
    //finding the task and updating it
    const task = await Task.findOneAndUpdate(
      {
        todos: todoId,
        _id: taskId,
      },
      {
        $set: { task: taskText },
      },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    //updating the task
    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update the task",
      error: error.message,
    });
  }
};

const toggleTask = async (req, res) => {
  try {
    const { taskId, todoId } = req.params;
    const task = await Task.findById({ _id: taskId, todo: todoId });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    task.isCompleted = !task.isCompleted;
    await task.save();
    return res
      .status(200)
      .json({ success: true, message: "Toggled the completion state", task });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to toggle the task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    //fetching userId, todo table id and task id
    const { todoId, taskId } = req.params;
    //finding the task
    //deleteing the task
    const task = await Task.findByIdAndDelete({ todo: todoId, _id: taskId });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Deleted the task", task });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the task",
      error: error.message,
    });
  }
};

export { addTask, updateTask, getTask, deleteTask, toggleTask };
