import { InstallPWA, SEO, SpecialEventPoster } from "../../components";
import { Box } from '@chakra-ui/react';
import Hero from './components/Hero.js';
import LatestNews from './components/LatestNews.js';
import DusunSection from './components/DusunSection.js';
import PodcastSection from './components/PodcastSection.js';
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
        title="Portal Resmi Desa Ngawonggo - Kecamatan Kaliangkrik Kabupaten Magelang"
        description="Selamat datang di Portal Resmi Desa Ngawonggo, Kecamatan Kaliangkrik, Kabupaten Magelang. Informasi publik terkini, berita desa, layanan digital warga, dan profil daerah."
        image="/logo_desa.png"
      />
      <SpecialEventPoster />
      <Hero />
      <InstallPWA />
      {/* Ramadan ended */}
      {/* <RamadanSection /> */}
      <StatsSection />
      <DusunSection />
      <LatestNews />
      <PodcastSection />
      <QuranAccess />
      <PengaduanSection />
      <Supports />
    </Box>
  );
}
