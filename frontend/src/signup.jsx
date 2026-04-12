import axios from 'axios';
import './signup.css'; /* Shares login.css conceptually but we'll import signup for isolation */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Hexagon, CheckCircle2 } from 'lucide-react';

function Signup() {
    const [email, setmail] = useState('');
    const [name, setname] = useState('');
    const [pass, setpass] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    const subsign = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await axios.post("http://localhost:3003/auth/signup", { name, email, pass });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "An error occurred");
        }
    }

    return (
        <div className="auth-layout">
            <div className="auth-bg-glow cyan"></div>
            <div className="auth-bg-glow pink"></div>

            <main className="auth-container">
                <div className="auth-header">
                    <Hexagon size={42} className="brand-logo" />
                    <h1>Create Account</h1>
                    <p>Join TaskHive to manage your projects</p>
                </div>

                <form className="auth-form glass-panel" onSubmit={subsign}>
                    {error && <div className="auth-error" style={{color: '#ff4d4d', padding: '10px', backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: '8px', marginBottom: '15px', textAlign: 'center'}}>{error}</div>}
                    <div className="input-wrapper">
                        <label>Full Name</label>
                        <div className="input-icon-group">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setname(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-wrapper">
                        <label>Email Address</label>
                        <div className="input-icon-group">
                            <Mail size={18} className="input-icon" />
                            <input
                                type="email"
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
                                placeholder="Create a strong password"
                                value={pass}
                                onChange={(e) => setpass(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="primary submit-btn">
                        Get Started <CheckCircle2 size={18} />
                    </button>

                    <div className="auth-footer">
                        Already have an account? <span onClick={() => navigate('/login')} className="auth-link">Sign In</span>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default Signup;