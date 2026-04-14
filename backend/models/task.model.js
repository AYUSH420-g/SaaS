import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    desc: {
      type: String,
      trim: true
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low"
    },

    assignedTo: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
],

    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo"
    },
    assignedTo: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    deadline: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;