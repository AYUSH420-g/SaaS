import { useState, useEffect } from 'react';
import './notifications.css';
import axios from 'axios';
import { UserPlus, Check, X, Bell, UserCheck, Clock, Sparkles } from 'lucide-react';

function Notifications() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [toast, setToast] = useState(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/friend/requests`, {
                params: { userId: user._id }
            });
            setRequests(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user._id) {
            fetchRequests();
        } else {
            setLoading(false);
        }
    }, []);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAccept = async (requestId, senderName) => {
        try {
            setActionLoading(requestId);
            await axios.put(`http://localhost:3003/friend/accept/${requestId}`);
            setRequests(prev => prev.filter(r => r._id !== requestId));
            showToast(`You are now friends with ${senderName || 'this user'}!`, 'success');
        } catch (err) {
            console.log(err);
            showToast('Failed to accept request', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (requestId) => {
        try {
            setActionLoading(requestId);
            await axios.put(`http://localhost:3003/friend/reject/${requestId}`);
            setRequests(prev => prev.filter(r => r._id !== requestId));
            showToast('Request declined', 'info');
        } catch (err) {
            console.log(err);
            showToast('Failed to decline request', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="notifications-page">
            <div className="page-header">
                <div>
                    <h1>
                        <Bell size={28} className="header-icon" />
                        Notifications
                    </h1>
                    <p className="page-subtitle">Friend requests and activity</p>
                </div>
                {requests.length > 0 && (
                    <div className="notif-badge-pill">
                        <Sparkles size={14} />
                        <span>{requests.length} pending</span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="notif-loading">
                    <div className="notif-skeleton-list">
                        {[1, 2, 3].map(i => (
                            <div className="notif-skeleton-card" key={i}>
                                <div className="skeleton-avatar"></div>
                                <div className="skeleton-content">
                                    <div className="skeleton-line long"></div>
                                    <div className="skeleton-line short"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : requests.length === 0 ? (
                <div className="notif-empty">
                    <div className="empty-icon-wrapper">
                        <UserCheck size={48} />
                    </div>
                    <h2>All caught up!</h2>
                    <p>No pending friend requests right now.</p>
                </div>
            ) : (
                <div className="notif-list">
                    {requests.map((req, index) => {
                        const sender = req.senderId;
                        const glowColors = ['cyan', 'purple', 'pink', 'green'];
                        const colorClass = glowColors[index % glowColors.length];

                        return (
                            <div
                                className={`notif-card ${colorClass}`}
                                key={req._id}
                                style={{ animationDelay: `${index * 0.08}s` }}
                            >
                                <div className="notif-card-glow"></div>

                                <div className="notif-avatar-section">
                                    <div className={`notif-avatar ${colorClass}`}>
                                        {getInitials(sender?.name)}
                                    </div>
                                    <div className="notif-pulse-ring"></div>
                                </div>

                                <div className="notif-content">
                                    <div className="notif-main">
                                        <span className="notif-sender-name">
                                            {sender?.name || 'Unknown User'}
                                        </span>
                                        <span className="notif-message">
                                            sent you a friend request
                                        </span>
                                    </div>
                                    <div className="notif-meta">
                                        <span className="notif-email">
                                            {sender?.email}
                                        </span>
                                        <span className="notif-dot">•</span>
                                        <span className="notif-time">
                                            <Clock size={12} />
                                            {getTimeAgo(req.createdAt)}
                                        </span>
                                    </div>
                                </div>

                                <div className="notif-actions">
                                    <button
                                        className="notif-btn accept"
                                        onClick={() => handleAccept(req._id, sender?.name)}
                                        disabled={actionLoading === req._id}
                                    >
                                        <Check size={16} />
                                        <span>Accept</span>
                                    </button>
                                    <button
                                        className="notif-btn reject"
                                        onClick={() => handleReject(req._id)}
                                        disabled={actionLoading === req._id}
                                    >
                                        <X size={16} />
                                        <span>Decline</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className={`notif-toast ${toast.type}`}>
                    {toast.type === 'success' && <UserCheck size={18} />}
                    {toast.type === 'error' && <X size={18} />}
                    {toast.type === 'info' && <Bell size={18} />}
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
}

export default Notifications;
