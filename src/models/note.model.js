import mongoose, { model, Schema } from "mongoose";

const notesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User", // The model name to reference
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Note = new model("Notes", notesSchema);
