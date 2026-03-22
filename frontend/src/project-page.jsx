// import { redirect } from 'react-router-dom';
import { useEffect } from 'react';
import './project-page.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';


function Project() {

    const navigate=useNavigate();
    const[projectdata,setprojdata]=useState([]);
    function cppage()
    {
        navigate("/create-project");
    }

    function viewbutton()
    {
        navigate("/projectdetails")
    }

    function editbutton()
    {
        navigate("/add-single-task")
    }

   useEffect(() => {

    const fetchProjects = async () => {
        try {

            const res = await axios.get("http://localhost:3003/displayproject");

            setprojdata(res.data);
            console.log(res.data);

        } 
        catch (err) {
            console.log(err);
        }
        };

        fetchProjects();

    }, []);

    return (
        <div className="projects">

            <h1>Projects</h1>

            <button onClick={cppage}>Create Project</button>

            <div className="project-list">

                {projectdata.map((p) => (

                    <div className="project-card" key={p._id}>

                        <h3>{p.name}</h3>

                        <div className="project-meta">
                            Owner: {p.owner}
                        </div>

                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>

                        <div className="project-actions">
                            <button onClick={viewbutton}>View</button>
                            <button onClick={editbutton}>Edit</button>
                            <button>Delete</button>
                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}
export default Project;