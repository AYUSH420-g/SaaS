import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './home.css';
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    Bell,
    Settings,
    LogOut,
    Hexagon
} from 'lucide-react';

function Home() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { path: "/project-page", icon: <FolderKanban size={20} />, label: "Projects" },
        { path: "/task-page", icon: <CheckSquare size={20} />, label: "Tasks" },
        { path: "/team-page", icon: <Users size={20} />, label: "People" },
        { path: "/notifications", icon: <Bell size={20} />, label: "Notifications" },
        { path: "/setting", icon: <Settings size={20} />, label: "Settings" }
    ];

    function logout() {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <Hexagon size={28} className="brand-logo" />
                    <h2>TaskHive</h2>
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
                    <div className="topbar-search">
                        {/* Placeholder for future search */}
                    </div>
                    <div className="topbar-actions">
                        <div className="user-avatar">AD</div>
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