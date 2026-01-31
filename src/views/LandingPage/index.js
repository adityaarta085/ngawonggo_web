
import { Box } from '@chakra-ui/react';
import Hero from './components/Hero.js';
import QuickLinks from './components/QuickLinks.js';
import LatestNews from './components/LatestNews.js';
import Travel from './components/Travel.js';
import VideoPromo from './components/VideoPromo.js';
import Supports from './components/Supports.js';
import StatsSection from './components/StatsSection.js';
import PengaduanSection from './components/PengaduanSection.js';

export default function LandingPage() {
  return (
    <Box>
      <Hero />
      <StatsSection />
      <QuickLinks />
      <LatestNews />
      <Box id='wisata'>
        <Travel />
      </Box>
      <VideoPromo />
      <PengaduanSection />
      <Supports />
    </Box>
  );
}
