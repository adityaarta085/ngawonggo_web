import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '@chakra-ui/react';

export const MonetizationContext = createContext();

export const MonetizationProvider = ({ children }) => {
  const [currency, setCurrency] = useState({ coins: 0, tickets: 0, points: 0 });
  const [tier, setTier] = useState({ name: 'Free', expires_at: null });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchMonetizationData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch currency
        const { data: currencyData } = await supabase
          .from('user_currencies')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (currencyData) {
          setCurrency({
            coins: currencyData.coins,
            tickets: currencyData.tickets,
            points: currencyData.points,
          });
        }

        // Fetch tier
        const { data: tierData } = await supabase
          .from('user_tiers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (tierData) {
          setTier({
            name: tierData.tier_name,
            expires_at: tierData.tier_expires_at,
          });
        }
      }
      setIsLoading(false);
    };

    fetchMonetizationData();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
             fetchMonetizationData();
        } else {
            setUser(null);
            setCurrency({ coins: 0, tickets: 0, points: 0 });
            setTier({ name: 'Free', expires_at: null });
        }
    });

    return () => subscription.unsubscribe();

  }, []);

  const deductCurrency = async (amount, type = 'coins', featureName = 'Unknown') => {
      if (!user) return false;
      if (currency[type] < amount) {
           toast({
               title: `Saldo ${type} tidak cukup`,
               description: `Anda butuh ${amount} ${type} untuk menggunakan fitur ini.`,
               status: 'warning',
               duration: 3000,
           });
           return false;
      }

      try {
           const { data, error } = await supabase.rpc('deduct_user_currency', {
               p_user_id: user.id,
               p_amount: amount,
               p_currency_type: type
           });

           if (error) throw error;

           if (data === true) {
               // Update local state optimistically
               setCurrency(prev => ({ ...prev, [type]: prev[type] - amount }));
               return true;
           }
           return false;
      } catch (err) {
          console.error("Deduct error:", err);
          return false;
      }
  };

  const checkFeatureLimit = async (featureName, limit, windowDays = 1) => {
      if (!user) return { allowed: false };
      if (tier.name === 'VIP' || tier.name === 'Subscription') return { allowed: true }; // Unlimited for VIP/Sub

      try {
           const { data: allowed, error } = await supabase.rpc('check_and_increment_usage', {
               p_user_id: user.id,
               p_feature_name: featureName,
               p_limit: limit,
               p_window_days: windowDays
           });

           if (error) throw error;
           return { allowed };

      } catch (err) {
          console.error("Limit check error:", err);
          return { allowed: false };
      }
  };

  const isVIP = tier.name === 'VIP';
  const isSubscription = tier.name === 'Subscription' || tier.name === 'VIP';

  return (
    <MonetizationContext.Provider value={{
      currency,
      tier,
      isLoading,
      isVIP,
      isSubscription,
      deductCurrency,
      checkFeatureLimit
    }}>
      {children}
    </MonetizationContext.Provider>
  );
};

export const useMonetization = () => useContext(MonetizationContext);
