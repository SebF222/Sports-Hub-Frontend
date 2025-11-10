import React from 'react'
import { useState, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:5000';

const ManageFavoritesView = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('basketball');
  const [searchResults, setSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const sportOptions = [
    { id: 'basketball', name: 'Basketball', icon: '🏀'},
    { id: 'baseball', name: 'Baseball', icon: '⚾'},
    { id: 'nfl', name: 'NFL', icon: '🏈'},
    { id: 'soccer', name: 'Soccer', icon: '⚽'}
  ]; 

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
      return; 
    }

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
      showMessage('error', 'Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  };
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showMessage('error', 'Please enter a team name');
      return;
    }

    setIsSearching(true);
    setSearchResults([]);

    try {
      const response = await fetch(
        `${API_URL}/sports/${selectedSport}/teams/search?name=${encodeURIComponent(searchQuery)}`
      );
    
      const data = await response.json();
      if (response.ok && data.response) {
        setSearchResults(data.response.slice(0, 20));
        if (data.response.length === 0) {
          showMessage('error', 'No teams found');
        }
      } else {
        showMessage('error', 'Search failed. Please try again.');
      }
    } catch (error) {
      console.error('Search error:', error);
      showMessage('error', 'Search failed. Please try again.')
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFavorite = async (team) => {
    const token = localStorage.getItem('token');

    const alreadyExists = favorites.some(fav => fav.team_id === team.id);
    if (alreadyExists) {
      showMessage('error', 'Team already in favorites')
      return;
    }

    try {
      const favoriteData = {
        team_id: team.id,
        team_name: team.name,
        team_logo: team.logo || team.image || '',
        league: team.league?.name || team.country?.name || selectedSport.toUpperCase(),
        country: team.country?.name || team.country || ''
      };

      const response = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(favoriteData)
      }); 

      const data = await response.json();

      if (response.ok) {
        setFavorites(prev => [... prev, data.favorite]);
        showMessage('success', `${team.name} added to favorites!`);
      } else {
        showMessage('error', data.error || 'Failed to add favorite');
      }
    } catch (error) {
      console.error('Add favorite error:', error);
      showMessage('error', 'Failed to add favorite');
    }
  };

  const handleRemoveFavorite = async (favoriteId, teamName) => {
    const token = localStorage.getItem('token');

    if (!window.confirm(`Remove ${teamName} from favorites?`)) {
      return;
    }

    try {
      const favorite = favorites.find(f => f.id === favoriteId);
      if (!favorite) return;

      const response = await fetch(`${API_URL}/favorites/${favorite.team_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
        showMessage('success', `${teamName} removed from favorites`);
      } else {
        showMessage('error', 'Failed to remove favorite');
      }
    } catch (error) {
      console.error('Remove favorite error:', error);
      showMessage('error', 'Failed to remove favorite');
    }
  };

return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Manage Favorite Teams</h1>
            <a
              href="/home"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              ← Back to Home
            </a>
          </div>
          <p style={{ color: '#6b7280' }}>Search and add your favorite sports teams</p>
        </div>

        {message.text && (
          <div style={{
            padding: '1rem',
            backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
            borderRadius: '0.375rem',
            marginBottom: '1rem'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: message.type === 'success' ? '#065f46' : '#991b1b'
            }}>
              {message.text}
            </p>
          </div>
        )}

        {/* Search Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
            Search Teams
          </h2>

          {/* Sport Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Select Sport
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {sportOptions.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => setSelectedSport(sport.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    backgroundColor: selectedSport === sport.id ? '#2563eb' : '#e5e7eb',
                    color: selectedSport === sport.id ? 'white' : '#374151'
                  }}
                >
                  {sport.icon} {sport.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter team name (e.g., Lakers, Yankees, Patriots)"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '1rem'
              }}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: isSearching ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: isSearching ? 'not-allowed' : 'pointer'
              }}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
                Search Results ({searchResults.length})
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {searchResults.map((team) => (
                  <div
                    key={team.id}
                    style={{
                      padding: '1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {(team.logo || team.image) && (
                        <img
                          src={team.logo || team.image}
                          alt={team.name}
                          style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{team.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {team.league?.name || team.country?.name || ''}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddFavorite(team)}
                      style={{
                        padding: '0.5rem',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      + Add to Favorites
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Favorites */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
            Your Favorites ({favorites.length})
          </h2>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: '#6b7280' }}>Loading favorites...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⭐</div>
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>No favorite teams yet</p>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Search for teams above to add them to your favorites
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {fav.team_logo && (
                      <img
                        src={fav.team_logo}
                        alt={fav.team_name}
                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{fav.team_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{fav.league}</div>
                      {fav.country && (
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{fav.country}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(fav.id, fav.team_name)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ManageFavoritesView