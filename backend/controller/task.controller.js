import Task from "../models/task.model.js";

const v=async(req,res)=>{

    try{
        const {title,discription,priority,status}=req.body;
        const task=new Task({title,discription,priority,status});
        await task.save();
        res.status(201).json({ message: "Task created", task });

    }
    catch(err)
    {
        console.log(err);
    }
};
export default v;