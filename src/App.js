import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Flex, Tooltip, HStack, Collapse } from '@chakra-ui/react';
import Navbar from './components/Navbar.js';
import LandingPage from './views/LandingPage/index.js';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import NewsPage from './views/NewsPage/index.js';
import InstallPWA from "./components/InstallPWA";
import Footer from './components/Footer.js';
import ProfilPage from './views/ProfilPage/index.js';
import PageNotFound from './views/PageNotFound/index.js';
import PemerintahanPage from './views/PemerintahanPage/index.js';
import LayananPage from './views/LayananPage/index.js';
import JelajahiPage from './views/JelajahiPage/index.js';
import TransparansiPage from './views/TransparansiPage/index.js';
import KontakPage from './views/KontakPage/index.js';
import MediaPage from './views/MediaPage/index.js';

import AnimePage from './views/AnimePage/index.js';
import AnimeDetail from './views/AnimePage/Detail.js';
import AnimeWatch from './views/AnimePage/Watch.js';
import AnimeBatch from './views/AnimePage/Batch.js';

import DusunPage from './views/DusunPage/index.js';
import QuranPage from './views/QuranPage/index.js';
import NewsDetail from './views/NewsPage/NewsDetail.js';
import LoginPromo from './components/LoginPromo.js';
import AdminPage from './views/AdminPage/index.js';
import Login from './views/AdminPage/Login.js';
import CSApp from './views/AdminPage/cs';
import PrivacyPolicy from './views/Legal/PrivacyPolicy.js';
import TermsConditions from './views/Legal/TermsConditions.js';
import CreditsPage from './views/CreditsPage/index.js';
import ScrollToTop from './components/ScrollToTop.js';
import Preloader from './components/Preloader.js';
import SplashScreen from './components/SplashScreen.js';
import HumanVerification from './components/HumanVerification.js';
import Chatbot from './components/Chatbot.js';
import RunningText from './components/RunningText.js';
import TopBarWeather from './components/TopBarWeather.js';

import PopupNotification from './components/PopupNotification.js';
import TakedownPage from './views/TakedownPage/index.js';
import BlockedPage from './views/BlockedPage/index.js';
import usePageTracking from './hooks/usePageTracking';
import { supabase } from './lib/supabase';

// User Portal Views
import AuthPage from './views/AuthPage/index.js';
import EduGameRouter from './views/EduGamePage/EduGameRouter';
import PortalPage from './views/PortalPage/index.js';
import DonasiRouter from './views/DonasiPage/index.js';
import TopupPage from './views/TopupPage/index.js';

const TopBar = ({ isScrolled }) => {
  return (
    <Collapse in={!isScrolled} animateOpacity>
        <Box
          layerStyle="liquidGlass" borderBottom="1px solid" borderColor="whiteAlpha.300" bg="rgba(255, 255, 255, 0.4)"
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

              <Box flex={1} overflow="hidden">
                <RunningText isEmbedded={true} />
              </Box>
            </HStack>
            <TopBarWeather />
          </Flex>
        </Box>
    </Collapse>
  );
};

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isAuth = location.pathname.startsWith('/auth');
  const isDownPage = location.pathname === '/down';
  const isBlockedPage = location.pathname === '/blocked';

  const [adminSession, setAdminSession] = useState(() => {
    try {
      const localSession = localStorage.getItem('adminSession');
      return localSession ? JSON.parse(localSession) : null;
    } catch (e) {
      console.error('Failed to access localStorage:', e);
      return null;
    }
  });

  const [userSession, setUserSession] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [isVerified, setIsVerified] = useState(() => {
    try {
      return sessionStorage.getItem('humanVerified') === 'true';
    } catch (e) {
      console.error('Failed to access sessionStorage:', e);
      return false;
    }
  });

  const [isTakedown, setIsTakedown] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

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
    const checkTakedown = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('key, value').in('key', ['is_takedown', 'is_blocked']);

        if (data) {
          const takedownSetting = data.find((d) => d.key === 'is_takedown');
          const blockedSetting = data.find((d) => d.key === 'is_blocked');
          if (takedownSetting && takedownSetting.value === 'true') setIsTakedown(true);
          if (blockedSetting && blockedSetting.value === 'true') setIsBlocked(true);
        }
      } catch (err) {
        console.error('Takedown check failed:', err);
      }
    };

    checkTakedown();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
      if (session) {
        setIsVerified(true);
      }
      setIsSessionLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
      if (session) {
        setIsVerified(true);
      }
      setIsSessionLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isBypassed = (!showPreloader && !showSplash && isVerified) || (userSession && !showPreloader && !showSplash);

  if (isBlocked && !isAdmin && !isBlockedPage) {
    return <Navigate to="/blocked" replace />;
  }

  if (!isBlocked && isBlockedPage) {
    return <Navigate to="/" replace />;
  }

  if (isTakedown && !isAdmin && !isDownPage) {
    return <Navigate to="/down" replace />;
  }

  if (!isTakedown && isDownPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box overflowX="hidden" maxW="100vw">
      {!isBypassed && !isAdmin && !isAuth && !isDownPage && !isBlockedPage && (
        <>
          {showPreloader ? (
            <Preloader onComplete={() => setShowPreloader(false)} timeout={3000} />
          ) : showSplash ? (
            <SplashScreen onComplete={() => setShowSplash(false)} />
          ) : (
            <HumanVerification onVerified={() => {
              try {
                sessionStorage.setItem('humanVerified', 'true');
              } catch (e) {
                console.error('Failed to access sessionStorage:', e);
              }
              setIsVerified(true);
            }} />
          )}
        </>
      )}

      <>
        {!isAdmin && !isAuth && !isDownPage && !isBlockedPage && (
          <>
            <Box
              h={{ base: scrolled ? '88px' : '128px', md: scrolled ? '104px' : '146px' }}
              transition="height 0.35s ease"
            />
            <Box
              zIndex={1100}
              w="full"
              position="fixed"
              top={0}
              left={0}
              right={0}
            >
              <TopBar isScrolled={scrolled} />
              <Box
                transition="padding 0.35s ease"
                pt={scrolled ? 2 : 0}
              >
                <Navbar user={userSession?.user} isScrolled={scrolled} />
              </Box>
            </Box>
          </>
        )}

        {!isAdmin && !isAuth && !isDownPage && !isBlockedPage && <PopupNotification />}

        {!isAdmin && !isAuth && !isDownPage && !isBlockedPage && <LoginPromo user={userSession?.user} />}
        <ScrollToTop />

        <Box pt={0} minH="80vh">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/profil" element={<ProfilPage />} />
            <Route path="/pemerintahan" element={<PemerintahanPage />} />
            <Route path="/layanan" element={<LayananPage />} />
            <Route path="/jelajahi" element={<JelajahiPage />} />
            <Route path="/transparansi" element={<TransparansiPage />} />
            <Route path="/kontak" element={<KontakPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/anime" element={<AnimePage />} />
            <Route path="/anime/:provider/detail/:slug" element={<AnimeDetail />} />
            <Route path="/anime/:provider/episode/:slug" element={<AnimeWatch />} />
            <Route path="/anime/:provider/batch/:batchId" element={<AnimeBatch />} />
            <Route path="/dusun/:slug" element={<DusunPage />} />
            <Route path="/quran" element={<QuranPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/donasi/*" element={<DonasiRouter />} />
            <Route path="/topup" element={<TopupPage />} />
            <Route path="/game/*" element={<EduGameRouter />} />

            <Route path="/down" element={<TakedownPage />} />
            <Route path="/blocked" element={<BlockedPage />} />

            <Route path="/auth" element={isSessionLoading ? null : (userSession ? <Navigate to="/portal" replace /> : <AuthPage />)} />
            <Route
                path="/portal"
                element={isSessionLoading ? null : (userSession ? <PortalPage /> : <Navigate to="/auth" replace />)}
            />

            <Route
              path="/admin"
              element={
                adminSession ? <AdminPage setSession={setAdminSession} /> : <Navigate to="/admin/login" replace />
              }
            />
            <Route path="/admin/login" element={<Login setSession={setAdminSession} />} />
            <Route path="/admin/cs/*" element={<CSApp />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Box>

        {!isAdmin && !isAuth && !isDownPage && !isBlockedPage && (
          <>
            {isVerified && (
              <Chatbot
                isHidden={isFloatingHidden}
                onHide={() => setIsFloatingHidden(true)}
              />
            )}

            {isFloatingHidden && isVerified && (
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

        {!isAdmin && !isAuth && !isDownPage && !isBlockedPage && <InstallPWA />}
        {!isAdmin && !isAuth && !isDownPage && !isBlockedPage && <Footer />}
      </>
    </Box>
  );
}

export default App;
