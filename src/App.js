import React from 'react';
import { Box } from '@chakra-ui/react';
// import { ColorModeSwitcher } from './ColorModeSwitcher';
// import { Logo } from './Logo';
import Navbar from './components/Navbar.js';
import LandingPage from './views/LandingPage/index.js';
import { Route, Routes } from 'react-router-dom';
import NewsPage from './views/NewsPage/index.js';
import Footer from './components/Footer.js';
import ProfilPage from './views/ProfilPage/index.js';
import PageNotFound from './views/PageNotFound/index.js';
import PemerintahanPage from './views/PemerintahanPage/index.js';
import LayananPage from './views/LayananPage/index.js';
import PotensiPage from './views/PotensiPage/index.js';
import TransparansiPage from './views/TransparansiPage/index.js';
import KontakPage from './views/KontakPage/index.js';
import MediaPage from './views/MediaPage/index.js';
import AdminPage from './views/AdminPage/index.js';
import MiniPlayer from './components/MiniPlayer.js';
import Chatbot from './components/Chatbot.js';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <Box>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/pemerintahan" element={<PemerintahanPage />} />
        <Route path="/layanan" element={<LayananPage />} />
        <Route path="/potensi" element={<PotensiPage />} />
        <Route path="/transparansi" element={<TransparansiPage />} />
        <Route path="/kontak" element={<KontakPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {!isAdmin && <MiniPlayer />}
      {!isAdmin && <Chatbot />}
      {!isAdmin && <Footer />}
    </Box>
  );
}

export default App;
