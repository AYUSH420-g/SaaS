import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Request from "../models/req.model.js";

const proj=async (req,res)=>{

    try{
        const{name,owner,desc,members}=req.body;
        const project=new Project({
            name,owner,desc,
            members: Array.isArray(members) ? members : []
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

const au = async (req, res) => {
    try {
        const userId = req.query.userId; 

        const requests = await Request.find({
            status: "accepted",
            $or: [
                { senderId: userId },
                { receiverId: userId }
            ]
        })
        .populate("senderId", "name email")
        .populate("receiverId", "name email");

        const members = requests.map((r) => {
            if (r.senderId._id.toString() === userId) {
                return r.receiverId;
            } else {
                return r.senderId;
            }
        });

        res.json(members);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "server error" });
    }
};

const gm = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await Project.findById(projectId)
            .populate("members");

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(project.members);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
};

export {proj,dproj,sd,au,gm};