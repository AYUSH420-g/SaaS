import { useState } from 'react';
import './dashboard.css';
import { LayoutList, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
// import { set } from 'mongoose';

function Dashboard() {

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const[totaltask,settotaltask]=useState("");
    const[pendingtask,setpending]=useState("");
    const[completedtask,setcomplete]=useState("");

    useEffect(()=>{

        const fun=async()=>{

            const res=await axios.get(`${import.meta.env.VITE_API_URL}/getcount/${user._id}`);
            console.log(res.data);
            // console.log(res.data.pending);
            

            settotaltask(res.data.total);
            setpending(res.data.pending);
            setcomplete(res.data.complete);
            // console.log(pendingtask);


        }
        fun();
    },[])
    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1>Dashboard Overview</h1>
                    <p className="page-subtitle">Track your team's progress and tasks</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card cyan">
                    <div className="stat-icon-wrapper">
                        <LayoutList size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Tasks</span>
                        <span className="stat-value">{totaltask}</span>
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon-wrapper">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Completed</span>
                        <span className="stat-value">{completedtask}</span>
                    </div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon-wrapper">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Pending</span>
                        <span className="stat-value">{pendingtask}</span>
                    </div>
                </div>

                <div className="stat-card pink">
                    <div className="stat-icon-wrapper">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Overdue</span>
                        <span className="stat-value"></span>
                    </div>
                </div>
            </div>

            {/* Future expansions can go here, like recent activity feed */}
        </div>
    );
}

export default Dashboard;