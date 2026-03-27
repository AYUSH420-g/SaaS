import { useParams } from 'react-router-dom';
import './projectdetails.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layers, Trash2, Clock, CheckCircle2, Circle, Flame, ArrowDown, Minus } from 'lucide-react';

function Projectdetails() {
    const [d, setdata] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await axios.get(`http://localhost:3003/gettask/${id}`);
                setdata(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchdata();
    }, [id]);

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'done': return <CheckCircle2 size={16} className="status-icon done" />;
            case 'in progress': return <Clock size={16} className="status-icon in-progress" />;
            default: return <Circle size={16} className="status-icon todo" />;
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return <span className="lozenge high"><Flame size={12} /> High</span>;
            case 'medium': return <span className="lozenge medium"><Minus size={12} /> Med</span>;
            case 'low': return <span className="lozenge low"><ArrowDown size={12} /> Low</span>;
            default: return <span className="lozenge">Unknown</span>;
        }
    };

    return (
        <div className="project-details">
            <div className="page-header">
                <div>
                    <h1>Project Tasks</h1>
                    <p className="page-subtitle">Tasks associated with this project</p>
                </div>
            </div>

            <div className="task-grid">
                {d.map((task) => (
                    <div className="detail-card" key={task._id}>
                        <div className="detail-header">
                            <Layers size={18} className="card-icon" />
                            <h3>{task.title}</h3>
                        </div>

                        <div className="detail-meta">
                            <div className="meta-row">
                                <span className="meta-key">Status:</span>
                                <span className="meta-val">
                                    {getStatusIcon(task.status)}
                                    <span className={`status-text ${task.status?.toLowerCase().replace(' ', '-')}`}>
                                        {task.status}
                                    </span>
                                </span>
                            </div>
                            <div className="meta-row">
                                <span className="meta-key">Priority:</span>
                                <span className="meta-val">{getPriorityIcon(task.priority)}</span>
                            </div>
                        </div>

                        <div className="detail-actions">
                            <button className="del-btn">
                                <Trash2 size={16} /> Delete Task
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Projectdetails;