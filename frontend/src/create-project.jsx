import { useState } from 'react';
import './create-project.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, User, AlignLeft, CheckCircle2 } from 'lucide-react';

function Createproj() {
    const [name, setname] = useState('');
    const [desc, setdesc] = useState('');
    const [owner, setowner] = useState('');
    const navigate = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3003/createproject", 
                { name, owner, desc });
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
                                placeholder="e.g. John Doe"
                                value={owner}
                                onChange={(e) => setowner(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label>Description (Optional)</label>
                        <div className="input-icon-group textarea-group">
                            <AlignLeft size={18} className="input-icon" />
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