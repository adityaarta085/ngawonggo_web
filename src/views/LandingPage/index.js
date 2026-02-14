import React from 'react';
import { Box } from '@mui/material';
import Hero from './components/Hero.js';
import QuickLinks from './components/QuickLinks.js';
import LatestNews from './components/LatestNews.js';
import Travel from './components/Travel.js';
import DusunSection from './components/DusunSection.js';
import VideoPromo from './components/VideoPromo.js';
import Supports from './components/Supports.js';
import StatsSection from './components/StatsSection.js';
import PengaduanSection from './components/PengaduanSection.js';

export default function LandingPage({ isReady }) {
  return (
    <Box>
      <Hero isReady={isReady} />
      <StatsSection />
      <QuickLinks />
      <DusunSection />
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
