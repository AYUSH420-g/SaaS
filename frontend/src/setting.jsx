import { useState } from 'react';
import './setting.css';
import { Settings as SettingsIcon, Bell, Shield, PaintBucket, Smartphone, Save } from 'lucide-react';

function Setting() {
    const [theme, setTheme] = useState('dark');
    const [notifications, setNotif] = useState(true);

    const handleSave = (e) => {
        e.preventDefault();
        alert("Settings saved successfully!");
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <div>
                    <h1>Account Settings</h1>
                    <p className="page-subtitle">Manage your preferences and workspace</p>
                </div>
            </div>

            <div className="settings-container">
                {/* Simulated Sidebar for Settings Navigation */}
                <div className="settings-sidebar">
                    <ul className="settings-nav">
                        <li className="active"><SettingsIcon size={18} /> General</li>
                        <li><PaintBucket size={18} /> Appearance</li>
                        <li><Bell size={18} /> Notifications</li>
                        <li><Shield size={18} /> Security</li>
                        <li><Smartphone size={18} /> Devices</li>
                    </ul>
                </div>

                {/* Main Settings Panel */}
                <div className="settings-content glass-panel">
                    <form className="settings-form" onSubmit={handleSave}>
                        <div className="settings-section">
                            <h3>General Preferences</h3>
                            <p className="section-desc">Update your basic workspace configurations.</p>

                            <div className="setting-row">
                                <div className="setting-info">
                                    <label>Workspace Theme</label>
                                    <span>Select your preferred interface color</span>
                                </div>
                                <div className="setting-control select-group">
                                    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                                        <option value="system">System Default</option>
                                        <option value="light">Light Mode</option>
                                        <option value="dark">Dark Mode (Neon Core)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="setting-row">
                                <div className="setting-info">
                                    <label>Email Notifications</label>
                                    <span>Receive daily digest and task mentions</span>
                                </div>
                                <div className="setting-control">
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={notifications}
                                            onChange={(e) => setNotif(e.target.checked)}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="settings-footer">
                            <button type="submit" className="primary submit-btn">
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Setting;