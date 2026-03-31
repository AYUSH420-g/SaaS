import { useState, useEffect } from 'react';
import './team-page.css';
import axios from 'axios';
import { Mail, CheckCircle, ShieldCheck, Plus } from 'lucide-react';

function Team() {
    const [memberdata, setMemdata] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [input, setInput] = useState("");

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                console.log(input);
                
                const res = await axios.get("http://localhost:3003/search-data",{
                    params:{
                        query:input
                    }
                });
                setMemdata(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTeam();
    }, [input]);

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    };

    return (
        <div className="team-page">
            <div className="page-header">
                <div>
                    <h1>Team Members</h1>
                    <p className="page-subtitle">People in your workspace</p>
                </div>

                <button className="add-member-btn" onClick={() => setShowForm(!showForm)}>
                    <Plus size={16} /> Add Member
                </button>
            </div>

            {showForm && (
                <div className="add-member-box">
                    <input
                        type="text"
                        placeholder="Enter username or email"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button className="submit-btn">
                        Add
                    </button>
                </div>
            )}

            <div className="team-grid">
                {memberdata.map((member, index) => {
                    const glowColors = ['cyan', 'purple', 'pink', 'green'];
                    const colorClass = glowColors[index % glowColors.length];

                    return (
                        <div className={`team-card ${colorClass}`} key={member._id}>
                            <div className="avatar-section">
                                {/* <div className="avatar-circle">
                                    {getInitials(member.name)}
                                </div> */}
                            </div>


                            <div className="member-contact">
                                <span className="contact-link">
                                    <span>{member.email}</span>
                                </span>
                            </div>

                            {/* <div className="member-status">
                                <CheckCircle size={14} className="status-dot active" />
                                <span>Active now</span>
                            </div> */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Team;