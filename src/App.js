import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Flex, Image, Tooltip, HStack, Text, Badge, Icon, Collapse } from '@chakra-ui/react';
import Navbar from './components/Navbar.js';
import LandingPage from './views/LandingPage/index.js';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import NewsPage from './views/NewsPage/index.js';
import Footer from './components/Footer.js';
import ProfilPage from './views/ProfilPage/index.js';
import PageNotFound from './views/PageNotFound/index.js';
import PemerintahanPage from './views/PemerintahanPage/index.js';
import LayananPage from './views/LayananPage/index.js';
import JelajahiPage from './views/JelajahiPage/index.js';
import TransparansiPage from './views/TransparansiPage/index.js';
import KontakPage from './views/KontakPage/index.js';
import MediaPage from './views/MediaPage/index.js';
import EduGamePage from './views/EduGamePage/index.js';
import DusunPage from './views/DusunPage/index.js';
import QuranPage from './views/QuranPage/index.js';
import NewsDetail from './views/NewsPage/NewsDetail.js';
import LoginPromo from './components/LoginPromo.js';
import AdminPage from './views/AdminPage/index.js';
import Login from './views/AdminPage/Login.js';
import PrivacyPolicy from './views/Legal/PrivacyPolicy.js';
import TermsConditions from './views/Legal/TermsConditions.js';
import CreditsPage from './views/CreditsPage/index.js';
import ScrollToTop from './components/ScrollToTop.js';
import SplashScreen from './components/SplashScreen.js';
import HumanVerification from './components/HumanVerification.js';
import Chatbot from './components/Chatbot.js';
import RunningText from './components/RunningText.js';
import PopupNotification from './components/PopupNotification.js';
import usePageTracking from './hooks/usePageTracking';
import { supabase } from './lib/supabase';
import { FaMoon } from 'react-icons/fa';

// User Portal Views
import AuthPage from './views/AuthPage/index.js';
import PortalPage from './views/PortalPage/index.js';

const TopBar = ({ isScrolled }) => {
  return (
    <Collapse in={!isScrolled} animateOpacity>
        <Box
          bg="white" borderBottom="1px solid" borderColor="gray.100"
          py={1}
          px={{ base: 4, md: 10 }}
          overflow="hidden"
          position="relative"
          zIndex={1100}
          boxShadow="none"
          aria-hidden={isScrolled}
        >
          <Flex justify="space-between" align="center" gap={{ base: 2, md: 4 }}>
            <HStack flex={1} spacing={{ base: 2, md: 4 }} maxW={{ base: "65%", md: "75%" }}>
              <Badge
                display={{ base: "none", sm: "flex" }}
                colorScheme="yellow"
                variant="subtle"
                alignItems="center"
                gap={1.5}
                px={3}
                py={1}
                borderRadius="full"
                border="1px solid"
                borderColor="yellow.200"
              >
                <Icon as={FaMoon} aria-hidden="true" />
                <Text fontSize="2xs" fontWeight="800">RAMADAN 1447H</Text>
              </Badge>
              <Box flex={1} overflow="hidden">
                <RunningText isEmbedded={true} />
              </Box>
            </HStack>
            <Image
              src="https://www.menpan.go.id/site/images/logo/berakhlak-bangga-melayani-bangsa.png"
              h={{ base: "14px", md: "28px" }}
              alt="Berakhlak - Bangga Melayani Bangsa"
              flexShrink={0}
              loading="lazy"
            />
          </Flex>
        </Box>
    </Collapse>
  );
};

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isAuth = location.pathname.startsWith('/auth');

  const [adminSession, setAdminSession] = useState(() => {
    const localSession = localStorage.getItem('adminSession');
    return localSession ? JSON.parse(localSession) : null;
  });

  const [userSession, setUserSession] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isVerified, setIsVerified] = useState(() => {
    return sessionStorage.getItem('isVerified') === 'true';
  });

  const [isFloatingHidden, setIsFloatingHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  usePageTracking();

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
      if (session) {
        setShowSplash(false);
        setIsVerified(true);
        sessionStorage.setItem('isVerified', 'true');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
      if (session) {
        setShowSplash(false);
        setIsVerified(true);
        sessionStorage.setItem('isVerified', 'true');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isBypassed = (!showSplash && isVerified) || userSession;

  return (
    <Box overflowX="hidden" maxW="100vw">
      {!isBypassed && !isAdmin && !isAuth && (
        <>
          {showSplash ? (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          ) : (
            <HumanVerification onVerified={() => {
              setIsVerified(true);
              sessionStorage.setItem('isVerified', 'true');
            }} />
          )}
        </>
      )}

      {!isAdmin && !isAuth && (
        <Box
          zIndex={1100}
          w="full"
          position="fixed"
          top="0"
          left="0"
          right="0"
          pointerEvents="none"
        >
          <Box pointerEvents="auto">
            <TopBar isScrolled={scrolled} />
          </Box>
          <Box
            pointerEvents="auto"
            transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          >
            <Navbar user={userSession?.user} isScrolled={scrolled} />
          </Box>
        </Box>
      )}

      {!isAdmin && !isAuth && <PopupNotification />}

      {!isAdmin && !isAuth && <LoginPromo user={userSession?.user} />}
      <ScrollToTop />

      <Box pt={0} minH="80vh">
        <Routes>
          <Route path="/" element={<LandingPage isReady={isBypassed} />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/profil" element={<ProfilPage />} />
          <Route path="/pemerintahan" element={<PemerintahanPage />} />
          <Route path="/layanan" element={<LayananPage />} />
          <Route path="/jelajahi" element={<JelajahiPage />} />
          <Route path="/transparansi" element={<TransparansiPage />} />
          <Route path="/kontak" element={<KontakPage />} />
          <Route path="/media" element={<MediaPage />} />
          <Route path="/game-edukasi" element={<EduGamePage />} />
          <Route path="/dusun/:slug" element={<DusunPage />} />
          <Route path="/quran" element={<QuranPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/credits" element={<CreditsPage />} />

          <Route path="/auth" element={<AuthPage />} />
          <Route
              path="/portal"
              element={userSession ? <PortalPage /> : <Navigate to="/auth" replace />}
          />

          <Route
            path="/admin"
            element={
              adminSession ? <AdminPage setSession={setAdminSession} /> : <Navigate to="/admin/login" replace />
            }
          />
          <Route path="/admin/login" element={<Login setSession={setAdminSession} />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Box>

      {!isAdmin && !isAuth && !showSplash && isVerified && (
        <>
          <Chatbot
            isHidden={isFloatingHidden}
            onHide={() => setIsFloatingHidden(true)}
          />

          {isFloatingHidden && (
            <Tooltip label="Tampilkan Panel" placement="left" aria-label="Restore Panels">
              <Box
                position="fixed"
                right={0}
                top="50%"
                transform="translateY(-50%)"
                w="8px"
                h="120px"
                bg="brand.500"
                cursor="pointer"
                zIndex={2000}
                borderLeftRadius="full"
                onClick={() => setIsFloatingHidden(false)}
                _hover={{ w: '12px', bg: 'brand.400' }}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                boxShadow="lg"
              />
            </Tooltip>
          )}
        </>
      )}

      {!isAdmin && !isAuth && <Footer />}
    </Box>
  );
}

export default App;
