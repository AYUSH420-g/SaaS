import { useParams } from 'react-router-dom';
import './projectdetails.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layers, Trash2, Clock, CheckCircle2, Circle, Flame, ArrowDown, Minus, Users, X } from 'lucide-react';

function Projectdetails() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const [d, setdata] = useState([]);
    const { id } = useParams();
    const [flag, setflag] = useState(false);

    const [selectedTask, setSelectedTask] = useState(null);
    const [projectMembers, setProjectMembers] = useState([]);
    const [taskMembers, setTaskMembers] = useState([]);
    const [membersModalOpen, setMembersModalOpen] = useState(false);

    const deletebtn=async(_id)=>{
        try{
            const res=await axios.delete(`http://localhost:3003/deletetask/${_id}`);
            setflag(!flag);
        }
        catch(err)
        {
            console.log(err);
        }

    }

    const openTaskMembersModal = async (t) => {
        setSelectedTask(t._id);
        setTaskMembers(t.assignedTo || []);
        setMembersModalOpen(true);
        try {
            const r = await axios.get(`http://localhost:3003/getmember/${id}`);
            setProjectMembers(r.data);
        } catch(e) {
            console.log(e);
        }
    };

    const closeTaskMembersModal = () => {
        setMembersModalOpen(false);
        setSelectedTask(null);
        setProjectMembers([]);
        setTaskMembers([]);
    };

    const toggleTaskMember = async (memberId) => {
        try {
            if (taskMembers.includes(memberId)) {
                await axios.post("http://localhost:3003/task/removemember", {
                    taskId: selectedTask,
                    memberId: memberId
                });
                setTaskMembers(prev => prev.filter(i => i !== memberId));
                setdata(d.map(t => t._id === selectedTask ? {...t, assignedTo: t.assignedTo.filter(i => i !== memberId)} : t));
            } else {
                await axios.post("http://localhost:3003/task/addmember", {
                    taskId: selectedTask,
                    memberId: memberId
                });
                setTaskMembers(prev => [...prev, memberId]);
                setdata(d.map(t => t._id === selectedTask ? {...t, assignedTo: [...t.assignedTo, memberId]} : t));
            }
        } catch (e) {
            console.log(e);
        }
    };

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
    }, [id,flag]);

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

                        <div className="detail-actions" style={{ display: "flex", gap: "8px", flexDirection: "row", marginTop: "16px" }}>
                            <button className="action-members" 
                                style={{ flex: 1, padding: "8px 12px", fontSize: "13px", background: "transparent", border: "1px solid var(--border-medium)", borderRadius: "6px", color: "var(--text-main)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }} 
                                onClick={() => openTaskMembersModal(task)}>
                                <Users size={16} /> Members
                            </button>
                            {task.project_id?.owner === user?._id && (
                                <button className="del-btn" style={{ flex: 1 }} onClick={()=>{deletebtn(task._id)}}>
                                    <Trash2 size={16} /> Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {membersModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content members-modal" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-medium)", borderRadius: "8px", width: "90%", maxWidth: "480px", display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)"}}>
                        <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-app)"}}>
                            <h2 style={{ fontSize: "18px", margin: 0, color: "var(--text-main)", fontWeight: "600" }}>Manage Task Members</h2>
                            <button className="close-btn" onClick={closeTaskMembersModal} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "4px" }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="members-list" style={{ padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "60vh" }}>
                            {(() => {
                                const isProjectOwner = d.find(task => task._id === selectedTask)?.project_id?.owner === user?._id;
                                const filteredMembers = isProjectOwner 
                                    ? projectMembers 
                                    : projectMembers.filter(f => taskMembers.includes(f._id));

                                if (filteredMembers.length === 0) {
                                    return <p className="no-friends" style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "14px", padding: "24px 0" }}>
                                        {isProjectOwner ? "No project members available." : "No members assigned to this task."}
                                    </p>;
                                }

                                return filteredMembers.map(f => {
                                    const isMember = taskMembers.includes(f._id);
                                    return (
                                        <div key={f._id} className="member-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "var(--bg-app)", border: "1px solid var(--border-subtle)", borderRadius: "6px" }}>
                                            <div className="member-info" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                <div className="avatar-circle" style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, var(--neon-cyan), var(--brand-primary))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px" }}>
                                                    {f.name ? f.name[0].toUpperCase() : (f.email ? f.email[0].toUpperCase() : 'U')}
                                                </div>
                                                <div className="member-details" style={{ display: "flex", flexDirection: "column" }}>
                                                    <span className="member-name" style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-main)" }}>{f.name || 'Unnamed User'}</span>
                                                    <span className="member-email" style={{ fontSize: "12px", color: "var(--text-muted)" }}>{f.email}</span>
                                                </div>
                                            </div>
                                            {isProjectOwner && (
                                                <button 
                                                    className={`toggle-member-btn ${isMember ? 'remove' : 'add'}`}
                                                    style={{ padding: "6px 12px", fontSize: "12px", fontWeight: "600", borderRadius: "4px", cursor: "pointer", border: "1px solid transparent", background: isMember ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)", color: isMember ? "var(--status-danger)" : "var(--status-success)", borderColor: isMember ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)" }}
                                                    onClick={() => toggleTaskMember(f._id)}
                                                >
                                                    {isMember ? 'Remove' : 'Add to Task'}
                                                </button>
                                            )}
                                        </div>
                                    );
                                });
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Projectdetails;