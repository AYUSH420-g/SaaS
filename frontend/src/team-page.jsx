import { useState, useEffect } from 'react';
import './team-page.css';
import axios from 'axios';
import { Plus, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Team() {
    const [memberdata, setMemdata] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [input, setInput] = useState("");
    const [sendingTo, setSendingTo] = useState(null);
    const [toast, setToast] = useState(null);

    const navigate = useNavigate();

    // ✅ Safe user parsing
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // ✅ Redirect if not logged in
    useEffect(() => {
        if (!user?._id) {
            navigate("/");
        }
    }, []);

    // ✅ Debounced search
    useEffect(() => {
        const delay = setTimeout(() => {
            const fetchTeam = async () => {
                try {
                    if (!input.trim()) {
                        setMemdata([]);
                        return;
                    }

                    const res = await axios.get("http://localhost:3003/search-data", {
                        params: { query: input }
                    });

                    setMemdata(res.data);
                } catch (err) {
                    console.log(err);
                }
            };

            fetchTeam();
        }, 400);

        return () => clearTimeout(delay);
    }, [input]);

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    };

    // ✅ Send request using receiverId
    const sendFriendRequest = async (receiverId) => {
        try {
            setSendingTo(receiverId);

            await axios.post("http://localhost:3003/friend/send", {
                senderId: user._id,
                receiverId
            });

            setToast({ message: "Friend request sent!", type: "success" });
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to send request";
            setToast({ message: msg, type: "error" });
        } finally {
            setTimeout(() => setToast(null), 3000);
            setSendingTo(null);
        }
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
                </div>
            )}

            <div className="team-grid">
                {memberdata.map((member, index) => {
                    const glowColors = ['cyan', 'purple', 'pink', 'green'];
                    const colorClass = glowColors[index % glowColors.length];
                    const isOwnCard = member._id === user._id;

                    return (
                        <div className={`team-card ${colorClass}`} key={member._id}>
                            <div className="avatar-section">
                                <div className="avatar-circle">
                                    {getInitials(member.name || member.email)}
                                </div>
                            </div>

                            <div className="member-contact">
                                <span className="contact-link">
                                    {member.email}
                                </span>
                            </div>

                            {!isOwnCard && (
                                <button
                                    className="add-friend-btn"
                                    onClick={() => sendFriendRequest(member._id)}
                                    disabled={sendingTo === member._id}
                                >
                                    <UserPlus size={14} />
                                    {sendingTo === member._id ? 'Sending...' : 'Add Friend'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* ✅ Toast */}
            {toast && (
                <div className={`team-toast ${toast.type}`}>
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
}

export default Team;