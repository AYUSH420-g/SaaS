import { useState, useEffect } from 'react';
import './team-page.css';
import axios from 'axios';
import { Mail, CheckCircle, ShieldCheck, User as UserIcon } from 'lucide-react';

function Team() {
    const [teamdata, setTeamdata] = useState([]);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await axios.get("http://localhost:3003/team-data");
                setTeamdata(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTeam();
    }, []);

    // Helper to extract initials from name
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
            </div>

            <div className="team-grid">
                {teamdata.map((member, index) => {
                    // Create an alternating glow color based on index
                    const glowColors = ['cyan', 'purple', 'pink', 'green'];
                    const colorClass = glowColors[index % glowColors.length];

                    return (
                        <div className={`team-card ${colorClass}`} key={member._id}>
                            <div className="avatar-section">
                                <div className="avatar-circle">
                                    {getInitials(member.name)}
                                </div>
                            </div>

                            <div className="member-info">
                                <h3>{member.name}</h3>
                                <p className="member-role">
                                    <ShieldCheck size={14} /> Member
                                </p>
                            </div>

                            <div className="member-contact">
                                <a href={`mailto:${member.email}`} className="contact-link">
                                    <Mail size={16} />
                                    <span>{member.email}</span>
                                </a>
                            </div>

                            {/* Simulated active status */}
                            <div className="member-status">
                                <CheckCircle size={14} className="status-dot active" />
                                <span>Active now</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Team;