import { InstallPWA, SEO, SpecialEventPoster, AdSenseComponent } from "../../components";
import { Box } from '@chakra-ui/react';
import Hero from './components/Hero.js';
import LatestNews from './components/LatestNews.js';
import DusunSection from './components/DusunSection.js';
import VideoPromo from './components/VideoPromo.js';
import Supports from './components/Supports.js';
import StatsSection from './components/StatsSection.js';
import PengaduanSection from './components/PengaduanSection.js';
import QuranAccess from './components/QuranAccess.js';
// Ramadan has ended
// import RamadanSection from './components/RamadanSection.js';

export default function LandingPage() {
  return (
    <Box>
      <SEO
        title="Beranda"
        description="Kecamatan Kaliangkrik, Kabupaten Magelang, Propinsi Jawa Tengah."
      />
      <SpecialEventPoster />
      <Hero />
      <InstallPWA />
      {/* Ramadan ended */}
      {/* <RamadanSection /> */}
      <StatsSection />
      <DusunSection />
      <AdSenseComponent />
      <LatestNews />
      <VideoPromo />
      <QuranAccess />
      <PengaduanSection />
      <Supports />
    </Box>
  );
}
