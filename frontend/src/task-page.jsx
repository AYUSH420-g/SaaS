import { useEffect, useState } from 'react';
import './task-page.css';
import axios from 'axios';
import { AlignLeft, CheckCircle2, Circle, Clock, Flame, Minus, ArrowDown, ArrowUp, Calendar } from 'lucide-react';

function Task() {

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const [task, settask] = useState([]);
    const [filterFriends, setFilterFriends] = useState([]);
    const [filterType, setFilterType] = useState('all'); // all, mine, friend
    const [selectedFriendId, setSelectedFriendId] = useState('');

    const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3
    };

    const filteredTasks = task.filter(t => {
        const projectOwnerId = t.project_id?.owner?.toString() || (typeof t.project_id === 'string' ? null : t.project_id?.owner);
        const currentUserId = user?._id?.toString();

        if (filterType === 'mine') return projectOwnerId === currentUserId;
        if (filterType === 'friend') return projectOwnerId === selectedFriendId?.toString();
        return true;
    });

    const sortedTasks = [...filteredTasks].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await axios.get(`http://localhost:3003/displaytask/${user._id}`);
                settask(res.data);
            } catch (err) {
                console.log(err);
            }
        }

        const fetchFriendsForFilter = async () => {
            if (user?._id) {
                try {
                    const res = await axios.get("http://localhost:3003/all-users", {
                        params: { userId: user._id }
                    });
                    setFilterFriends(res.data);
                } catch (e) {
                    console.log(e);
                }
            }
        };

        fetchTasks();
        fetchFriendsForFilter();
    }, []);

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
        <div className="tasks-page">
            <div className="page-header">
                <div>
                    <h1>All Tasks</h1>
                    <p className="page-subtitle">A centralized view of everything on the board</p>
                </div>
                <div className="filter-container">
                    <select 
                        className="filter-select" 
                        value={filterType === 'friend' ? selectedFriendId : filterType}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'all' || val === 'mine') {
                                setFilterType(val);
                                setSelectedFriendId('');
                            } else {
                                setFilterType('friend');
                                setSelectedFriendId(val);
                            }
                        }}
                    >
                        <option value="all">All Task</option>
                        <option value="mine">My Task</option>
                        <optgroup label="Friends">
                            {filterFriends.map(f => (
                                <option key={f._id} value={f._id}>{f.name || f.email}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="task-table">
                    <thead>
                        <tr>
                            <th><div className="th-content"><AlignLeft size={14} /> Task Title</div></th>
                            <th>Project</th>
                            <th>Created On</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTasks.map((t) => (
                            <tr key={t._id}>
                                <td className="task-title-cell">
                                    <div className="title-wrapper">
                                        {getStatusIcon(t.status)}
                                        <span className="task-title-text">{t.title}</span>
                                    </div>
                                </td>
                                <td className="project-name-cell">
                                    <span className="project-badge">
                                        {t.project_id?.name || 'No Project'}
                                    </span>
                                </td>
                                <td className="created-cell">
                                     <span className="created-text">
                                        <Clock size={14} style={{ marginRight: '6px', opacity: 0.7 }} />
                                        {new Date(t.createdAt).toLocaleDateString()}
                                    </span>
                                </td>
                                <td className="deadline-cell">
                                    <span className="deadline-text">
                                        <Calendar size={14} style={{ marginRight: '6px', opacity: 0.7 }} />
                                        {t.deadline ? new Date(t.deadline).toLocaleDateString() : 'N/A'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`status-text ${(t.status?.toLowerCase() || "").replace(' ', '-')}`}>
                                        {t.status || "Todo"}
                                    </span>
                                </td>
                                <td>{getPriorityIcon(t.priority)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Task;