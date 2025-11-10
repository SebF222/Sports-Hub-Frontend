import React from 'react'

const FavoriteCard = ({ favorite, onRemove }) => {
  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid #e5e7eb',
        borderRadius: '0.375rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {favorite.team_logo && (
          <img
            src={favorite.team_logo}
            alt={favorite.team_name}
            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
          />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
            {favorite.team_name}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            {favorite.league}
          </div>
          {favorite.country && (
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              {favorite.country}
            </div>
          )}
        </div>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(favorite)}
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
      )}
    </div>
  );
};

export default FavoriteCard;