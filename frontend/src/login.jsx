import axios from 'axios';
import './login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Hexagon } from 'lucide-react';

function Login() {
    const [email, setmail] = useState('');
    const [pass, setpass] = useState('');
    const navigate = useNavigate();

    const logsub = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3003/auth/login", { email, pass });
            console.log(res.data);
            navigate("/dashboard");
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="auth-layout">
            <div className="auth-bg-glow cyan"></div>
            <div className="auth-bg-glow purple"></div>

            <main className="auth-container">
                <div className="auth-header">
                    <Hexagon size={42} className="brand-logo" />
                    <h1>Welcome Back</h1>
                    <p>Enter your credentials to access TaskHive</p>
                </div>

                <form className="auth-form glass-panel" onSubmit={logsub}>
                    <div className="input-wrapper">
                        <label>Email Address</label>
                        <div className="input-icon-group">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label>Password</label>
                        <div className="input-icon-group">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={pass}
                                onChange={(e) => setpass(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="primary submit-btn">
                        Sign In <ArrowRight size={18} />
                    </button>

                    <div className="auth-footer">
                        Don't have an account? <span onClick={() => navigate('/signup')} className="auth-link">Create one now</span>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default Login;