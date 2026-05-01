import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '@chakra-ui/react';

export const MonetizationContext = createContext();

export const MonetizationProvider = ({ children }) => {
  const [currency, setCurrency] = useState({ coins: 0 });
  const [gachaStats, setGachaStats] = useState({ total_pulls: 0, vip_cards: 0, canClaimDaily: false });
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

        // Fetch Gacha Stats
        const { data: gData } = await supabase.from('user_gacha_stats').select('*').eq('user_id', user.id).single();
        if (gData) {
            const today = new Date().toISOString().split('T')[0];
            setGachaStats({
                total_pulls: gData.total_pulls || 0,
                vip_cards: gData.vip_cards || 0,
                canClaimDaily: gData.last_login_claim !== today
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

  const claimDailyLogin = async () => {
      if (!user || !gachaStats.canClaimDaily) return false;
      const { data } = await supabase.rpc('claim_daily_login', { p_user_id: user.id });
      if (data) {
          setCurrency(prev => ({ coins: prev.coins + 10 }));
          setGachaStats(prev => ({ ...prev, canClaimDaily: false }));
          toast({ title: 'Daily Login Berhasil', description: '+10 Koin gratis!', status: 'success' });
          return true;
      }
      return false;
  };

  const rollGacha = async () => {
      if (!user || currency.coins < 10) {
          toast({ title: 'Koin tidak cukup', status: 'warning' });
          return null;
      }
      const { data } = await supabase.rpc('roll_gacha', { p_user_id: user.id });
      if (data && data.success) {
          setCurrency(prev => ({ coins: prev.coins - 10 }));
          if (data.won) {
              setGachaStats(prev => ({ ...prev, total_pulls: 0, vip_cards: prev.vip_cards + 1 }));
              toast({ title: 'SELAMAT! Anda mendapatkan VIP Card!', status: 'success', duration: 5000 });
          } else {
              setGachaStats(prev => ({ ...prev, total_pulls: data.pulls }));
          }
          return data;
      }
      return null;
  };

  const activateVipCard = async () => {
      if (!user || gachaStats.vip_cards < 1) return false;
      const { data } = await supabase.rpc('activate_vip_card', { p_user_id: user.id });
      if (data) {
          setGachaStats(prev => ({ ...prev, vip_cards: prev.vip_cards - 1 }));
          setTier({ name: 'VIP', expires_at: null });
          toast({ title: 'VIP Card Diaktifkan!', description: 'Anda sekarang adalah member VIP.', status: 'success' });
          return true;
      }
      return false;
  };

  const purchaseVipDirect = async () => {
      if (!user || currency.coins < 500) {
          toast({ title: 'Koin tidak cukup', description: 'Butuh 500 Koin', status: 'warning' });
          return false;
      }
      const { data } = await supabase.rpc('purchase_vip_direct', { p_user_id: user.id });
      if (data) {
          setCurrency(prev => ({ coins: prev.coins - 500 }));
          setTier({ name: 'VIP', expires_at: null });
          toast({ title: 'VIP Dibeli!', description: 'Anda sekarang adalah member VIP.', status: 'success' });
          return true;
      }
      return false;
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
      checkFeatureLimit,
      gachaStats,
      claimDailyLogin,
      rollGacha,
      activateVipCard,
      purchaseVipDirect
    }}>
      {children}
    </MonetizationContext.Provider>
  );
};

export const useMonetization = () => useContext(MonetizationContext);
