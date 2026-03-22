// import { Warning } from "postcss";
import User from "../models/user.model.js";
// import { use } from "react";

const sgnup=async(req,res)=>{

    try{
        // console.log(req.body);
        const{name,email,pass}=req.body;
        const user = new User({
        name,
        email,
        pass
    });

    await user.save();

    res.json({message:"User created"});
}
catch(err)
{
    console.log(err);
}
}

const lgin=async(req,res)=>{
    try{
        const {email,pass}=req.body;

        const user=await User.findOne({email});

        if(!user)
        {
            return res.status(400).json({message: "Invalid email"})
        }
         if(user.pass !== pass){
            return res.status(400).json({ message: "Invalid password" });
        }

        res.status(200).json({
            message: "Login successful",
            user: user
        });

    }
    catch(err)
    {
       res.status(500).json({ error: err.message });
    }
}
export {sgnup,lgin};