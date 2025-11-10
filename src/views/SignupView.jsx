import React from 'react'
import { useState } from 'react';

const API_URL = 'http://127.0.0.1:5000';

const SignupView = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Account created successfully! You can now log in.');
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          first_name: '',
          last_name: ''
        });
      } else {
        setErrors({ submit: data.error || 'An error occurred during signup' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'An error occurred during signup. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '28rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Create your account
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Join Sports Hub to track your favorite teams
          </p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          {successMessage && (
            <div style={{ padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '0.375rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#065f46' }}>{successMessage}</p>
            </div>
          )}

          {errors.submit && (
            <div style={{ padding: '1rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem', marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#991b1b' }}>{errors.submit}</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Username <span style={{ color: '#dc2626' }}>*</span>
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
                placeholder="Choose a username"
              />
              {errors.username && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.username}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Email <span style={{ color: '#dc2626' }}>*</span>
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
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.email}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                First Name <span style={{ color: '#dc2626' }}>*</span>
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
                placeholder="John"
              />
              {errors.first_name && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.first_name}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Last Name <span style={{ color: '#dc2626' }}>*</span>
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
                placeholder="Doe"
              />
              {errors.last_name && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.last_name}</p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Password <span style={{ color: '#dc2626' }}>*</span>
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

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Confirm Password <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: `1px solid ${errors.confirmPassword ? '#dc2626' : '#d1d5db'}`,
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: isLoading ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem'
              }}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupView;