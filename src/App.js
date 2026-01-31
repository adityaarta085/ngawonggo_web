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
import PemerintahanPage from './views/PemerintahanPage/index.js';
import LayananPage from './views/LayananPage/index.js';
import PotensiPage from './views/PotensiPage/index.js';
import TransparansiPage from './views/TransparansiPage/index.js';
import KontakPage from './views/KontakPage/index.js';
import PageNotFound from './views/PageNotFound/index.js';

function App() {
  return (
    <Box>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/pemerintahan" element={<PemerintahanPage />} />
        <Route path="/layanan" element={<LayananPage />} />
        <Route path="/potensi" element={<PotensiPage />} />
        <Route path="/transparansi" element={<TransparansiPage />} />
        <Route path="/kontak" element={<KontakPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Box>
  );
}

export default App;
