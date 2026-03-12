import mongoose, { model, Schema } from "mongoose";
import { Task } from "./task.model.js";

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
   
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Todo = new model("Todo", todoSchema);
