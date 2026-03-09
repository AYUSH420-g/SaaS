import './dashboard.css';
function Dashboard(){

    return(
        <div>
                <h1>Dashboard</h1>

                     <div className="cards">
                        <div>Total Tasks</div>
                        <div>Completed Tasks</div>
                        <div>Pending Tasks</div>
                        <div>Overdue Tasks</div>
                    </div>
         </div>
    );
}
export default Dashboard;