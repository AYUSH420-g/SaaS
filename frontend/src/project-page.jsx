import { useEffect, useState } from 'react';
import './project-page.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Eye, PlusCircle, Trash2, FolderDot, Users, X } from 'lucide-react';

function Project() {
    const navigate = useNavigate();
    const [projectdata, setprojdata] = useState([]);
    const [reload, setreload] = useState(false);
    
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const [selectedProject, setSelectedProject] = useState(null);
    const [friends, setFriends] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    const [membersModalOpen, setMembersModalOpen] = useState(false);

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
    
    const openMembersModal = async (projectId) => {
        setSelectedProject(projectId);
        setMembersModalOpen(true);
        if (user?._id) {
            try {
                const friendsRes = await axios.get("http://localhost:3003/all-users", {
                    params: { userId: user._id }
                });
                setFriends(friendsRes.data);
                
                const memRes = await axios.get(`http://localhost:3003/getmember/${projectId}`);
                setProjectMembers(memRes.data.map(m => m._id));
            } catch(e) {
                console.log(e);
            }
        }
    }

    const closeMembersModal = () => {
        setMembersModalOpen(false);
        setSelectedProject(null);
        setFriends([]);
        setProjectMembers([]);
    }

    const toggleMember = async (friendId) => {
        try {
            if (projectMembers.includes(friendId)) {
                await axios.post("http://localhost:3003/removemember", {
                    projectId: selectedProject,
                    memberId: friendId
                });
                setProjectMembers(prev => prev.filter(id => id !== friendId));
            } else {
                await axios.post("http://localhost:3003/addmember", {
                    projectId: selectedProject,
                    memberId: friendId
                });
                setProjectMembers(prev => [...prev, friendId]);
            }
        } catch(e) {
            console.log(e);
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
                {projectdata.filter(p => p.owner === user?._id || p.members?.includes(user?._id)).map((p) => (
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
                            {p.owner === user?._id && (
                                <>
                                    <button className="action-add" onClick={() => editbutton(p._id)}>
                                        <PlusCircle size={16} /> Task
                                    </button>
                                    <button className="action-members" onClick={() => openMembersModal(p._id)}>
                                        <Users size={16} /> Team
                                    </button>
                                    <button className="action-delete" onClick={() => delbutton(p._id)}>
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {membersModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content members-modal">
                        <div className="modal-header">
                            <h2>Manage Project Members</h2>
                            <button className="close-btn" onClick={closeMembersModal}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="members-list">
                            {friends.length === 0 ? (
                                <p className="no-friends">No friends available to add.</p>
                            ) : (
                                friends.map(f => {
                                    const isMember = projectMembers.includes(f._id);
                                    return (
                                        <div key={f._id} className="member-item">
                                            <div className="member-info">
                                                <div className="avatar-circle">
                                                    {f.name ? f.name[0].toUpperCase() : (f.email ? f.email[0].toUpperCase() : 'U')}
                                                </div>
                                                <div className="member-details">
                                                    <span className="member-name">{f.name || 'Unnamed User'}</span>
                                                    <span className="member-email">{f.email}</span>
                                                </div>
                                            </div>
                                            <button 
                                                className={`toggle-member-btn ${isMember ? 'remove' : 'add'}`}
                                                onClick={() => toggleMember(f._id)}
                                            >
                                                {isMember ? 'Remove' : 'Add to Project'}
                                            </button>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Project;