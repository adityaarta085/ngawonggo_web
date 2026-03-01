import React, { useState, useEffect } from 'react';
import { Box, Flex, Image, Tooltip, HStack, Text, Badge, Icon } from '@chakra-ui/react';
import { Navbar, Sidebar } from './components/index.js';
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

const TopBar = ({ layout }) => {
  return (
    <Box
        bg="white"
        py={2}
        px={{ base: 4, md: 8 }}
        borderBottom="1px solid"
        borderColor="gray.100"
        ml={layout === 'vertical' ? { lg: '80px' } : 0}
        transition="margin 0.3s"
    >
      <Flex justify="space-between" align="center" gap={4}>
        <HStack flex={1} spacing={4} maxW="70%">
          <Badge
            display={{ base: "none", md: "flex" }}
            colorScheme="yellow"
            variant="subtle"
            alignItems="center"
            gap={1}
            px={3}
            py={1}
            borderRadius="full"
          >
            <Icon as={FaMoon} />
            <Text fontSize="xs" fontWeight="bold">RAMADAN 1447H</Text>
          </Badge>
          <Box flex={1}>
            <RunningText isEmbedded={true} />
          </Box>
        </HStack>
        <Image
          src="https://www.menpan.go.id/site/images/logo/berakhlak-bangga-melayani-bangsa.png"
          h={{ base: "20px", md: "30px" }}
          alt="Berakhlak - Bangga Melayani Bangsa"
        />
      </Flex>
    </Box>
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

  // Nav Layout Preference
  const [navLayout, setNavLayout] = useState(() => {
    return localStorage.getItem('navLayout') || 'vertical';
  });

  // Listen for storage changes to sync layout across tabs if necessary
  useEffect(() => {
    const handleStorage = () => {
        setNavLayout(localStorage.getItem('navLayout') || 'vertical');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Floating windows hide logic (Now manual only as requested)
  const [isFloatingHidden, setIsFloatingHidden] = useState(false);

  usePageTracking();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserSession(session);
      if (session) {
        // Bypass splash & verification if user is logged in
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

  const showNav = !isAdmin && !isAuth;

  return (
    <Box>
      {!showSplash && !isVerified && !isAdmin && !isAuth && (
        <HumanVerification onVerified={() => {
          setIsVerified(true);
          sessionStorage.setItem('isVerified', 'true');
        }} />
      )}
      {showSplash && !isAdmin && !isAuth && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {showNav && <TopBar layout={navLayout} />}
      {showNav && navLayout === 'vertical' && <Sidebar user={userSession?.user} />}
      {showNav && <Navbar user={userSession?.user} layout={navLayout} />}
      {showNav && <PopupNotification />}

      <ScrollToTop />

      <Box
        ml={showNav && navLayout === 'vertical' ? { lg: '80px' } : 0}
        transition="margin 0.3s"
        minH="100vh"
      >
        <Routes>
            <Route path="/" element={<LandingPage isReady={(!showSplash && isVerified) || userSession} />} />
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

            {/* User Auth & Portal */}
            <Route path="/auth" element={<AuthPage />} />
            <Route
                path="/portal"
                element={userSession ? <PortalPage onLayoutChange={setNavLayout} layout={navLayout} /> : <Navigate to="/auth" replace />}
            />

            {/* Admin Panel */}
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

      {showNav && !showSplash && isVerified && (
        <>
          <Chatbot
            isHidden={isFloatingHidden}
            onHide={() => setIsFloatingHidden(true)}
          />

          {/* Restore Handle */}
          {isFloatingHidden && (
            <Tooltip label="Tampilkan Panel" placement="left" aria-label="Restore Panels">
              <Box
                position="fixed"
                right={0}
                top="50%"
                transform="translateY(-50%)"
                w="6px"
                h="100px"
                bg="blue.500"
                cursor="pointer"
                zIndex={2000}
                borderLeftRadius="full"
                onClick={() => setIsFloatingHidden(false)}
                _hover={{ w: '10px', bg: 'blue.400' }}
                transition="all 0.2s"
              />
            </Tooltip>
          )}
        </>
      )}

      {showNav && <Footer ml={navLayout === 'vertical' ? { lg: '80px' } : 0} />}
    </Box>
  );
}

export default App;
