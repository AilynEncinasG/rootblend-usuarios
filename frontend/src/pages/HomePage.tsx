// frontend/src/pages/HomePage.tsx
import { DashboardLayout, StreamGrid } from '../styles/GlobalStyles';
import { Navbar } from '../components/dashboard/Navbar';
import { Sidebar } from '../components/dashboard/Sidebar';
import { StreamCard } from '../components/dashboard/StreamCard';

const MOCK_STREAMS = [
  { id: 1, title: 'Desarrollando ROOTBLEND desde cero', user: 'RootAdmin', category: 'Software Dev', viewers: '1.2k' },
  { id: 2, title: 'Final de la Copa Cyberpunk 2026', user: 'ESL_Live', category: 'Gaming', viewers: '45k' },
  { id: 3, title: 'Lo-Fi Beats to Code/Relax', user: 'SynthWave', category: 'Music', viewers: '800' },
  { id: 4, title: 'Aprendiendo TypeScript en 10 min', user: 'DevMaster', category: 'Education', viewers: '2.5k' },
  { id: 5, title: 'Solo Q Challenge - Road to Radiant', user: 'GamerX', category: 'Valorant', viewers: '5.1k' },
  { id: 6, title: 'Podcast: El futuro de la IA', user: 'TechTalks', category: 'Talk Shows', viewers: '150' },
];

const HomePage = () => {
  return (
    <DashboardLayout>
      <Navbar />
      <Sidebar />
      <main style={{ gridArea: 'main', overflowY: 'auto', padding: '30px' }}>
        <StreamGrid>
          {MOCK_STREAMS.map((stream) => (
            <StreamCard
              key={stream.id}
              title={stream.title}
              user={stream.user}
              category={stream.category}
              viewers={stream.viewers}
            />
          ))}
        </StreamGrid>
      </main>
    </DashboardLayout>
  );
};

export default HomePage;