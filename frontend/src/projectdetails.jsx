import './projectdetails.css';

function Projectdetails() {
    return (
        <div className="project-details">

            <h1>Project Tasks</h1>

           

            <div className="task-list">

                <div className="task-card">
                    <h3>Fix login bug</h3>
                    <p>Priority: High</p>
                    <p>Status: In Progress</p>

                    <div className="task-actions">
                        <button>View</button>
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                </div>

                <div className="task-card">
                    <h3>Build dashboard UI</h3>
                    <p>Priority: Medium</p>
                    <p>Status: Todo</p>

                    <div className="task-actions">
                        <button>View</button>
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Projectdetails;