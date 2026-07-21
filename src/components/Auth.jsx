import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import apiService from '../services/api';
export default function Auth({
    isOpen,
    onClose,
    onLoginSuccess,
    onRegisterSuccess
}) {
    if (!isOpen) return null;

    const [activeTab, setActiveTab] = useState('student-login'); // student-login, student-register, admin-login, forgot-password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Submit Handlers
    const handleStudentLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const result = await apiService.login(email, password);

        if (result.success) {
            const profile = await apiService.getProfile(result.token);

            onLoginSuccess(profile, result.token);
            onClose();
        } else {
            setErrorMessage(result.error);
        }
    };
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const result = await apiService.adminLogin(email, password);

        if (result.success) {
            const profile = await apiService.getProfile(result.token);

            if (profile.role !== "admin") {
                setErrorMessage("You are not an admin.");
                return;
            }

            onLoginSuccess(profile, result.token);
            onClose();
        } else {
            setErrorMessage(result.error);
        }
    };

    const handleStudentRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        const result = await apiService.register({
            username,
            email,
            phone,
            password
        });

        if (result.success) {
            alert("Registration Successful");
            setActiveTab("student-login");
        } else {
            setErrorMessage(result.error);
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        alert(`Password reset link sent to ${email}`);
        setActiveTab('student-login');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                    className="close-btn"
                    onClick={onClose}
                    style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}
                >
                    <X size={20} />
                </button>

                {activeTab !== 'forgot-password' && (
                    <div className="auth-tabs">
                        <div
                            className={`auth-tab ${activeTab === 'student-login' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('student-login'); setErrorMessage(''); }}
                        >
                            Student Login
                        </div>
                        <div
                            className={`auth-tab ${activeTab === 'student-register' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('student-register'); setErrorMessage(''); }}
                        >
                            Register
                        </div>
                        <div
                            className={`auth-tab ${activeTab === 'admin-login' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('admin-login'); setErrorMessage(''); }}
                        >
                            Admin Login
                        </div>
                    </div>
                )}

                <div className="auth-body">
                    {errorMessage && (
                        <div
                            style={{
                                backgroundColor: '#FFEBEE',
                                color: '#C62828',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                marginBottom: '16px',
                                fontWeight: 500
                            }}
                        >
                            {errorMessage}
                        </div>
                    )}

                    {/* STUDENT LOGIN */}
                    {activeTab === 'student-login' && (
                        <form onSubmit={handleStudentLogin}>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#7D6B67' }} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Enter your email"
                                        className="form-control"
                                        style={{ paddingLeft: '40px' }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#7D6B67' }} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="form-control"
                                        style={{ paddingLeft: '40px' }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                                <span
                                    style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
                                    onClick={() => setActiveTab('forgot-password')}
                                >
                                    Forgot Password?
                                </span>
                            </div>

                            <button type="submit" className="btn btn-secondary auth-btn">
                                <span>Login as Student</span>
                            </button>

                            <p className="auth-switch">
                                Don't have an account? <span onClick={() => setActiveTab('student-register')}>Register here</span>
                            </p>
                        </form>
                    )}

                    {/* ADMIN LOGIN */}
                    {activeTab === 'admin-login' && (
                        <form onSubmit={handleAdminLogin}>
                            <div style={{ textAlign: 'center', marginBottom: '24px', color: 'var(--primary)' }}>
                                <ShieldCheck size={48} style={{ margin: '0 auto 8px' }} />
                                <h3 style={{ fontSize: '1.2rem' }}>Canteen Portal</h3>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#7D6B67' }} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Enter admin email"
                                        className="form-control"
                                        style={{ paddingLeft: '40px' }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Security Key</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#7D6B67' }} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="form-control"
                                        style={{ paddingLeft: '40px' }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-secondary auth-btn">
                                <span>Access Dashboard</span>
                            </button>
                        </form>
                    )}

                    {/* STUDENT REGISTER */}
                    {activeTab === 'student-register' && (
                        <form onSubmit={handleStudentRegister}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#7D6B67' }} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Your Name"
                                        className="form-control"
                                        style={{ paddingLeft: '40px' }}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">College Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#7D6B67' }} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Enter your email"
                                        className="form-control"
                                        style={{ paddingLeft: '40px' }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Mobile Number (For Order Alerts)</label>
                                <input
                                    type="tel"
                                    required
                                    pattern="[0-9]{10}"
                                    placeholder="10-digit number"
                                    className="form-control"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#7D6B67' }} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="Create Password"
                                        className="form-control"
                                        style={{ paddingLeft: '40px' }}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-secondary auth-btn">
                                <span>Register</span>
                            </button>

                            <p className="auth-switch">
                                Already registered? <span onClick={() => setActiveTab('student-login')}>Login here</span>
                            </p>
                        </form>
                    )}

                    {/* FORGOT PASSWORD */}
                    {activeTab === 'forgot-password' && (
                        <form onSubmit={handleForgotPassword}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', textAlign: 'center' }}>Reset Your Password</h3>
                            <p style={{ fontSize: '0.85rem', color: '#7D6B67', marginBottom: '20px', textAlign: 'center' }}>
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#7D6B67' }} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="Enter your email"
                                        className="form-control"
                                        style={{ paddingLeft: '40px' }}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-secondary auth-btn">
                                <span>Send Reset Link</span>
                            </button>

                            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                <span
                                    style={{ color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
                                    onClick={() => setActiveTab('student-login')}
                                >
                                    Back to Login
                                </span>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
