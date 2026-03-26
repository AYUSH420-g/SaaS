import { useEffect, useState } from 'react';
import './task-page.css';
import axios from 'axios';

function Task() {

    const [task,settask]=useState([]);
    
    const priorityOrder = {
    High: 1,
    Medium: 2,
    Low: 3
        };

    const sortedTasks = [...task].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    useEffect(()=>{

        const fun=async()=>{

            try{
            const res=await axios.get("http://localhost:3003/displaytask");
            settask(res.data);

            }
            catch(err)
            {
                console.log(err);
            }
            
        }
        fun();
    },[])
    return (
        <div className="tasks">
            <h1>Total Tasks</h1>

            {/* <button>Create Task</button> */}

            <table>
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Status</th>
                        <th>Priority</th>
                    </tr>
                </thead>

                <tbody>
                    {sortedTasks.map((t) => (
                        <tr key={t._id}>
                            <td>{t.title}</td>
                            <td>{t.status}</td>
                            <td>{t.priority}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default Task;