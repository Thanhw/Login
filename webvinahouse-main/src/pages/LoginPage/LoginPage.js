// LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
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
      // Mock login logic for testing if API is unavailable
      if (email === 'admin@example.com' && password === 'admin123') {
        const mockData = {
          token: 'fake-admin-token-123456',
          username: 'admin',
          email,
          isAdmin: true,
        };
        localStorage.setItem('token', mockData.token);
        localStorage.setItem('user', JSON.stringify({
          username: mockData.username,
          email: mockData.email,
          isAdmin: mockData.isAdmin,
        }));
        navigate('/');
        return;
      } else if (email === 'user@example.com' && password === 'user123') {
        const mockData = {
          token: 'fake-user-token-123456',
          username: 'user',
          email,
          isAdmin: false,
        };
        localStorage.setItem('token', mockData.token);
        localStorage.setItem('user', JSON.stringify({
          username: mockData.username,
          email: mockData.email,
          isAdmin: mockData.isAdmin,
        }));
        navigate('/');
        return;
      }

      // Thay thế bằng endpoint API thực tế của bạn
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Đăng nhập thành công:', data);
        localStorage.setItem('token', data.token || 'fake-token');
        // Ensure the user object includes isAdmin
        localStorage.setItem('user', JSON.stringify({
          username: data.username || email,
          email,
          isAdmin: data.isAdmin || false, // Expect API to return isAdmin
        }));
        navigate('/');
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  return (
    <div className="modern-login-container">
      <div className="login-card">
        <div className="login-content">
          <div className="login-image-container">
            <div className="login-image">
              {/* Bạn có thể thêm SVG hoặc hình ảnh tùy chỉnh ở đây */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div className="login-form-container">
            <h2>Đăng nhập</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 4h16v4H4V4zm16 10v6H4v-6h16zm-8-4c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-with-icon">
                  <span className="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 14l2-2m-2 2v-4m0 4c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="login-button">Đăng nhập</button>
            </form>
            <div className="login-footer">
              <button className="forgot-link">Quên mật khẩu?</button>
              <div className="create-account">
                <span>Chưa có tài khoản? </span>
                <a href="/register">Tạo tài khoản</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;