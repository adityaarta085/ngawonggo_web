import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getById } from '../lib/dataFetcher';
import { useToast } from '@chakra-ui/react';

export const MonetizationContext = createContext();

export const MonetizationProvider = ({ children }) => {
  const [currency, setCurrency] = useState({ coins: 0 });
  const [gachaStats, setGachaStats] = useState({ total_pulls: 0, vip_cards: 0, canClaimDaily: false });
  const [tier, setTier] = useState({ name: 'Free', expires_at: null });
  const [settings, setSettings] = useState({
    monetization_enabled: true,
    badge_vip_price: 500,
    fast_track_price: 50,
    theme_premium_price: 100,
    tafsir_ai_price: 10,
    ai_free_daily_limit: 3,
    quran_free_daily_limit: 5,
    layanan_free_limit_days: 1,
    layanan_free_limit_count: 1,
    layanan_vip_limit_days: 3,
    layanan_vip_limit_count: 3,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const toast = useToast();

  const fetchSiteSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .in('key', [
          'monetization_enabled',
          'badge_vip_price',
          'fast_track_price',
          'theme_premium_price',
          'tafsir_ai_price',
          'ai_free_daily_limit',
          'quran_free_daily_limit',
          'layanan_free_limit_days',
          'layanan_free_limit_count',
          'layanan_vip_limit_days',
          'layanan_vip_limit_count',
        ]);

      if (data) {
        const parsed = {};
        data.forEach(item => {
          if (item.key === 'monetization_enabled') {
            parsed[item.key] = item.value !== 'false';
          } else {
            const num = parseInt(item.value, 10);
            parsed[item.key] = isNaN(num) ? item.value : num;
          }
        });
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn('Error fetching monetization site_settings:', e);
    }
  };

  useEffect(() => {
    fetchSiteSettings();

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
        const { data: gData } = await getById('user_gacha_stats', user.id);
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
               description: `Anda butuh ${amount} ${type} untuk menggunakan fitur ${featureName !== 'Unknown' ? featureName : 'ini'}.`,
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
      if (!settings.monetization_enabled) return { allowed: true }; // Unlimited if monetization disabled
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
          toast({ title: 'Koin tidak cukup', description: 'Butuh 10 Koin untuk 1x Gacha', status: 'warning' });
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
          fetch('/api/telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `<b>User Sudah Upgrade VIP! (Via Card)</b>\n\n<b>User:</b> ${user.email}\n\n<a href="https://ngawonggo.web.id/admin">Lihat Detail di Admin Panel</a>` })
          }).catch(err => console.error("Telegram error:", err));

          return true;
      }
      return false;
  };

  const giftVipCard = async (receiverEmail) => {
      if (!user || gachaStats.vip_cards < 1) return false;
      const { data } = await supabase.rpc("gift_vip_card", { p_sender_id: user.id, p_receiver_email: receiverEmail });
      if (data) {
          setGachaStats(prev => ({ ...prev, vip_cards: prev.vip_cards - 1 }));
          toast({ title: "Berhasil!", description: "VIP Card berhasil dikirim ke " + receiverEmail, status: "success" });
          return true;
      }
      toast({ title: "Gagal", description: "Email tidak ditemukan atau error.", status: "error" });
      return false;
  };

  const purchaseVipDirect = async () => {
      const price = settings.badge_vip_price || 500;
      if (!user || currency.coins < price) {
          toast({ title: "Koin tidak cukup", description: `Butuh ${price} Koin untuk VIP Card`, status: "warning" });
          return false;
      }
      const { data } = await supabase.rpc("purchase_vip_card", { p_user_id: user.id });
      if (data) {
          setCurrency(prev => ({ coins: prev.coins - price }));
          setGachaStats(prev => ({ ...prev, vip_cards: prev.vip_cards + 1 }));
          toast({ title: "Berhasil!", description: "VIP Card berhasil ditambahkan ke tas Anda.", status: "success" });
          return true;
      }
      return false;
  };

  const isVIP = tier.name === 'VIP';
  const isSubscription = tier.name === 'Subscription' || tier.name === 'VIP';

  return (
    <MonetizationContext.Provider value={{
      user,
      currency,
      tier,
      settings,
      isLoading,
      isVIP,
      isSubscription,
      deductCurrency,
      checkFeatureLimit,
      gachaStats,
      claimDailyLogin,
      rollGacha,
      activateVipCard,
      purchaseVipDirect,
      giftVipCard,
      fetchSiteSettings
    }}>
      {children}
    </MonetizationContext.Provider>
  );
};

export const useMonetization = () => useContext(MonetizationContext);
