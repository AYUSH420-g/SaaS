import { Outlet } from 'react-router-dom';
import './home.css';
import { useNavigate } from 'react-router-dom';
function Home()
{
    const navigate=useNavigate();
    function dash()
    {
        navigate("/dashboard");
    }

    function task()
    {
        navigate("/task-page");
    }
    function proj()
    {
        navigate("/project-page");
    }
    function sett()
    {
        navigate("/setting");
    }
    function team()
    {
        navigate("/team-page");
    }
    function logout()
    {
        localStorage.clear();
        navigate("/login");
    }
    
    return(
        <div>
            <div className="left-side">
                <ul>
                    <li onClick={dash}>Dashboard</li>
                    <li onClick={proj}>Projects</li>
                    <li onClick={task}>Tasks</li>
                    <li onClick={team}>Team</li>
                    <li onClick={sett}>Settings</li>
                    <li onClick={logout}>logout</li>
                </ul>
            </div>

            <div className="right-side">
                   <Outlet/>
            </div>
        </div>
    );
}

export default Home;