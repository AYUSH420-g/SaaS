import './task-page.css';

function Task() {
    return (
        <div className="tasks">
            <h1>Tasks</h1>

            <button>Create Task</button>

            <table>
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Status</th>
                        <th>Priority</th>
                    </tr>
                </thead>
            </table>
        </div>
    );
}
export default Task;