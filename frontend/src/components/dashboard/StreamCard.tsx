import React from 'react';
import {Thumbnail } from '../../styles/GlobalStyles';

interface StreamProps {
  title: string;
  user: string;
  category: string;
  viewers: string;
}

export const StreamCard: React.FC<StreamProps> = ({ title, user, category, viewers }) => {
  return (
    <div style={{ cursor: 'pointer' }}>
      <Thumbnail>
        <span style={{ opacity: 0.4, fontSize: '0.8rem' }}>{viewers} viewers</span>
      </Thumbnail>
      <h4 style={{ 
        fontSize: '0.95rem', 
        fontWeight: '700',
        marginBottom: '4px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis' 
      }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>{user}</p>
      <div style={{ display: 'flex', gap: '5px', marginTop: '8px' }}>
        <span style={{ 
          fontSize: '0.7rem',
          fontWeight: '600',
          color: '#00f2fe'
        }}>
          {category}
        </span>
      </div>
    </div>
  );
};