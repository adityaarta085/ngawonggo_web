const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/contexts/MonetizationContext.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove points/tickets references and initialize stats
content = content.replace(
    "const [currency, setCurrency] = useState({ coins: 0, tickets: 0, points: 0 });",
    "const [currency, setCurrency] = useState({ coins: 0 });\n  const [gachaStats, setGachaStats] = useState({ total_pulls: 0, vip_cards: 0, canClaimDaily: false });"
);

// 2. Fetch Gacha Stats
const fetchSearch = `        if (tierData) {
          setTier({
            name: tierData.tier_name,
            expires_at: tierData.tier_expires_at,
          });
        }`;

const fetchReplace = `        if (tierData) {
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
        }`;

content = content.replace(fetchSearch, fetchReplace);

// 3. Update Currency Fetch (Only select coins for state)
content = content.replace(
    `          setCurrency({
            coins: currencyData.coins,
            tickets: currencyData.tickets,
            points: currencyData.points,
          });`,
    `          setCurrency({
            coins: currencyData.coins,
          });`
);

// 4. Add new RPC functions
const addRpcSearch = `  const isVIP = tier.name === 'VIP';`;

const addRpcReplace = `  const claimDailyLogin = async () => {
      if (!user || !gachaStats.canClaimDaily) return false;
      const { data, error } = await supabase.rpc('claim_daily_login', { p_user_id: user.id });
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
      const { data, error } = await supabase.rpc('roll_gacha', { p_user_id: user.id });
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

  const isVIP = tier.name === 'VIP';`;

content = content.replace(addRpcSearch, addRpcReplace);

// 5. Expose the functions in the provider
content = content.replace(
    `      isSubscription,\n      deductCurrency,\n      checkFeatureLimit\n    }}>\n      {children}\n    </MonetizationContext.Provider>`,
    `      isSubscription,\n      deductCurrency,\n      checkFeatureLimit,\n      gachaStats,\n      claimDailyLogin,\n      rollGacha,\n      activateVipCard,\n      purchaseVipDirect\n    }}>\n      {children}\n    </MonetizationContext.Provider>`
);

fs.writeFileSync(filePath, content);
console.log('MonetizationContext patched.');
