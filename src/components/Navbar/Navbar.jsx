import React from 'react'
import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react';

// adding a clock 
const Navbar = () => {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer)
  }, []);

  // checking if someones is logged in 
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, []);


  //being able to log out 
  const handleLogout = () => {
    localStorage.removeItem('token') // logging out by removing first the token 
    localStorage.removeItem('user') // then we remove the user name 
    setUser(null) //current nobody is logged in thats why im doing setUser(null)
    window.location.href = '/login'; // where the page back tracks to 
  };

  // the format and how the date will be displayed on screen
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { // returning the time portion of a date as a string  
      hour: '2-digit', // displaying it in 2 digits so that its always show up as hh/mm/ss instead of hh/m/s when in the singular numbers
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short', // made it just hours and mintues
      month: 'short',
      day: 'numeric'
    });
  };


  return (
    <div style={{ backgroundColor: '#1f2937', color: 'white', padding: '1rem 2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: Logo and Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a
            href="/"
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontSize: '1.75rem' }}>🏆</span>
            SPORTS HUB
          </a>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a
              href="/"
              style={{
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
              onMouseLeave={(e) => e.target.style.color = 'white'}
            >
              Home
            </a>
            
            {user && (
              <>
                <a
                  href="/favorites/manage"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                  onMouseLeave={(e) => e.target.style.color = 'white'}
                >
                  Favorites
                </a>
                <a
                  href="/profile"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#60a5fa'}
                  onMouseLeave={(e) => e.target.style.color = 'white'}
                >
                  Profile
                </a>
              </>
            )}
          </div>
        </div>

        {/* Right: Date/Time and User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {/* Date and Time */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              {formatDate(currentTime)}
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              {formatTime(currentTime)}
            </div>
          </div>

          {/* User Menu */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                  {user.first_name} {user.last_name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  @{user.username}
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1f2937'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href="/login"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#1f2937';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'white';
                }}
              >
                Login
              </a>
              <a
                href="/signup"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
              >
                Sign Up
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar