// src/pages/LoginPage/ModernLoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ModernLoginPage.css';

const ModernLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            // MOCK LOGIN
            const isAdmin = email === 'admin@example.com' && password === 'admin123';
            const isUser = email === 'user@example.com' && password === 'user123';
            if (isAdmin || isUser) {
                const mockUser = {
                    token: isAdmin ? 'fake-admin-token' : 'fake-user-token',
                    username: isAdmin ? 'admin' : 'user',
                    email,
                    isAdmin,
                };
                localStorage.setItem('token', mockUser.token);
                localStorage.setItem('user', JSON.stringify(mockUser));
                navigate('/');
                return;
            }

            // API LOGIN
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    username: data.username || email,
                    email,
                    isAdmin: data.isAdmin || false,
                }));
                navigate('/');
            } else {
                setError(data.message || 'Đăng nhập thất bại');
            }
        } catch {
            setError('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    return (
        <div className="modern-container">
            <div className="modern-box">
                <h2>Đăng nhập</h2>
                {error && <p className="error-msg">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Đăng nhập</button>
                </form>
                <div className="extra-links">
                    <button className="forgot-btn">Quên mật khẩu?</button>
                    <p>Chưa có tài khoản? <a href="/register">Tạo tài khoản</a></p>
                </div>
            </div>
        </div>
    );
};

export default ModernLoginPage;
