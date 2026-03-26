import { useParams } from 'react-router-dom';
import './projectdetails.css';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

function Projectdetails() {

    const [d,setdata]=useState([]);
    const { id } = useParams();
    // console.log(id);

    // Sample data (you can later replace with API)
    useEffect(()=>{
        const fetchdata=async()=>{

        try{
        const res=await axios.get(`http://localhost:3003/gettask/${id}`);
        console.log(res.data);
        
        setdata(res.data);
        }
        catch(err)
        {
            console.log(err);
        }

    }
    fetchdata();
    },[id])

    return (
        <div className="project-details">
            <h1>Project Tasks</h1>

            <div className="task-list">
                {d.map((task) => (
                    <div className="task-card" key={task._id}>
                        <h3>{task.title}</h3>
                        <p>Priority: {task.priority}</p>
                        <p>Status: {task.status}</p>

                        <div className="task-actions">
                            <button>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Projectdetails;