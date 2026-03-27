import { useEffect, useState } from 'react';
import './task-page.css';
import axios from 'axios';
import { AlignLeft, CheckCircle2, Circle, Clock, Flame, Minus, ArrowDown, ArrowUp } from 'lucide-react';

function Task() {
    const [task, settask] = useState([]);

    // Adjusted to match common priority strings (assuming High/Medium/Low based on original CSS)
    const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3
    };

    const sortedTasks = [...task].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await axios.get("http://localhost:3003/displaytask");
                settask(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        fun();
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
            </div>

            <div className="table-container">
                <table className="task-table">
                    <thead>
                        <tr>
                            <th><div className="th-content"><AlignLeft size={14} /> Task Title</div></th>
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
                                <td>
                                    <span className={`status-text ${t.status?.toLowerCase().replace(' ', '-')}`}>
                                        {t.status}
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