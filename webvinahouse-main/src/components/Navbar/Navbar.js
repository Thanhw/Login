import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './Navbar.css';
import logo from '../../assets/logo.png';
import searchIcon from '../../assets/searchicon.png';
import userIcon from '../../assets/usericon.png';

Modal.setAppElement('#root');

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [loginUsernameEmail, setLoginUsernameEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = isLoggedIn && storedUser.username === 'admin';

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => setIsInteracting(true);
  const handleMouseLeave = () => setIsInteracting(false);
  const openLoginModal = () => {
    setIsUserDropdownOpen(false);
    setLoginModalIsOpen(true);
  };
  const closeLoginModal = () => {
    setLoginModalIsOpen(false);
    setLoginUsernameEmail('');
    setLoginPassword('');
    setLoginError('');
  };
  const openRegisterModal = () => {
    setIsUserDropdownOpen(false);
    setRegisterModalIsOpen(true);
  };
  const closeRegisterModal = () => {
    setRegisterModalIsOpen(false);
    setRegisterUsername('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterConfirmPassword('');
    setRegisterError('');
  };
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value.trim() !== '') {
      performSearch(event.target.value);
    } else {
      setSearchResults([]);
      setSearchError('');
    }
  };

  const performSearch = (query) => {
    setSearchError('');
    if (query.toLowerCase().includes('test')) {
      setSearchResults([{ id: 1, title: 'Test Song 1' }, { id: 2, title: 'Another Test' }]);
      setSearchError('');
    } else {
      setSearchResults([]);
      setSearchError('Xin lỗi, tớ không tìm thấy bài hát nào chứa từ khóa này! :(');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginUsernameEmail || !loginPassword) {
      setLoginError('Please fill in all fields.');
      return;
    }
    if (loginUsernameEmail === 'demo' && loginPassword === 'demo123') {
      const fakeToken = 'fake-token-123456';
      const fakeUser = { username: 'demo', email: 'demo@example.com' };
      localStorage.setItem('token', fakeToken);
      localStorage.setItem('user', JSON.stringify(fakeUser));
      closeLoginModal();
      navigate('/user/profile');
    } else if (loginUsernameEmail === 'admin' && loginPassword === 'admin123') {
      const fakeToken = 'fake-admin-token-123456';
      const adminUser = { username: 'admin', email: 'admin@example.com', isAdmin: true };
      localStorage.setItem('token', fakeToken);
      localStorage.setItem('user', JSON.stringify(adminUser));
      closeLoginModal();
      navigate('/admin');
    } else {
      try {
        const response = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginUsernameEmail, password: loginPassword }),
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Login successful:', data);
          localStorage.setItem('token', data.token || 'fake-token');
          const userData = { username: loginUsernameEmail, email: data.email || `${loginUsernameEmail}@example.com` };
          if (loginUsernameEmail === 'admin') userData.isAdmin = true;
          localStorage.setItem('user', JSON.stringify(userData));
          closeLoginModal();
          if (userData.isAdmin) navigate('/admin');
          else navigate('/user/profile');
        } else {
          setLoginError(data.message || 'Login failed. Please try again.');
        }
      } catch (err) {
        console.error('Error during login:', err);
        setLoginError('An error occurred. Please check your connection and try again.');
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    if (!registerUsername || !registerEmail || !registerPassword || !registerConfirmPassword) {
      setRegisterError('Please fill in all fields.');
      return;
    }
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail)) {
      setRegisterError('Invalid email format.');
      return;
    }
    if (registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: registerUsername, email: registerEmail, password: registerPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Registration successful:', data);
        localStorage.setItem('token', data.token || 'fake-token');
        localStorage.setItem('user', JSON.stringify({ username: registerUsername, email: registerEmail }));
        closeRegisterModal();
        console.log("Register successful!");
        navigate('/');
      } else {
        setRegisterError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setRegisterError('An error occurred. Please check your connection and try again.');
    }
  };

  const handleProfileClick = () => {
    setIsUserDropdownOpen(false);
    navigate('/user/profile');
  };

  const handleAdminClick = () => {
    setIsUserDropdownOpen(false);
    navigate('/admin');
  };

  const navbarClass = `navbar ${isScrolled && !isInteracting ? 'navbar-shrunk' : ''}`;

  return (
    <nav className={navbarClass} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo" />
        </Link>
        <div className="navbar-search">
          <img src={searchIcon} alt="Search Icon" className="search-icon" />
          <input
            type="text"
            placeholder="TÌM KIẾM"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {(searchResults.length > 0 || searchError) && (
            <div className="search-results-dropdown">
              {searchResults.map((song) => (
                <div key={song.id} className="search-result-item">{song.title}</div>
              ))}
              {searchError && <div className="search-error">{searchError}</div>}
            </div>
          )}
        </div>
        <div className="navbar-auth">
          <div className="user-icon-container">
            <img
              src={userIcon}
              alt="User Icon"
              className="auth-icon"
              onClick={toggleUserDropdown}
              style={{ cursor: 'pointer' }}
            />
            {isUserDropdownOpen && (
              <div className="user-dropdown">
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <div className="dropdown-item" onClick={handleAdminClick}>
                        Trang quản lý
                      </div>
                    )}
                    {!isAdmin && (
                      <div className="dropdown-item" onClick={handleProfileClick}>
                        Trang cá nhân
                      </div>
                    )}
                    <div className="dropdown-item" onClick={handleLogout}>
                      Đăng xuất
                    </div>
                  </>
                ) : (
                  <>
                    <div className="dropdown-item" onClick={openLoginModal}>
                      Đăng nhập
                    </div>
                    <div className="dropdown-item" onClick={openRegisterModal}>
                      Đăng ký
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Đăng nhập */}
      <Modal
        isOpen={loginModalIsOpen}
        onRequestClose={closeLoginModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <button onClick={closeLoginModal} className="modal-close-button">×</button>
          <h2>Đăng nhập</h2>
          {loginError && <p className="modal-error">{loginError}</p>}
          <form onSubmit={handleLogin} className="modal-form">
            <div className="modal-field">
              <label>Email / Số điện thoại</label>
              <input
                type="text"
                value={loginUsernameEmail}
                onChange={(e) => setLoginUsernameEmail(e.target.value)}
                placeholder="Nhập email hoặc số điện thoại"
                required
              />
            </div>
            <div className="modal-field">
              <label>Mật khẩu</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <div className="modal-options">
              <label>
                <input type="checkbox" />
                Ghi nhớ đăng nhập
              </label>
              <button
                type="button"
                className="link-button"
                onClick={() => alert('Chức năng quên mật khẩu chưa được triển khai.')}
              >
                Quên mật khẩu?
              </button>
            </div>
            <button type="submit" className="modal-button">Đăng nhập</button>
          </form>
          <div className="modal-footer">
            <span>Chưa có tài khoản? </span>
            <button
              type="button"
              className="link-button"
              onClick={() => {
                closeLoginModal();
                openRegisterModal();
              }}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal Đăng ký */}
      <Modal
        isOpen={registerModalIsOpen}
        onRequestClose={closeRegisterModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <button onClick={closeRegisterModal} className="modal-close-button">×</button>
          <h2>Đăng ký</h2>
          {registerError && <p className="modal-error">{registerError}</p>}
          <form onSubmit={handleRegister} className="modal-form">
            <div className="modal-field">
              <label>Tên người dùng</label>
              <input
                type="text"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                placeholder="Nhập tên người dùng"
                required
              />
            </div>
            <div className="modal-field">
              <label>Email</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                placeholder="Nhập email"
                required
              />
            </div>
            <div className="modal-field">
              <label>Mật khẩu</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>
            <div className="modal-field">
              <label>Xác nhận mật khẩu</label>
              <input
                type="password"
                value={registerConfirmPassword}
                onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu"
                required
              />
            </div>
            <button type="submit" className="modal-button">Đăng ký</button>
          </form>
          <div className="modal-footer">
            <span>Đã có tài khoản? </span>
            <button
              type="button"
              className="link-button"
              onClick={() => {
                closeRegisterModal();
                openLoginModal();
              }}
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </Modal>
    </nav>
  );
}

export default Navbar;