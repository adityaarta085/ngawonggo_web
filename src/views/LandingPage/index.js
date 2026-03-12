import { InstallPWA, SEO } from "../../components";
import { Box } from '@chakra-ui/react';
import Hero from './components/Hero.js';
import QuickLinks from './components/QuickLinks.js';
import LatestNews from './components/LatestNews.js';
import DusunSection from './components/DusunSection.js';
import VideoPromo from './components/VideoPromo.js';
import Supports from './components/Supports.js';
import StatsSection from './components/StatsSection.js';
import PengaduanSection from './components/PengaduanSection.js';
import QuranAccess from './components/QuranAccess.js';
import BMKGSection from './components/BMKGSection.js';
import RamadanSection from './components/RamadanSection.js';

export default function LandingPage() {
  return (
    <Box>
      <SEO
        title="Beranda"
        description="Selamat datang di Website Resmi Desa Ngawonggo. Pusat informasi pelayanan publik, berita terkini, dan potensi desa di Kecamatan Kaliangkrik, Kabupaten Magelang."
      />
      <Hero />
      <InstallPWA />
      <RamadanSection />
      <BMKGSection />
      <QuickLinks />
      <StatsSection />
      <DusunSection />
      <LatestNews />
      <VideoPromo />
      <QuranAccess />
      <PengaduanSection />
      <Supports />
    </Box>
  );
}
