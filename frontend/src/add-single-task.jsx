import axios from "axios";
import "./add-single-task.css";
import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
function Ast() {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Low');
    const [status, setStatus] = useState('Todo');
    const navigate=useNavigate();
    const {id}=useParams();

    const create_task=async (e)=>{
            e.preventDefault();
        try{
            console.log(id);
            const res=await axios.post("http://localhost:3003/task",
                {
                    title:title,
                    description:description,
                    priority:priority,
                    status:status,
                    project_id:id
                }

            )
            navigate("/project-page");

        }
        catch(err)
        {
            console.log(err);
        }
    };



    return (
        <div className="create-task">

            <h1>Create Task</h1>

            <form className="task-form" onSubmit={create_task}>

                <div className="form-group">
                    <label>Task Title</label>
                    <input
                        type="text"
                        placeholder="Enter task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Priority</label>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option>Todo</option>
                        <option>In Progress</option>
                        <option>Done</option>
                    </select>
                </div>

                <button type="submit" >Create Task</button>

            </form>

        </div>
    );
}

export default Ast;