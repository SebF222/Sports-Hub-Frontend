import React from 'react'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:5000';

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      window.location.href = '/login';
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setFormData({
      username: userData.username || '',
      email: userData.email || '',
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      password: ''
    });

    loadFavorites(token);
  };

  const loadFavorites = async (token) => {
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleUpdate = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem('token');

    try {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await fetch(`${API_URL}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrors({ submit: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Update error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Account deleted successfully');
        window.location.href = '/signup';
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete account');
    }
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  const accountAge = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>My Profile</h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Manage your account settings and preferences</p>
        </div>

        {successMessage && (
          <div style={{ padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '0.375rem', marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: '#065f46' }}>{successMessage}</p>
          </div>
        )}

        {/* Profile Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
                {user.first_name} {user.last_name}
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>@{user.username}</p>
              <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                Member since {accountAge}
              </p>
            </div>
            
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
              {user.first_name.charAt(0)}{user.last_name.charAt(0)}
            </div>
          </div>

          {errors.submit && (
            <div style={{ padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#991b1b' }}>{errors.submit}</p>
            </div>
          )}

          {!isEditing ? (
            <div>
              <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Username
                  </label>
                  <p style={{ fontSize: '1rem', color: '#111827' }}>{user.username}</p>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Email
                  </label>
                  <p style={{ fontSize: '1rem', color: '#111827' }}>{user.email}</p>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    Favorite Teams
                  </label>
                  <p style={{ fontSize: '1rem', color: '#111827' }}>{favorites.length} team{favorites.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Username
                  </label>
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: `1px solid ${errors.username ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                  />
                  {errors.username && (
                    <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.username}</p>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: `1px solid ${errors.email ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                  />
                  {errors.email && (
                    <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      First Name
                    </label>
                    <input
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: `1px solid ${errors.first_name ? '#dc2626' : '#d1d5db'}`,
                        borderRadius: '0.375rem',
                        fontSize: '1rem'
                      }}
                    />
                    {errors.first_name && (
                      <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                      Last Name
                    </label>
                    <input
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: `1px solid ${errors.last_name ? '#dc2626' : '#d1d5db'}`,
                        borderRadius: '0.375rem',
                        fontSize: '1rem'
                      }}
                    />
                    {errors.last_name && (
                      <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.last_name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                    New Password (leave blank to keep current)
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: `1px solid ${errors.password ? '#dc2626' : '#d1d5db'}`,
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.password}</p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href="/favorites/manage"
              style={{
                display: 'block',
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                color: '#111827',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>⭐ Manage Favorite Teams</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Add or remove your favorite teams</div>
            </a>
            
            <button
              onClick={handleLogout}
              style={{
                display: 'block',
                width: '100%',
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                color: '#111827',
                backgroundColor: 'white',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>🚪 Log Out</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sign out of your account</div>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', border: '2px solid #fee2e2', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#dc2626' }}>
            Danger Zone
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteAccount}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProfileView