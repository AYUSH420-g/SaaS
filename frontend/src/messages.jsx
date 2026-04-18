import { useState, useEffect, useRef } from 'react';
import './messages.css';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
    MessageCircle,
    ArrowLeft,
    Send,
    Users,
    ChevronRight,
    FolderDot
} from 'lucide-react';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '').replace('/API', '') || 'http://localhost:3003';

function Messages() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // Views: 'list' or 'chat'
    const [view, setView] = useState('list');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Chat state
    const [activeProject, setActiveProject] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [chatLoading, setChatLoading] = useState(false);

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const glowColors = ['cyan', 'purple', 'pink', 'green'];

    // ── Fetch projects user belongs to ──
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/displayproject`);
                // Filter: user is owner or member
                const userProjects = res.data.filter(p => {
                    const ownerId = typeof p.owner === 'object' ? p.owner?._id : p.owner;
                    return ownerId === user?._id || p.members?.includes(user?._id);
                });
                setProjects(userProjects);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) fetchProjects();
    }, []);

    // ── Socket.IO connection ──
    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling']
        });
        socketRef.current = socket;

        socket.on('receive-message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // ── Auto-scroll to bottom on new messages ──
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // ── Open a chat room ──
    const openChat = async (project) => {
        setActiveProject(project);
        setView('chat');
        setChatLoading(true);
        setMessages([]);

        // Join socket room
        socketRef.current?.emit('join-room', project._id);

        // Fetch message history
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/messages/${project._id}`);
            setMessages(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setChatLoading(false);
        }

        // Focus input
        setTimeout(() => inputRef.current?.focus(), 300);
    };

    // ── Go back to group list ──
    const goBack = () => {
        if (activeProject) {
            socketRef.current?.emit('leave-room', activeProject._id);
        }
        setView('list');
        setActiveProject(null);
        setMessages([]);
    };

    // ── Send message ──
    const sendMessage = (e) => {
        e?.preventDefault();
        const text = newMsg.trim();
        if (!text || !activeProject) return;

        socketRef.current?.emit('send-message', {
            projectId: activeProject._id,
            senderId: user._id,
            senderName: user.name || 'You',
            text
        });

        setNewMsg('');
        inputRef.current?.focus();
    };

    // ── Handle Enter key ──
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // ── Format time ──
    const formatTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // ── Format date for dividers ──
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // ── Check if we need a date divider ──
    const needsDateDivider = (msgs, index) => {
        if (index === 0) return true;
        const curr = new Date(msgs[index].createdAt).toDateString();
        const prev = new Date(msgs[index - 1].createdAt).toDateString();
        return curr !== prev;
    };

    // ── Get project initials ──
    const getProjectInitials = (name) => {
        if (!name) return '?';
        const words = name.split(' ');
        if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
        return name.slice(0, 2).toUpperCase();
    };

    // ════════════════════════════════════════════
    //   GROUP LIST VIEW
    // ════════════════════════════════════════════
    if (view === 'list') {
        return (
            <div className="messages-page">
                <div className="page-header">
                    <div>
                        <h1>Messages</h1>
                        <p className="page-subtitle">Chat with your project teams</p>
                    </div>
                </div>

                {loading ? (
                    <div className="chat-loading">
                        <div className="chat-loading-dot"></div>
                        <div className="chat-loading-dot"></div>
                        <div className="chat-loading-dot"></div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="groups-empty">
                        <div className="groups-empty-icon">
                            <MessageCircle size={36} />
                        </div>
                        <h2>No groups yet</h2>
                        <p>Join or create a project to start chatting with your team.</p>
                    </div>
                ) : (
                    <div className="group-list">
                        {projects.map((p, index) => {
                            const colorClass = glowColors[index % glowColors.length];
                            const memberCount = (p.members?.length || 0) + 1; // +1 for owner

                            return (
                                <div
                                    className="group-card"
                                    key={p._id}
                                    onClick={() => openChat(p)}
                                >
                                    <div className={`group-avatar ${colorClass}`}>
                                        {getProjectInitials(p.name)}
                                    </div>
                                    <div className="group-info">
                                        <div className="group-name">{p.name}</div>
                                        <div className="group-meta">
                                            <Users size={12} />
                                            <span>{memberCount} member{memberCount !== 1 ? 's' : ''}</span>
                                            <span style={{ opacity: 0.4 }}>•</span>
                                            <FolderDot size={12} />
                                            <span>Project</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="group-arrow" />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    }

    // ════════════════════════════════════════════
    //   CHAT VIEW
    // ════════════════════════════════════════════
    const projectColor = glowColors[projects.findIndex(p => p._id === activeProject?._id) % glowColors.length] || 'cyan';
    const memberCount = (activeProject?.members?.length || 0) + 1;

    return (
        <div className="messages-page">
            <div className="chat-view">
                {/* Chat Header */}
                <div className="chat-header">
                    <button className="chat-back-btn" onClick={goBack}>
                        <ArrowLeft size={22} />
                    </button>
                    <div
                        className={`chat-header-avatar group-avatar ${projectColor}`}
                        style={{ width: 38, height: 38, fontSize: 14 }}
                    >
                        {getProjectInitials(activeProject?.name)}
                    </div>
                    <div className="chat-header-info">
                        <div className="chat-header-name">{activeProject?.name}</div>
                        <div className="chat-header-status">{memberCount} members</div>
                    </div>
                </div>

                {/* Messages */}
                {chatLoading ? (
                    <div className="chat-loading">
                        <div className="chat-loading-dot"></div>
                        <div className="chat-loading-dot"></div>
                        <div className="chat-loading-dot"></div>
                    </div>
                ) : (
                    <div className="chat-messages">
                        {messages.length === 0 && (
                            <div className="groups-empty" style={{ padding: 'var(--sp-400) 0' }}>
                                <div className="groups-empty-icon" style={{ width: 60, height: 60 }}>
                                    <MessageCircle size={28} />
                                </div>
                                <h2 style={{ fontSize: 16 }}>No messages yet</h2>
                                <p>Be the first to say something!</p>
                            </div>
                        )}

                        {messages.map((msg, index) => {
                            const isOwn = msg.senderId === user?._id;
                            const showDivider = needsDateDivider(messages, index);

                            return (
                                <div key={msg._id || index}>
                                    {showDivider && (
                                        <div className="chat-date-divider">
                                            <span>{formatDate(msg.createdAt)}</span>
                                        </div>
                                    )}
                                    <div className={`message-row ${isOwn ? 'own' : 'other'}`}>
                                        <div>
                                            {!isOwn && (
                                                <div className="message-sender">{msg.senderName}</div>
                                            )}
                                            <div className="message-bubble">
                                                {msg.text}
                                                <div className="message-time">
                                                    {formatTime(msg.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* Input Bar */}
                <form className="chat-input-bar" onSubmit={sendMessage}>
                    <input
                        ref={inputRef}
                        className="chat-input"
                        type="text"
                        placeholder="Message..."
                        value={newMsg}
                        onChange={(e) => setNewMsg(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="chat-send-btn"
                        disabled={!newMsg.trim()}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Messages;
