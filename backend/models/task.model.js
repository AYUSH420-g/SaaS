import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low"
    },

    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo"
    },

    // project_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Project",
    //   required: true
    // }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;