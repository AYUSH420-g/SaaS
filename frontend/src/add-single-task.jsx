import { useState } from 'react';
import './add-single-task.css'; // Will share standard-form classes from create-project
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Type, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

function Addsngltask() {
    const [title, settitle] = useState('');
    const [desc, setdesc] = useState('');
    const [priority, setpriority] = useState('High');
    const navigate = useNavigate();
    const { id } = useParams();

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const res=await axios.post(`http://localhost:3003/createtask/${id}`, { title, desc, priority});
            console.log(res);
            navigate(`/projectdetails/${id}`);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="create-task-page">
            <div className="page-header">
                <div>
                    <h1>Add New Task</h1>
                    <p className="page-subtitle">Create a new task for this project</p>
                </div>
            </div>

            <div className="form-container glass-panel">
                <form className="standard-form border-glow-on-focus" onSubmit={handlesubmit}>

                    <div className="input-wrapper">
                        <label>Task Title</label>
                        <div className="input-icon-group">
                            <Type size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="e.g. Design Login Page"
                                value={title}
                                onChange={(e) => settitle(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-row split-half">
                        <div className="input-wrapper">
                            <label>Priority Level</label>
                            <div className="input-icon-group select-group">
                                <AlertCircle size={18} className="input-icon" />
                                <select value={priority} onChange={(e) => setpriority(e.target.value)}>
                                    <option value="High">High Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="Low">Low Priority</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label>Task Description (Optional)</label>
                        <div className="input-icon-group textarea-group">
                            <FileText size={18} className="input-icon" />
                            <textarea
                                placeholder="Detailed instructions or context"
                                value={desc}
                                onChange={(e) => setdesc(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="primary submit-btn">
                        Create Task <CheckCircle2 size={18} />
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Addsngltask;