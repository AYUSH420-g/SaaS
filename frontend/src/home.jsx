import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './home.css';
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    MessageCircle,
    Bell,
    Settings,
    LogOut,
    Hexagon,
    Menu,
    X
} from 'lucide-react';

function Home() {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when sidebar overlay is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [sidebarOpen]);

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const menuItems = [
        { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { path: "/project-page", icon: <FolderKanban size={20} />, label: "Projects" },
        { path: "/task-page", icon: <CheckSquare size={20} />, label: "Tasks" },
        { path: "/team-page", icon: <Users size={20} />, label: "People" },
        { path: "/messages", icon: <MessageCircle size={20} />, label: "Messages" },
        { path: "/notifications", icon: <Bell size={20} />, label: "Notifications" },
        { path: "/setting", icon: <Settings size={20} />, label: "Settings" }
    ];

    function logout() {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div className="app-layout">
            {/* Mobile overlay backdrop */}
            {sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}

            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Hexagon size={28} className="brand-logo" />
                    <h2>TaskHive</h2>
                    <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
                        <X size={22} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {menuItems.map((item) => (
                            <li
                                key={item.path}
                                className={location.pathname === item.path || location.pathname.startsWith(item.path) && item.path !== "/" ? "active" : ""}
                                onClick={() => navigate(item.path)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={logout}>
                        <LogOut size={20} />
                        <span>Log Out</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
                        <Menu size={24} />
                    </button>
                    <div className="topbar-search">
                        {/* Placeholder for future search */}
                    </div>
                    <div className="topbar-actions">
                        <div className="user-avatar" title={user?.name}>{getInitials(user?.name)}</div>
                    </div>
                </header>

                <div className="content-wrapper">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default Home;