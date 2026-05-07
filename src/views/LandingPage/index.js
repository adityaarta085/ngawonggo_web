import { InstallPWA, SEO, SpecialEventPoster } from "../../components";
import { Box } from '@chakra-ui/react';
import Hero from './components/Hero.js';
import LatestNews from './components/LatestNews.js';
import DusunSection from './components/DusunSection.js';
import VideoPromo from './components/VideoPromo.js';
import Supports from './components/Supports.js';
import StatsSection from './components/StatsSection.js';
import PengaduanSection from './components/PengaduanSection.js';
import QuranAccess from './components/QuranAccess.js';

export default function LandingPage() {
  return (
    <Box bg="neo.midnight">
      <SEO
        title="Beranda"
        description="Kecamatan Kaliangkrik, Kabupaten Magelang, Propinsi Jawa Tengah."
      />
      <SpecialEventPoster />

      {/* 1. Hero (Dark/Slate bg) */}
      <Hero />
      <InstallPWA />

      {/* 2. Stats (Warm White bg) */}
      <StatsSection />

      {/* 3. Dusun (Warm White bg, pattern) */}
      <Box position="relative">
        <Box position="absolute" top="-20px" left={0} right={0} h="40px" bg="neo.yellow" borderY="3px solid black" zIndex={10} transform="skewY(-1deg)" />
        <DusunSection />
      </Box>

      {/* 4. Latest News (White bg) */}
      <LatestNews />

      {/* 5. Video Promo (Dark bg) */}
      <VideoPromo />

      {/* 6. Quran Access (Banner over Pengaduan/Supports) */}
      <Box bg="neo.warmWhite" pt={12} pb={4} position="relative" zIndex={2}>
        <QuranAccess />
      </Box>

      {/* 7. Pengaduan (Warm White bg) */}
      <PengaduanSection />

      {/* 8. Supports (Warm White bg) */}
      <Supports />

    </Box>
  );
}
