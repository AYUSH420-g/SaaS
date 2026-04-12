import Task from "../models/task.model.js";
import Project from "../models/project.model.js";

const v = async (req, res) => {
    try {
        const project_id = req.params.id;

        const { title, desc, priority, assignedTo } = req.body; 

        if (!project_id) {
            return res.status(400).json({ message: "project_id is required" });
        }

        const task = new Task({
            title,
            desc,
            priority,
            project_id,
            assignedTo: Array.isArray(assignedTo) ? assignedTo : [], 
        });

        await task.save();

        res.status(201).json({ message: "Task created", task });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

const g = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Task.find({ project_id: id }).populate('project_id', 'name owner');
        
        if (!data) {
            return res.status(404).json({
                message: "Data not found"
            });
        }

        const project = await Project.findById(id);
        if (project) {
            for (let task of data) {
                const validMembers = task.assignedTo.filter(memberId => 
                    project.members.some(pMemberId => pMemberId.toString() === memberId.toString())
                );

                if (validMembers.length !== task.assignedTo.length) {
                    task.assignedTo = validMembers;
                    await task.save();
                }
            }
        }

        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

const dt=async(req,res)=>{

    const id=req.params.id;
    try{
        const task=await Task.find({assignedTo:id}).populate('project_id', 'name owner members');
        res.status(200).json(task);
    }
    catch(err)
    {
        
        console.log(err);
    }

}

const addMemberTask = async (req, res) => {
    try {
        const { taskId, memberId } = req.body;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        if (!task.assignedTo.includes(memberId)) {
            task.assignedTo.push(memberId);
            await task.save();
        }
        res.status(200).json({ message: "Member added", task });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

const removeMemberTask = async (req, res) => {
    try {
        const { taskId, memberId } = req.body;
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.assignedTo = task.assignedTo.filter(id => id.toString() !== memberId);
        await task.save();
        
        res.status(200).json({ message: "Member removed", task });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

const dp = async (req, res) => {
    // console.log("BACK IN");
    try {
        const id = req.params.id;
        const resp = await Task.deleteMany({ project_id: id });
        const data = await Project.findByIdAndDelete(id);
        if (!data) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({ message: "Deleted successfully", data });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

const gc=async(req,res)=>{

    const id=req.params.id;
    try{
        const total = await Task.countDocuments({assignedTo:id});
        const pending = await Task.countDocuments({status:"Todo",assignedTo:id});
        const complete = await Task.countDocuments({status:"Done",assignedTo:id});
        //   const overdue = await Task.countDocuments({status:"Todo"});
        res.status(200).json({total,pending,complete});
    }
    catch(err)
    {
        console.log(err);
    }

};
const dltk=async(req,res)=>{

    try{
    const id=req.params.id;
    const dt=await Task.findByIdAndDelete(id);
    res.status(200).json({dt});
    }
    catch(err)
    {
        console.log(err);
    }

}
export {v,g,dt,dp,gc,dltk, addMemberTask, removeMemberTask};