import React, { useState, useEffect } from 'react';
import { EsportsProvider, useEsports } from './context/EsportsContext';
import { CyberBackground } from './components/CyberBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StatsStrip } from './components/StatsStrip';
import { Cinematic3DExperience } from './components/Cinematic3DExperience';
import { RosterSection } from './components/RosterSection';
import { TournamentsSection } from './components/TournamentsSection';
import { MediaSection } from './components/MediaSection';
import { CollectionSection } from './components/CollectionSection';
import { CommunitySection } from './components/CommunitySection';
import { AboutSection } from './components/AboutSection';
import { JoinSection } from './components/JoinSection';
import { Footer } from './components/Footer';
import { PlayerModal } from './components/PlayerModal';
import { AdminModal } from './components/AdminModal';
import { ContactModal } from './components/ContactModal';
import { LegalModal } from './components/LegalModal';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const { selectedPlayer, setSelectedPlayer } = useEsports();

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'home',
        '3d-experience',
        'roster',
        'matches',
        'media',
        'collection',
        'community',
        'about',
        'join',
      ];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#08060D] text-[#DDE1E8] selection:bg-[#075BFF] selection:text-white font-rajdhani">
      {/* Interactive WebGL / Canvas Particle Background */}
      <CyberBackground />

      {/* Sticky Cinematic Navigation */}
      <Navbar activeSection={activeSection} />

      {/* Main Experience Flow */}
      <main className="relative z-10">
        <Hero />
        <StatsStrip />
        <Cinematic3DExperience />
        <RosterSection />
        <TournamentsSection />
        <MediaSection />
        <CollectionSection />
        <CommunitySection />
        <AboutSection />
        <JoinSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <PlayerModal
        player={selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
      />
      <AdminModal />
      <ContactModal />
      <LegalModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <EsportsProvider>
      <MainLayout />
    </EsportsProvider>
  );
};

export default App;
