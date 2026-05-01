// frontend/src/components/dashboard/ChannelCard.tsx
import React from 'react';
import { ChannelItem, Avatar } from '../../styles/GlobalStyles';

interface ChannelCardProps {
  name: string;
  game: string;
  isOnline: boolean;
  avatarUrl?: string;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ name, game, isOnline }) => {
  return (
    <ChannelItem title={name}>
      <Avatar $online={isOnline} />
      <div style={{ overflow: 'hidden' }}>
        <p style={{ 
          fontSize: '0.9rem', 
          fontWeight: 'bold', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {name}
        </p>
        <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>{game}</p>
      </div>
    </ChannelItem>
  );
};