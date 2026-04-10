import { useEffect, useState } from 'react';
import './project-page.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Eye, PlusCircle, Trash2, FolderDot } from 'lucide-react';

function Project() {
    const navigate = useNavigate();
    const [projectdata, setprojdata] = useState([]);
    const [reload, setreload] = useState(false);

    function cppage() { navigate("/create-project"); }
    function viewbutton(id) { navigate(`/projectdetails/${id}`); }
    function editbutton(id) { navigate(`/add-single-task/${id}`); }

    const delbutton = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:3003/deleteproj/${id}`);
            console.log(res.data);
            console.log("Successfully deleted");
            setreload(reload => !reload);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get("http://localhost:3003/displayproject");
                setprojdata(res.data);
                console.log("in");
            } catch (err) {
                console.log(err);
            }
        };
        fetchProjects();
    }, [reload]);

    return (
        <div className="projects-page">
            <div className="page-header">
                <div>
                    <h1>Active Projects</h1>
                    <p className="page-subtitle">Manage your workspaces and track team progress</p>
                </div>
                <button className="primary header-btn" onClick={cppage}>
                    <Plus size={18} /> New Project
                </button>
            </div>

            <div className="project-grid">
                {projectdata.map((p) => (
                    <div className="project-card" key={p._id}>
                        <div className="project-header">
                            <div className="project-icon">
                                <FolderDot size={20} />
                            </div>
                            <h3>{p.name}</h3>
                        </div>

                        <div className="project-meta">
                            <span className="meta-label">Owner</span>
                            <span className="meta-value">{p.owner}</span>
                        </div>

                       

                        <div className="project-actions">
                            <button className="action-view" onClick={() => viewbutton(p._id)}>
                                <Eye size={16} /> View
                            </button>
                            <button className="action-add" onClick={() => editbutton(p._id)}>
                                <PlusCircle size={16} /> Task
                            </button>
                            <button className="action-delete" onClick={() => delbutton(p._id)}>
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Project;