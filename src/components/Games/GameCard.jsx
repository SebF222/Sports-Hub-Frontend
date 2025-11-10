import React from 'react'

const GameCard = ({ game }) => {
  return (
    <div
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
        <div style={{ 
          display: 'inline-block', 
          padding: '0.25rem 0.75rem', 
          backgroundColor: '#fee2e2', 
          color: '#991b1b', 
          borderRadius: '9999px', 
          fontSize: '0.75rem', 
          fontWeight: '600' 
        }}>
          LIVE
        </div>
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
          {game.status?.long || 'In Progress'}
        </div>
      </div>
    </div>
  );
};

export default GameCard;