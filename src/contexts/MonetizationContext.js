import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const MonetizationContext = createContext();

export const useMonetization = () => {
  return useContext(MonetizationContext);
};

export const MonetizationProvider = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState({
    currencies: { coins: 0, tickets: 0, points: 0 },
    tier: { tier_name: 'Free' },
    gamification: { daily_login_streak: 0 },
    customization: { theme: 'default', highlight: false, badge: 'none' }
  });
  const [loading, setLoading] = useState(true);

  const fetchMonetizationData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data: portalData, error } = await supabase.rpc('get_user_portal_data', {
        target_user_id: user.id
      });

      if (error) {
        console.error('Error fetching monetization data:', error);
      } else if (portalData) {
        setData({
          currencies: portalData.currencies || { coins: 0, tickets: 0, points: 0 },
          tier: portalData.tier || { tier_name: 'Free' },
          gamification: portalData.gamification || { daily_login_streak: 0 },
          customization: portalData.customization || { theme: 'default', highlight: false, badge: 'none' }
        });
      }
    } catch (err) {
      console.error('Unexpected error fetching monetization data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonetizationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const refreshData = () => {
    fetchMonetizationData();
  };

  const spendCurrency = async (amount, type, feature) => {
    if (!user) return false;
    try {
      const { data: success, error } = await supabase.rpc('spend_currency', {
        target_user_id: user.id,
        p_amount: amount,
        p_currency_type: type,
        p_feature: feature
      });

      if (error) throw error;

      if (success) {
        await fetchMonetizationData(); // Refresh balance
      }
      return success;
    } catch (err) {
      console.error('Error spending currency:', err);
      return false;
    }
  };

  const value = {
    ...data,
    loading,
    refreshData,
    spendCurrency
  };

  return (
    <MonetizationContext.Provider value={value}>
      {children}
    </MonetizationContext.Provider>
  );
};
