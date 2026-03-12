import mongoose, { model, Schema } from "mongoose";

const taskSchema = new Schema(
  {
    task: {
      type: String,
      trim: true,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    todo: {
      type: Schema.Types.ObjectId,
      ref: "Todo",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Task = new model("Task", taskSchema);
