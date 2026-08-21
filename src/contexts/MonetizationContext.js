import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getById } from '../lib/dataFetcher';
import { useToast } from '@chakra-ui/react';

export const MonetizationContext = createContext();

export const MonetizationProvider = ({ children }) => {
  const [currency, setCurrency] = useState({ coins: 0, tickets: 0, points: 0 });
  const [gachaStats, setGachaStats] = useState({ total_pulls: 0, vip_cards: 0, canClaimDaily: false });
  const [spinStats, setSpinStats] = useState({ canFreeSpin: false, total_spins: 0 });
  const [tier, setTier] = useState({ name: 'Free', expires_at: null });
  const [settings, setSettings] = useState({
    monetization_enabled: true,
    badge_vip_price: 500,
    fast_track_price: 50,
    theme_premium_price: 100,
    tafsir_ai_price: 5,
    ai_free_daily_limit: 5,
    ai_chat_coin_price: 2,
    ai_image_free_daily_limit: 2,
    ai_image_coin_price: 5,
    quran_free_daily_limit: 5,
    downloader_free_daily_limit: 5,
    downloader_coin_price: 2,
    plagiat_free_daily_limit: 3,
    plagiat_coin_price: 5,
    layanan_free_limit_days: 3,
    layanan_free_limit_count: 1,
    layanan_vip_limit_days: 3,
    layanan_vip_limit_count: 3,
    daily_login_reward: 10,
    spin_cost_coins: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const toast = useToast();

  const fetchSiteSettings = useCallback(async () => {
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
          'ai_chat_coin_price',
          'ai_image_free_daily_limit',
          'ai_image_coin_price',
          'quran_free_daily_limit',
          'downloader_free_daily_limit',
          'downloader_coin_price',
          'plagiat_free_daily_limit',
          'plagiat_coin_price',
          'layanan_free_limit_days',
          'layanan_free_limit_count',
          'layanan_vip_limit_days',
          'layanan_vip_limit_count',
          'daily_login_reward',
          'spin_cost_coins',
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
  }, []);

  const fetchMonetizationData = useCallback(async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        // Fetch currency
        const { data: currencyData } = await supabase
          .from('user_currencies')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (currencyData) {
          setCurrency({
            coins: currencyData.coins || 0,
            tickets: currencyData.tickets || 0,
            points: currencyData.points || 0,
          });
        }

        // Fetch tier
        const { data: tierData } = await supabase
          .from('user_tiers')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (tierData) {
          const isExpired = tierData.tier_expires_at && new Date(tierData.tier_expires_at) < new Date();
          setTier({
            name: isExpired ? 'Free' : (tierData.tier_name || 'Free'),
            expires_at: tierData.tier_expires_at,
          });
        }

        // Fetch Gacha Stats
        const { data: gData } = await getById('user_gacha_stats', authUser.id);
        const today = new Date().toISOString().split('T')[0];
        if (gData) {
          setGachaStats({
            total_pulls: gData.total_pulls || 0,
            vip_cards: gData.vip_cards || 0,
            canClaimDaily: gData.last_login_claim !== today,
          });
        }

        // Fetch Spin Stats
        const { data: spinData } = await supabase
          .from('user_spin_stats')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (spinData) {
          setSpinStats({
            canFreeSpin: spinData.last_free_spin !== today,
            total_spins: spinData.total_spins || 0,
          });
        } else {
          setSpinStats({ canFreeSpin: true, total_spins: 0 });
        }
      }
    } catch (err) {
      console.warn('Error fetching monetization data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteSettings();
    fetchMonetizationData();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchMonetizationData();
      } else {
        setUser(null);
        setCurrency({ coins: 0, tickets: 0, points: 0 });
        setTier({ name: 'Free', expires_at: null });
        setGachaStats({ total_pulls: 0, vip_cards: 0, canClaimDaily: false });
        setSpinStats({ canFreeSpin: false, total_spins: 0 });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchSiteSettings, fetchMonetizationData]);

  // Compute VIP active status
  const isVIP = (tier.name === 'VIP' || tier.name === 'Subscription') && (!tier.expires_at || new Date(tier.expires_at) > new Date());
  const isSubscription = isVIP;

  // Deduct currency with detailed logging
  const deductCurrency = async (amount, type = 'coins', featureName = 'Feature Usage') => {
    if (!user) {
      toast({
        title: 'Silakan Login',
        description: 'Anda harus masuk untuk menggunakan fitur koin.',
        status: 'warning',
        duration: 3000,
      });
      return false;
    }

    if ((currency[type] || 0) < amount) {
      toast({
        title: `Saldo ${type} tidak cukup`,
        description: `Anda butuh ${amount} ${type} untuk ${featureName}. Saldo Anda: ${currency[type] || 0} ${type}.`,
        status: 'warning',
        duration: 4000,
      });
      return false;
    }

    try {
      const { data, error } = await supabase.rpc('deduct_user_currency', {
        p_user_id: user.id,
        p_amount: amount,
        p_currency_type: type,
        p_feature_name: featureName,
      });

      if (error) throw error;

      if (data === true) {
        setCurrency(prev => ({ ...prev, [type]: Math.max(0, (prev[type] || 0) - amount) }));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Deduct error:', err);
      return false;
    }
  };

  // Read-only quota check for badges & headers without incrementing
  const getFeatureQuota = async (featureName, defaultLimit = 5, windowDays = 1) => {
    if (!settings.monetization_enabled) {
      return { allowed: true, is_vip: false, used: 0, limit: 9999, remaining: 9999, monetization_enabled: false };
    }
    if (!user) {
      return { allowed: false, is_vip: false, used: 0, limit: defaultLimit, remaining: defaultLimit, monetization_enabled: true };
    }
    if (isVIP) {
      return { allowed: true, is_vip: true, used: 0, limit: 9999, remaining: 9999, monetization_enabled: true };
    }

    try {
      const { data, error } = await supabase.rpc('get_feature_quota', {
        p_user_id: user.id,
        p_feature_name: featureName,
        p_limit: defaultLimit,
        p_window_days: windowDays,
      });

      if (error) throw error;
      return data || { allowed: true, is_vip: false, used: 0, limit: defaultLimit, remaining: defaultLimit, monetization_enabled: true };
    } catch (err) {
      console.error('getFeatureQuota error:', err);
      return { allowed: true, is_vip: false, used: 0, limit: defaultLimit, remaining: defaultLimit, monetization_enabled: true };
    }
  };

  // Atomic Consume Quota or Coins
  const consumeFeatureOrCoins = async (featureName, defaultLimit = 5, windowDays = 1, coinCost = 0, actionName = 'Feature Usage') => {
    if (!settings.monetization_enabled) {
      return { success: true, method: 'free_unlimited' };
    }
    if (!user) {
      return { success: false, error: 'unauthenticated', message: 'Silakan login terlebih dahulu.' };
    }
    if (isVIP) {
      return { success: true, method: 'vip_pass' };
    }

    try {
      const { data, error } = await supabase.rpc('consume_feature_quota_or_coins', {
        p_user_id: user.id,
        p_feature_name: featureName,
        p_free_limit: defaultLimit,
        p_window_days: windowDays,
        p_coin_cost: coinCost,
        p_action_name: actionName,
      });

      if (error) throw error;

      if (data && data.success) {
        if (data.method === 'coins_spent') {
          setCurrency(prev => ({ ...prev, coins: data.remaining_coins }));
        }
        return data;
      }
      return data || { success: false, error: 'unknown_error' };
    } catch (err) {
      console.error('consumeFeatureOrCoins error:', err);
      return { success: false, error: err.message };
    }
  };

  // Backward-compatible checkFeatureLimit
  const checkFeatureLimit = async (featureName, limit = 5, windowDays = 1) => {
    if (!user) return { allowed: false };
    if (!settings.monetization_enabled) return { allowed: true };
    if (isVIP) return { allowed: true };

    try {
      const { data: allowed, error } = await supabase.rpc('check_and_increment_usage', {
        p_user_id: user.id,
        p_feature_name: featureName,
        p_limit: limit,
        p_window_days: windowDays,
      });

      if (error) throw error;
      return { allowed: Boolean(allowed) };
    } catch (err) {
      console.error('Limit check error:', err);
      return { allowed: false };
    }
  };

  // Spin Lucky Wheel
  const spinLuckyWheel = async () => {
    if (!user) {
      toast({ title: 'Silakan Login', description: 'Login untuk memutar roda keberuntungan.', status: 'warning' });
      return null;
    }

    const spinCost = settings.spin_cost_coins || 10;
    if (!spinStats.canFreeSpin && currency.coins < spinCost) {
      toast({
        title: 'Koin Tidak Cukup',
        description: `Butuh ${spinCost} Koin untuk memutar roda keberuntungan.`,
        status: 'warning',
      });
      return null;
    }

    try {
      const { data, error } = await supabase.rpc('spin_lucky_wheel', { p_user_id: user.id });
      if (error) throw error;

      if (data && data.success) {
        setCurrency(prev => ({ ...prev, coins: data.new_coins }));
        setSpinStats(prev => ({ canFreeSpin: false, total_spins: prev.total_spins + 1 }));
        if (data.prize_type === 'vip_card') {
          setGachaStats(prev => ({ ...prev, vip_cards: prev.vip_cards + 1 }));
        }
        return data;
      } else {
        toast({ title: 'Gagal Memutar Roda', description: data?.message || 'Terjadi kesalahan.', status: 'error' });
        return null;
      }
    } catch (err) {
      console.error('Spin wheel error:', err);
      toast({ title: 'Error', description: err.message, status: 'error' });
      return null;
    }
  };

  // Claim Daily Login
  const claimDailyLogin = async () => {
    if (!user || !gachaStats.canClaimDaily) return false;
    const reward = settings.daily_login_reward || 10;
    try {
      const { data, error } = await supabase.rpc('claim_daily_login', { p_user_id: user.id });
      if (error) throw error;

      if (data) {
        setCurrency(prev => ({ ...prev, coins: prev.coins + reward }));
        setGachaStats(prev => ({ ...prev, canClaimDaily: false }));
        toast({ title: 'Daily Login Berhasil', description: `+${reward} Koin gratis hari ini!`, status: 'success' });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Claim daily error:', err);
      return false;
    }
  };

  // Roll Gacha Lucky Box
  const rollGacha = async () => {
    if (!user || currency.coins < 10) {
      toast({ title: 'Koin tidak cukup', description: 'Butuh 10 Koin untuk 1x Gacha', status: 'warning' });
      return null;
    }
    try {
      const { data, error } = await supabase.rpc('roll_gacha', { p_user_id: user.id });
      if (error) throw error;

      if (data && data.success) {
        setCurrency(prev => ({ ...prev, coins: Math.max(0, prev.coins - 10) }));
        if (data.won) {
          setGachaStats(prev => ({ ...prev, total_pulls: 0, vip_cards: prev.vip_cards + 1 }));
          toast({ title: 'SELAMAT! Anda mendapatkan VIP Card!', status: 'success', duration: 5000 });
        } else {
          setGachaStats(prev => ({ ...prev, total_pulls: data.pulls }));
        }
        return data;
      }
      return null;
    } catch (err) {
      console.error('Roll gacha error:', err);
      return null;
    }
  };

  // Activate VIP Card from backpack
  const activateVipCard = async () => {
    if (!user || gachaStats.vip_cards < 1) return false;
    try {
      const { data, error } = await supabase.rpc('activate_vip_card', { p_user_id: user.id });
      if (error) throw error;

      if (data) {
        setGachaStats(prev => ({ ...prev, vip_cards: Math.max(0, prev.vip_cards - 1) }));
        const oneMonthLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        setTier({ name: 'VIP', expires_at: oneMonthLater });

        toast({ title: 'VIP Card Diaktifkan!', description: 'Selamat! Anda sekarang adalah member VIP aktif selama 30 hari.', status: 'success' });
        fetch('/api/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `<b>User Upgrade VIP! (Via Card)</b>\n\n<b>User:</b> ${user.email}\n\n<a href="https://ngawonggo.web.id/admin">Lihat Detail di Admin Panel</a>` })
        }).catch(err => console.error("Telegram error:", err));

        return true;
      }
      return false;
    } catch (err) {
      console.error('Activate VIP error:', err);
      return false;
    }
  };

  // Gift VIP Card to another user
  const giftVipCard = async (receiverEmail) => {
    if (!user || gachaStats.vip_cards < 1) return false;
    try {
      const { data, error } = await supabase.rpc("gift_vip_card", { p_sender_id: user.id, p_receiver_email: receiverEmail });
      if (error) throw error;

      if (data) {
        setGachaStats(prev => ({ ...prev, vip_cards: Math.max(0, prev.vip_cards - 1) }));
        toast({ title: "Berhasil!", description: "VIP Card berhasil dikirim ke " + receiverEmail, status: "success" });
        return true;
      }
      toast({ title: "Gagal", description: "Email tidak ditemukan atau error.", status: "error" });
      return false;
    } catch (err) {
      toast({ title: "Gagal Mengirim", description: err.message, status: "error" });
      return false;
    }
  };

  // Purchase VIP Card directly with coins
  const purchaseVipDirect = async () => {
    const price = settings.badge_vip_price || 500;
    if (!user || currency.coins < price) {
      toast({ title: "Koin tidak cukup", description: `Butuh ${price} Koin untuk VIP Card`, status: "warning" });
      return false;
    }
    try {
      const { data, error } = await supabase.rpc("purchase_vip_card", { p_user_id: user.id });
      if (error) throw error;

      if (data) {
        setCurrency(prev => ({ ...prev, coins: Math.max(0, prev.coins - price) }));
        setGachaStats(prev => ({ ...prev, vip_cards: prev.vip_cards + 1 }));
        toast({ title: "Berhasil!", description: "VIP Card berhasil ditambahkan ke tas Anda.", status: "success" });
        return true;
      }
      return false;
    } catch (err) {
      toast({ title: "Gagal Membeli", description: err.message, status: "error" });
      return false;
    }
  };

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
      getFeatureQuota,
      consumeFeatureOrCoins,
      checkFeatureLimit,
      gachaStats,
      spinStats,
      spinLuckyWheel,
      claimDailyLogin,
      rollGacha,
      activateVipCard,
      purchaseVipDirect,
      giftVipCard,
      fetchSiteSettings,
      fetchMonetizationData,
    }}>
      {children}
    </MonetizationContext.Provider>
  );
};

export const useMonetization = () => useContext(MonetizationContext);
