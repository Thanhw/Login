import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [editingField, setEditingField] = useState(null); // Track which field is being edited
  const [editValues, setEditValues] = useState({
    username: '',
    email: '',
    bio: '',
    birthday: '',
    gender: '',
    oldPassword: '',
    newPassword: '',
  });
  const [previewPicture, setPreviewPicture] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token) {
          navigate('/login');
          return;
        }

        if (token === 'fake-token-123456' && storedUser.username === 'demo') {
          const demoUser = {
            ...storedUser,
            id: '41311296',
            bio: 'Không có',
            birthday: '01/01/1970',
            gender: 'Không có',
          };
          setUser(demoUser);
          setEditValues({
            username: demoUser.username,
            email: demoUser.email,
            bio: demoUser.bio,
            birthday: demoUser.birthday,
            gender: demoUser.gender,
            oldPassword: '',
            newPassword: '',
          });
          return;
        }

        const userResponse = await fetch('YOUR_API_ENDPOINT/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = await userResponse.json();

        if (userResponse.ok) {
          setUser(userData);
          setEditValues({
            username: userData.username,
            email: userData.email,
            bio: userData.bio || '',
            birthday: userData.birthday || '',
            gender: userData.gender || '',
            oldPassword: '',
            newPassword: '',
          });
        } else {
          setError(userData.message || 'Failed to load profile');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleFieldClick = (field) => {
    setEditingField(field);
  };

  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (field === 'password') {
        // Handle password change
        if (token === 'fake-token-123456' && storedUser.username === 'demo') {
          if (editValues.oldPassword !== 'demo123') {
            setError('Mật khẩu cũ không đúng.');
            return;
          }
          setError('');
          setEditValues((prev) => ({ ...prev, oldPassword: '', newPassword: '' }));
          setEditingField(null);
          alert('Mật khẩu đã được thay đổi thành công (mô phỏng).');
          return;
        }

        const response = await fetch('YOUR_API_ENDPOINT/user/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            old_password: editValues.oldPassword,
            new_password: editValues.newPassword,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setError('');
          setEditValues((prev) => ({ ...prev, oldPassword: '', newPassword: '' }));
          setEditingField(null);
          alert('Mật khẩu đã được thay đổi thành công.');
        } else {
          setError(data.message || 'Failed to change password');
        }
        return;
      }

      // Handle other profile fields
      const updatedUser = {
        ...user,
        [field]: editValues[field],
      };

      if (token === 'fake-token-123456' && storedUser.username === 'demo') {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditingField(null);
        return;
      }

      const response = await fetch('YOUR_API_ENDPOINT/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();
      if (response.ok) {
        setUser(updatedUser);
        setEditingField(null);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleCancel = (field) => {
    if (field === 'password') {
      setEditValues((prev) => ({ ...prev, oldPassword: '', newPassword: '' }));
    } else {
      setEditValues((prev) => ({
        ...prev,
        [field]: user[field] || '',
      }));
    }
    setEditingField(null);
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  const fields = [
    { key: 'username', label: 'User Name', value: user.username },
    { key: 'email', label: 'Email', value: user.email },
    { key: 'bio', label: 'Bio', value: user.bio || 'Không có' },
    { key: 'birthday', label: 'Birthday', value: user.birthday || 'Không có' },
    { key: 'gender', label: 'Gender', value: user.gender || 'Không có' },
  ];

  return (
    <div className="profile-container">
      {/* Profile Picture and Username Section */}
      <div className="profile-header">
        <div className="profile-picture-container">
          {editingField === 'picture' ? (
            <>
              <div className="profile-picture-wrapper">
                {previewPicture ? (
                  <img src={previewPicture} alt="Profile Preview" className="profile-picture" />
                ) : (
                  <div className="profile-picture-placeholder">Chọn ảnh đại diện</div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="profile-picture-input"
              />
              <div className="inline-buttons">
                <button
                  onClick={() => setEditingField(null)}
                  className="inline-save-button"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingField(null)}
                  className="inline-cancel-button"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div
              className="profile-picture-wrapper editable"
              onClick={() => handleFieldClick('picture')}
            >
              {previewPicture ? (
                <img src={previewPicture} alt="Profile" className="profile-picture" />
              ) : (
                <div className="profile-picture-placeholder">Đổi ảnh đại diện</div>
              )}
            </div>
          )}
        </div>
        <h2 className="profile-username">{user.username}</h2>
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Profile Details */}
      <div className="profile-details">
        {fields.map((field) => (
          <div key={field.key} className="profile-field">
            <label>{field.label}</label>
            {editingField === field.key ? (
              <div className="edit-field">
                <input
                  type={field.key === 'email' ? 'email' : 'text'}
                  value={editValues[field.key]}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  required={field.key === 'username' || field.key === 'email'}
                  className="edit-input"
                />
                <div className="inline-buttons">
                  <button
                    onClick={() => handleSave(field.key)}
                    className="inline-save-button"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleCancel(field.key)}
                    className="inline-cancel-button"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p
                className="editable"
                onClick={() => handleFieldClick(field.key)}
              >
                {field.value}
              </p>
            )}
          </div>
        ))}

        {/* Password Fields */}
        <div className="profile-field">
          <label>Password</label>
          {editingField === 'password' ? (
            <div className="edit-field">
              <input
                type="password"
                placeholder="Old Password"
                value={editValues.oldPassword}
                onChange={(e) => handleInputChange('oldPassword', e.target.value)}
                className="edit-input"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={editValues.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className="edit-input"
                required
              />
              <div className="inline-buttons">
                <button
                  onClick={() => handleSave('password')}
                  className="inline-save-button"
                >
                  Save
                </button>
                <button
                  onClick={() => handleCancel('password')}
                  className="inline-cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p
              className="editable"
              onClick={() => handleFieldClick('password')}
            >
              ********
            </p>
          )}
        </div>

        <div className="button-group">
          <button onClick={() => navigate('/')} className="cancel-button">
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;