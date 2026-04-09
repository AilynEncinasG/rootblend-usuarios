// frontend/src/components/dashboard/Sidebar.tsx
import { StyledSidebar } from '../../styles/GlobalStyles';
import { ChannelCard } from './ChannelCard';

// Pruebiras
const MOCK_CHANNELS = [
  { id: 1, name: 'CyberPunk_2077', game: 'Night City Live', online: true },
  { id: 2, name: 'GamerX', game: 'Valorant Ranked', online: false },
  { id: 3, name: 'DevMaster', game: 'TypeScript Tips', online: true },
];

export const Sidebar = () => {
  return (
    <StyledSidebar>
      <h4 style={{ 
        fontSize: '0.75rem', 
        opacity: 0.5, 
        textTransform: 'uppercase', 
        letterSpacing: '1px',
        marginBottom: '10px' 
      }}>
        Canales Recomendados
      </h4>
      
      {MOCK_CHANNELS.map((channel) => (
        <ChannelCard 
          key={channel.id}
          name={channel.name}
          game={channel.game}
          isOnline={channel.online}
        />
      ))}
    </StyledSidebar>
  );
};