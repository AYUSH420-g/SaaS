import { useEffect, useState } from 'react';
import './add-single-task.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Type, AlertCircle, CheckCircle2 } from 'lucide-react';

function Addsngltask() {

    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [title, settitle] = useState('');
    const [desc, setdesc] = useState('');
    const [priority, setpriority] = useState('High');

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const call = async () => {
            try {
                const r = await axios.get(`http://localhost:3003/getmember/${id}`);
                setUsers(r.data);  
            } catch (err) {
                console.log(err);
            }
        };

        call(); 
    }, [id]);

    const handleRemoveMember = (memberId) => {
        setSelectedMembers(selectedMembers.filter(m => m._id !== memberId));
    };

    const handlesubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                `http://localhost:3003/createtask/${id}`,
                {
                    title,
                    desc,
                    priority,
                    assignedTo: selectedMembers.map(m => m._id)
                }
            );

            console.log(res);
            navigate(`/projectdetails/${id}`);

        } catch (err) {
            console.log(err);
        }
    };

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

                    {/* Task Title */}
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

                    {/* ✅ Members Dropdown */}
                    <div className="input-wrapper">
                        <label>Assign Members</label>

                        <select
                            onChange={(e) => {
                                const selectedUser = users.find(u => u._id === e.target.value);

                                if (selectedUser && !selectedMembers.find(m => m._id === selectedUser._id)) {
                                    setSelectedMembers([...selectedMembers, selectedUser]);
                                }
                            }}
                        >
                            <option value="">Select member</option>

                            {users.map((u) => (
                                <option key={u._id} value={u._id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>

                        {/* Selected Members */}
                        <div className="selected-members">
                            {selectedMembers.map((m) => (
                                <span key={m._id} className="member-chip">
                                    {m.name}
                                    <button type="button" onClick={() => handleRemoveMember(m._id)}>
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Priority */}
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

                    {/* Description */}
                    <div className="input-wrapper">
                        <label>Task Description (Optional)</label>
                        <div className="input-icon-group textarea-group">
                            <textarea
                                placeholder="Detailed instructions or context"
                                value={desc}
                                onChange={(e) => setdesc(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button type="submit" className="primary submit-btn">
                        Create Task <CheckCircle2 size={18} />
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Addsngltask;