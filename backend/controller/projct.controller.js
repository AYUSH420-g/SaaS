import Project from "../models/project.model.js";

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
export {proj,dproj};