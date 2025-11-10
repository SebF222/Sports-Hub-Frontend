import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = 'http://127.0.0.1:5000';



const TeamDetailsView = () => {
  const { sport, teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setisFavorite] = useState(false);

  useEffect(() => {
    loadTeamDetails();
    checkIfFavorite();
  }, [sport, teamId])

  const loadTeamDetails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch (`${API_URL}/sprts/${sport}/teams/${teamId}`);
      const data = await response.json();

      if (response.ok && data.response && data.response.length > 0) {
        setTeam(data.response[0]);
      } else {
        setError('Team no found');
      }
    } catch (err) {
      console.error('Error loading team:', err);
      setError('Failed to load team details');
    } finally {
      setIsLoading(false);
    }
  }

  const checkIfFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json()
        const exists = data.favorites.some(fav => fav.team_id ===parseInt(teamId));
        setisFavorite(exists);
      }
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };

  const handleToggleFavorite = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      try {
        const response = await fetch(`${API_URL}/favorites/${teamId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          setisFavorite(false);
          alert('Removed from favorites');
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
        alert('Failed to remove from favorites');
      }
    } else {
      try {
        const favoriteData = {
          team_id: team.id,
          team_name: team.name,
          team_logo: team.logo || team.image || '',
          league: team.league?.name || team.country?.name || sport.toUpperCase(),
          country: team.country?.name || team.country || ''
        };

        const response = await fetch(`${API_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body:JSON.stringify(favoriteData)
        });

        if (response.ok) {
          setisFavorite(true);
          alert('Added to favorites!');
        } else {
          const data = await response.json();
          alert(data.error || 'Failed to add to favorites');
        }
      } catch (error) {
        console.error('Error adding favorite:', error);
        alert('Failed to add to favorites');
      }
    }
  };


  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😞</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
            Team Not Found
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            {error || 'The team you are looking for could not be found.'}
          </p>
          
          <a
            href="/"
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
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Back Button */}
        <div style={{ marginBottom: '2rem' }}>
          
          <a
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#2563eb',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            ← Back to Home
          </a>
        </div>

        {/* Team Header */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {(team.logo || team.image) && (
              <img
                src={team.logo || team.image}
                alt={team.name}
                style={{ width: '120px', height: '120px', objectFit: 'contain' }}
              />
            )}
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
                {team.name}
              </h1>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {team.league?.name && (
                  <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500' }}>
                    {team.league.name}
                  </span>
                )}
                {team.country?.name && (
                  <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#f3f4f6', color: '#6b7280', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500' }}>
                    📍 {team.country.name}
                  </span>
                )}
              </div>
              <button
                onClick={handleToggleFavorite}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: isFavorite ? '#dc2626' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {isFavorite ? '❌ Remove from Favorites' : '⭐ Add to Favorites'}
              </button>
            </div>
          </div>
        </div>

        {/* Team Information */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
            Team Information
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Team Name
              </label>
              <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500' }}>{team.name}</p>
            </div>

            {team.code && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Team Code
                </label>
                <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500' }}>{team.code}</p>
              </div>
            )}

            {team.founded && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Founded
                </label>
                <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500' }}>{team.founded}</p>
              </div>
            )}

            {team.national !== undefined && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  National Team
                </label>
                <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500' }}>
                  {team.national ? 'Yes' : 'No'}
                </p>
              </div>
            )}

            {team.venue?.name && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Venue
                </label>
                <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500' }}>{team.venue.name}</p>
                {team.venue.city && (
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{team.venue.city}</p>
                )}
              </div>
            )}

            {team.venue?.capacity && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Capacity
                </label>
                <p style={{ fontSize: '1rem', color: '#111827', fontWeight: '500' }}>
                  {team.venue.capacity.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>
            About {team.name}
          </h2>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
            {team.name} is a professional {sport} team competing in the {team.league?.name || 'league'}. 
            {team.country?.name && ` The team is based in ${team.country.name}.`}
            {team.founded && ` Founded in ${team.founded}, `}
            {team.venue?.name && ` they play their home games at ${team.venue.name}`}
            {team.venue?.capacity && ` which has a capacity of ${team.venue.capacity.toLocaleString()} spectators`}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsView