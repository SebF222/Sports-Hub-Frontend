import React from 'react'
import { useState, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:5000';

const HomeView = () => {
  const [user, setUser] =useState(null);
  const [favorites, setFavorites] = useState([]);
  const [liveGames, setLiveGames] = useState([]);
  const [selectedSport, setSelectedSport] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      loadFavorites(token);
    }

    loadLiveGames();
  }, [selectedSport]);

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

  const loadLiveGames = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/sports/${selectedSport}/games/live`);
      const data = await response.json();

      if (response.ok && data.response) {
        setLiveGames(data.response.slice(0, 10));
      } else {
        setLiveGames([]);
      }
    } catch (error) {
      console.error('Error loading games:', error);
      setLiveGames([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (date) => {
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(currentTime);

  const sportTabs = [
    {id: 'basketball', name: 'Basketball', icon: '🏀'},
    {id: 'baseball', name: 'Baseball', icon: '⚾'},
    {id: 'nfl', name: 'NFL', icon:'🏈' },
    {id: 'soccer', name: 'Soccer', icon: '⚽'}
  ];


  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header with date/time */}
      <div style={{ backgroundColor: '#1f2937', color: 'white', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Sports Hub</h1>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{date}</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{time}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>
            {user ? `Welcome back, ${user.first_name}!` : 'Welcome to Sports Hub'}
          </h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            {user ? 'Track your favorite teams and watch live games' : 'Please log in to track your favorite teams'}
          </p>
        </div>

        {/* Favorites Section */}
        {user && favorites.length > 0 && (
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
              Your Favorite Teams
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <img
                    src={fav.team_logo}
                    alt={fav.team_name}
                    style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                  />
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{fav.team_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{fav.league}</div>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="/favorites/manage"
              style={{
                display: 'inline-block',
                marginTop: '1rem',
                color: '#2563eb',
                fontSize: '0.875rem',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Manage Favorites →
            </a>
          </div>
        )}

        {/* Sport Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {sportTabs.map((sport) => (
            <button
              key={sport.id}
              onClick={() => setSelectedSport(sport.id)}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: selectedSport === sport.id ? '#2563eb' : 'white',
                color: selectedSport === sport.id ? 'white' : '#374151',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s'
              }}
            >
              {sport.icon} {sport.name}
            </button>
          ))}
        </div>

        {/* Live Games Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
            🔴 Live Games - {sportTabs.find(s => s.id === selectedSport)?.name}
          </h3>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
              <p style={{ color: '#6b7280' }}>Loading live games...</p>
            </div>
          ) : liveGames.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {liveGames.map((game, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{ textAlign: 'center', minWidth: '100px' }}>
                      <div style={{ fontWeight: '600' }}>
                        {game.teams?.home?.name || game.homeTeam?.name || 'Home Team'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>HOME</div>
                    </div>
                    
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
                      VS
                    </div>
                    
                    <div style={{ textAlign: 'center', minWidth: '100px' }}>
                      <div style={{ fontWeight: '600' }}>
                        {game.teams?.away?.name || game.awayTeam?.name || 'Away Team'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>AWAY</div>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                      LIVE
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      {game.status?.long || 'In Progress'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📺</div>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>No live games at the moment</p>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Check back later for live {sportTabs.find(s => s.id === selectedSport)?.name.toLowerCase()} games
              </p>
            </div>
          )}
        </div>

        {/* CTA for non-logged-in users */}
        {!user && (
          <div style={{ marginTop: '2rem', textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Want to track your favorite teams?
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Create an account to save your favorite teams and get personalized updates
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a
                href="/signup"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 2rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Sign Up
              </a>
              <a
                href="/login"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 2rem',
                  backgroundColor: 'white',
                  color: '#2563eb',
                  border: '2px solid #2563eb',
                  borderRadius: '0.375rem',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Log In
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView