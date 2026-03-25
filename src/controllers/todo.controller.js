import { Todo } from "../models/todo.model.js";


const createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }
    const newTodo = await Todo.create({ title, user: req.userId });
    return res.status(200).json({
      success: false,
      message: "newTodo table created",
      newTodo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create a todo table",
      error: error.message,
    });
  }
};

const getAllTodo = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId }).sort("-createdAt");
    return res.status(200).json({
      success: false,
      message: "Successfully fetched all the todo table",
      todos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the todos",
      error: error.message,
    });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { title } = req.body;
    const updatedTodo = await Todo.findOneAndUpdate(
      { user: req.userId, _id: todoId },
      { $set: { title } },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found or unauthorized." });
    }

    return res
      .status(200)
      .json({ success: true, message: "✅ Todo Updated", updatedTodo });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update",
      error: error.message,
    });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    // console.log(todoId);
    
    const todo = await Todo.findOneAndDelete({ _id: todoId, user: req.userId });
    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Todo not found or unauthorized." });
    }
    return res
      .status(200)
      .json({ success: true, message: "Successfully deleted the todo", todo });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the todo",
      error: error.message,
    });
  }
};

export { createTodo, getAllTodo, updateTodo, deleteTodo };
