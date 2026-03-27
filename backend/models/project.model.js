import mongoose from "mongoose";

const projectschema=new mongoose.Schema(
    {

         name: {
      type: String,
      required: true,
      trim: true
    },

    desc: {
      type: String,
      trim: true
    },

    owner: {
      type: String,
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

const Project = mongoose.model("Project", projectschema);

export default Project;
