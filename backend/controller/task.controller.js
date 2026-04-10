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

const g=async(req,res)=>{
    try{
        const id = req.params.id;
        // console.log(id);
        const data = await Task.find({project_id: id});
        console.log(data);
        if (!data) {
            return res.status(404).json({
                message: "Data not found"
            });
        }
        res.status(200).json(data);
    }
    catch(err)
    {
        console.log(err);
    }
}

const dt=async(req,res)=>{

    const id=req.params.id;
    try{
        const task=await Task.find({assignedTo:id});
        res.status(200).json(task);
    }
    catch(err)
    {
        
        console.log(err);
    }

}

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
export {v,g,dt,dp,gc,dltk};