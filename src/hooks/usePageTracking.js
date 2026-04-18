import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const logPageView = async () => {
      // Don't track admin pages for visitor stats
      if (location.pathname.startsWith('/admin')) return;

      try {
        await supabase.from('page_views').insert([
          {
            page_path: location.pathname,
            visitor_id: localStorage.getItem('visitor_id') || generateVisitorId()
          }
        ]);
      } catch (error) {
        console.error('Error logging page view:', error);
      }
    };

    logPageView();
  }, [location]);
};

const generateVisitorId = () => {
  const id = Math.random().toString(36).substring(2, 15);
  localStorage.setItem('visitor_id', id);
  return id;
};

export default usePageTracking;
