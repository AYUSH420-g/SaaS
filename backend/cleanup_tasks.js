import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./models/task.model.js";
import Project from "./models/project.model.js";

dotenv.config();

const cleanupTasks = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/taskhive");
        console.log("Connected to DB");

        const tasks = await Task.find();
        let updatedCount = 0;

        for (const task of tasks) {
            if (!task.project_id) continue;

            const project = await Project.findById(task.project_id);
            if (!project) continue;

            // Only keep members who are actually in the project
            const validMembers = task.assignedTo.filter(memberId => 
                project.members.some(pMemberId => pMemberId.toString() === memberId.toString())
            );

            if (validMembers.length !== task.assignedTo.length) {
                task.assignedTo = validMembers;
                await task.save();
                updatedCount++;
            }
        }

        console.log(`Cleanup complete. Updated ${updatedCount} tasks.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanupTasks();
