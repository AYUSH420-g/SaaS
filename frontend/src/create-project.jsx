import { useState,useEffect} from 'react';
import './create-project.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, User, CheckCircle2, Calendar } from 'lucide-react';

function Createproj() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const [name, setname] = useState('');
    const [desc, setdesc] = useState('');
    const [owner, setowner] = useState(user?.name || "");
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [deadline, setDeadline] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
    const fetchUsers = async () => {
        try {
            

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/all-users`,{
                   params: {
                    userId: user._id
                }
            });
            setMembers(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    fetchUsers();
}, []);

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/createproject`, 
                {  name,
                    owner:user._id,
                    desc,
                    deadline,
                    members: selectedMembers });
            console.log(res);
            navigate("/project-page");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="create-proj-page">
            <div className="page-header">
                <div>
                    <h1>Create New Project</h1>
                    <p className="page-subtitle">Setup a new workspace for your team</p>
                </div>
            </div>

            <div className="form-container glass-panel">
                <form className="standard-form border-glow-on-focus" onSubmit={handlesubmit}>
                    <div className="input-wrapper">
                        <label>Project Name</label>
                        <div className="input-icon-group">
                            <FolderPlus size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="e.g. Website Redesign"
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label>Owner</label>
                        <div className="input-icon-group">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                value={owner}
                                onChange={(e) => setowner(e.target.value)}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label>Deadline</label>
                        <div className="input-icon-group">
                            <Calendar size={18} className="input-icon" />
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label>Add Members</label>
                        <div className="input-icon-group">
                            {/* <User size={18} className="input-icon" /> */}
                            <select
                                multiple
                                value={selectedMembers}
                                onChange={(e) => {
                                    const values = Array.from(e.target.selectedOptions, option => option.value);
                                    setSelectedMembers(values);
                                }}>
                                {members.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label>Description (Optional)</label>
                        <div className="input-icon-group textarea-group">
                            
                            <textarea
                                placeholder="What is this project about?"
                                value={desc}
                                onChange={(e) => setdesc(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="primary submit-btn">
                        Create Project <CheckCircle2 size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Createproj;