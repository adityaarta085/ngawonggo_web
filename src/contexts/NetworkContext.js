import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Box, Icon, Text, VStack, Heading } from '@chakra-ui/react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useMonetization } from './MonetizationContext';

export const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const { tier, user, isVIP } = useMonetization();
  const [networkType, setNetworkType] = useState('2G');
  const [isAirplaneMode, setIsAirplaneMode] = useState(false);

  const requestCount = useRef(0);
  const airplaneTimeoutRef = useRef(null);

  // Determine network type
  useEffect(() => {
    if (!user) {
      setNetworkType('3G'); // Anon
      return;
    }

    if (isVIP) {
      // Perintah: VIP BISA DAPAT 5G jika PERANGKAT MENDUKUNG!
      // Kita cek hardware concurrency atau connection type jika tersedia, kalau bagus = 5G, default = 4G+
      const navConn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      let type = '4G+';
      if (navConn && navConn.effectiveType === '4g' && navigator.hardwareConcurrency >= 8) {
        type = '5G';
      }
      setNetworkType(type);
    } else {
      setNetworkType('2G'); // Free Tier
    }
  }, [tier, user, isVIP]);

  // Request Rate Limiter (10 req/min) for Free/Anon
  useEffect(() => {
    // Reset limit tiap menit
    const interval = setInterval(() => {
      requestCount.current = 0;
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleRequest = async (url) => {
    // VIP bebas
    if (isVIP) return;

    // Tambah request count
    requestCount.current += 1;

    // Limit cek
    if (requestCount.current > 10) {
      setIsAirplaneMode(true);

      // Auto off airplane mode setelah 1 menit kena limit (opsional, tp biar ga mentok terus)
      if (airplaneTimeoutRef.current) clearTimeout(airplaneTimeoutRef.current);
      airplaneTimeoutRef.current = setTimeout(() => {
        setIsAirplaneMode(false);
        requestCount.current = 0;
      }, 60000);

      throw new Error('AIRPLANE_MODE_LIMIT_REACHED');
    }

    // Delay untuk mensimulasikan lag
    // Anon: anggap 3G (nggak cepet 4G+, nggak lemot bgt 2G -> ~800ms delay)
    // Free: 2G (lemot serasa 2G -> ~2500ms delay)
    const delay = !user ? 800 : 2500;
    await new Promise(resolve => setTimeout(resolve, delay));
  };

  useEffect(() => {
    // 1. Axios Interceptor
    const reqInterceptor = axios.interceptors.request.use(async (config) => {
      // Jangan limit call supabase di interceptor ini karena supabase js pakai fetch,
      // tapi jaga2 kl ada axios req
      if (isAirplaneMode) {
        return Promise.reject(new Error('AIRPLANE_MODE_LIMIT_REACHED'));
      }
      try {
        await handleRequest(config.url);
        return config;
      } catch (err) {
        return Promise.reject(err);
      }
    });

    // 2. Fetch Wrapper (buat nangkep supabase.js & BMKG yg mgkn pakai fetch)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      if (isAirplaneMode) {
        throw new Error('AIRPLANE_MODE_LIMIT_REACHED');
      }

      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;

      try {
        await handleRequest(url);
      } catch (err) {
        throw err;
      }

      return originalFetch.apply(window, args);
    };

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      window.fetch = originalFetch;
    };
  }, [user, isVIP, isAirplaneMode]);

  return (
    <NetworkContext.Provider value={{ networkType, isAirplaneMode }}>
      {children}
      {/* Airplane Mode Overlay */}
      {isAirplaneMode && !isVIP && (
        <Box
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          bg="rgba(0, 0, 0, 0.85)"
          zIndex={99999}
          display="flex"
          alignItems="center"
          justifyContent="center"
          backdropFilter="blur(5px)"
        >
          <VStack spacing={6} p={8} bg="white" _dark={{ bg: "gray.800" }} borderRadius="2xl" textAlign="center" boxShadow="2xl">
            <Icon as={FaExclamationTriangle} w={20} h={20} color="red.500" />
            <Heading size="lg" color="red.500">Mode Pesawat Aktif</Heading>
            <Text fontSize="md" fontWeight="bold">
              Anda telah mencapai batas 10 request per menit.
            </Text>
            <Text fontSize="sm" color="gray.500">
              Sistem membatasi akses berlebih untuk pengguna gratis/anonim. Silakan tunggu 1 menit untuk melanjutkan atau tingkatkan akun ke VIP untuk akses tanpa batas.
            </Text>
          </VStack>
        </Box>
      )}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
