import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useMonetization } from './MonetizationContext';

export const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const { tier, user, isVIP } = useMonetization();
  const [networkType, setNetworkType] = useState('2G');

  // Determine network type
  useEffect(() => {
    if (!user) {
      setNetworkType('3G'); // Anon
      return;
    }

    if (isVIP) {
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

  const handleRequestLag = async () => {
    if (isVIP) return;

    // Delay untuk mensimulasikan lag
    // Anon: anggap 3G (nggak cepet 4G+, nggak lemot bgt 2G -> ~800ms delay)
    // Free: 2G (lemot serasa 2G -> ~2500ms delay)
    const delay = !user ? 800 : 2500;
    await new Promise(resolve => setTimeout(resolve, delay));
  };

  useEffect(() => {
    // 1. Axios Interceptor
    const reqInterceptor = axios.interceptors.request.use(async (config) => {
      try {
        await handleRequestLag();
        return config;
      } catch (err) {
        return Promise.reject(err);
      }
    });

    // 2. Fetch Wrapper (buat nangkep supabase.js & BMKG yg mgkn pakai fetch)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        await handleRequestLag();
      } catch (err) {
        throw err;
      }
      return originalFetch.apply(window, args);
    };

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      window.fetch = originalFetch;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isVIP]);

  return (
    <NetworkContext.Provider value={{ networkType }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
