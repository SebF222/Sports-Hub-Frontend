import React from 'react'

const ProfileStats = ({ user, favorites }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
      gap: '1rem',
      marginTop: '1rem' 
    }}>
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#eff6ff', 
        borderRadius: '0.5rem',
        textAlign: 'center' 
      }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
          {favorites.length}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Favorite Teams
        </div>
      </div>
      
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#f0fdf4', 
        borderRadius: '0.5rem',
        textAlign: 'center' 
      }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
          {user.username}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          Username
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;