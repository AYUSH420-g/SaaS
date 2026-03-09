import axios from "axios";
import {useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateProject() {

    const[pname,setpname]=useState('');
    const[des,setdes]=useState('');
    const[deadline,setdl]=useState('');
    const[poname,setponame]=useState('');
    const navigate=useNavigate();

    const subproj=async(e)=>{

        e.preventDefault();

        try{
            const res=await axios.post("http://localhost:3003/projects",
                {
                    name: pname,
                    description: des,
                    deadline: deadline,
                    owner: poname
                }
            )

            console.log(res.data);
            navigate("/project-page");
            
        }
        catch(err)
        {
            console.log(err);
        }
    }
    return (
        <div className="create-project">

            <h1>Create Project</h1>

            <form className="project-form" onSubmit={subproj}>

                <div className="form-group">
                    <label>Project Name</label>
                    <input type="text" placeholder="Enter project name" value={pname} 
                    onChange={(e)=>setpname(e.target.value)} />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea placeholder="Enter project description" value={des} 
                    onChange={(e)=>setdes(e.target.value)}></textarea>
                </div>

                <div className="form-group">
                    <label>Deadline</label>
                    <input type="date" value={deadline} 
                    onChange={(e)=>setdl(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label>Project Owner</label>
                    <input type="text" placeholder="Owner name" value={poname} 
                    onChange={(e)=>setponame(e.target.value)}/>
                </div>

                <input type="submit" value="create"></input>

            </form>

        </div>
    );
}

export default CreateProject;