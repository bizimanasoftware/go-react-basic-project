import React from 'react';

const cardStyle = {
  border: '1px solid #ddd',
  padding: '15px',
  borderRadius: '8px',
  backgroundColor: '#fff',
  boxShadow: '0 3px 6px rgba(0,0,0,0.12)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  cursor: 'pointer',
  marginBottom: '15px'
};

const titleStyle = {
  margin: '0 0 10px 0',
  fontSize: '1.3rem',
  fontWeight: 'bold'
};

const descriptionStyle = {
  margin: '0 0 10px 0',
  fontSize: '1rem',
  color: '#333'
};

const sponsorStyle = {
  fontSize: '0.85rem',
  color: '#888',
  fontStyle: 'italic'
};

function GigCard({ gig, onClick }) {
  return (
    <div
      style={cardStyle}
      onClick={() => onClick && onClick(gig)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.12)';
      }}
    >
      <h3 style={titleStyle}>{gig.title || 'Untitled Gig'}</h3>
      <p style={descriptionStyle}>{gig.description || 'No description available.'}</p>
      <p style={sponsorStyle}>Posted by: {gig.Sponsor?.name || 'A Sponsor'}</p>
    </div>
  );
}

export default GigCard;
