import Project from "../models/project.model.js";
import User from "../models/user.model.js";

const proj=async (req,res)=>{

    try{
        const{name,owner,desc}=req.body;
        const project=new Project({
            name,owner,desc
        });
        await project.save();
        res.status(201).json({ message: "Project created", project });

    }
    catch(err)
    {
        console.log(err);
    }
}

const dproj=async (req,res)=>{

    try{
         const projects = await Project.find();
         res.status(200).json(projects);

    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

const sd=async(req,res)=>{
     try {
        const { query } = req.query;

        if (!query) {
            return res.status(200).json([]);
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        }).select("_id username email"); 

        res.status(200).json(users);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
}

export {proj,dproj,sd};