import React, { useState, useEffect } from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';
import Navbar from './components/Navbar.js';
import LandingPage from './views/LandingPage/index.js';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
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
import EduGamePage from './views/EduGamePage/index.js';
import DusunPage from './views/DusunPage/index.js';
import NewsDetail from './views/NewsPage/NewsDetail.js';
import AdminPage from './views/AdminPage/index.js';
import Login from './views/AdminPage/Login.js';
import PrivacyPolicy from './views/Legal/PrivacyPolicy.js';
import TermsConditions from './views/Legal/TermsConditions.js';
import MiniPlayer from './components/MiniPlayer.js';
import SplashScreen from './components/SplashScreen.js';
import HumanVerification from './components/HumanVerification.js';
import Chatbot from './components/Chatbot.js';
import RunningText from './components/RunningText.js';
import PopupNotification from './components/PopupNotification.js';
import usePageTracking from './hooks/usePageTracking';
import { supabase } from './lib/supabase';

const TopBar = () => {
  return (
    <Box bg="white" py={2} px={8} borderBottom="1px solid" borderColor="gray.100">
      <Flex justify="space-between" align="center">
        <Box flex={1} mr={4} maxW="70%">
          <RunningText isEmbedded={true} />
        </Box>
        <Image
          src="https://www.menpan.go.id/site/images/logo/berakhlak-bangga-melayani-bangsa.png"
          h="30px"
          alt="Berakhlak - Bangga Melayani Bangsa"
        />
      </Flex>
    </Box>
  );
};

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [session, setSession] = useState(() => {
    const localSession = localStorage.getItem('adminSession');
    return localSession ? JSON.parse(localSession) : null;
  });
  const [showSplash, setShowSplash] = useState(true);
  const [isVerified, setIsVerified] = useState(() => {
    return sessionStorage.getItem('isVerified') === 'true';
  });

  usePageTracking();

  useEffect(() => {
    // Tetap dengarkan sesi Supabase jika ada fitur lain yang membutuhkannya
    supabase.auth.getSession().then(({ data: { session: authSession } }) => {
      if (authSession) setSession(authSession);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, authSession) => {
      if (authSession) {
        setSession(authSession);
      } else if (!localStorage.getItem('adminSession')) {
        setSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Box>
      {/* Integration Gate untuk interaksi video */}
      {!showSplash && !isVerified && !isAdmin && (
        <HumanVerification onVerified={() => {
          setIsVerified(true);
          sessionStorage.setItem('isVerified', 'true');
        }} />
      )}
      {showSplash && !isAdmin && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      {!isAdmin && <TopBar />}
      {!isAdmin && <Navbar />}
      {!isAdmin && <PopupNotification />}
      <Routes>
        <Route path="/" element={<LandingPage isReady={!showSplash && isVerified} />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/pemerintahan" element={<PemerintahanPage />} />
        <Route path="/layanan" element={<LayananPage />} />
        <Route path="/potensi" element={<PotensiPage />} />
        <Route path="/transparansi" element={<TransparansiPage />} />
        <Route path="/kontak" element={<KontakPage />} />
        <Route path="/media" element={<MediaPage />} />
        <Route path="/game-edukasi" element={<EduGamePage />} />
        <Route path="/dusun/:slug" element={<DusunPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route
          path="/admin"
          element={
            session ? <AdminPage setSession={setSession} /> : <Navigate to="/admin/login" replace />
          }
        />
        <Route path="/admin/login" element={<Login setSession={setSession} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {!isAdmin && <MiniPlayer />}
      {!isAdmin && <Chatbot />}
      {!isAdmin && <Footer />}
    </Box>
  );
}

export default App;
