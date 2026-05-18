-- 1. Modify Starter Coins Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user_monetization()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_currencies (user_id, coins)
  VALUES (new.id, 50); -- 50 free coins

  INSERT INTO public.user_tiers (user_id, tier_name)
  VALUES (new.id, 'Free');

  INSERT INTO public.user_gacha_stats (user_id, total_pulls, vip_cards)
  VALUES (new.id, 0, 0);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created_monetization ON auth.users;
CREATE TRIGGER on_auth_user_created_monetization
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_monetization();

-- 2. Gacha Stats Table
CREATE TABLE IF NOT EXISTS public.user_gacha_stats (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  total_pulls INTEGER DEFAULT 0,
  vip_cards INTEGER DEFAULT 0,
  last_login_claim DATE
);

-- Initialize existing users into gacha_stats
INSERT INTO public.user_gacha_stats (user_id)
SELECT id FROM auth.users ON CONFLICT DO NOTHING;

-- 3. Daily Login Claim RPC
CREATE OR REPLACE FUNCTION claim_daily_login(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_last_claim DATE;
BEGIN
    SELECT last_login_claim INTO v_last_claim FROM user_gacha_stats WHERE user_id = p_user_id FOR UPDATE;

    IF v_last_claim = CURRENT_DATE THEN
        RETURN FALSE; -- Already claimed today
    END IF;

    -- Give 10 coins
    UPDATE user_currencies SET coins = coins + 10 WHERE user_id = p_user_id;
    UPDATE user_gacha_stats SET last_login_claim = CURRENT_DATE WHERE user_id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Roll Gacha RPC
CREATE OR REPLACE FUNCTION roll_gacha(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_coins INTEGER;
    v_pulls INTEGER;
    v_won BOOLEAN := FALSE;
    v_chance NUMERIC;
BEGIN
    -- Check coins
    SELECT coins INTO v_coins FROM user_currencies WHERE user_id = p_user_id FOR UPDATE;
    IF v_coins < 10 THEN
        RETURN jsonb_build_object('success', false, 'message', 'Koin tidak cukup');
    END IF;

    -- Deduct coins
    UPDATE user_currencies SET coins = coins - 10 WHERE user_id = p_user_id;

    -- Increment pulls
    UPDATE user_gacha_stats SET total_pulls = total_pulls + 1 WHERE user_id = p_user_id RETURNING total_pulls INTO v_pulls;

    -- Gacha Logic
    IF v_pulls = 75 THEN
        v_won := TRUE; -- Pity 75
    ELSIF v_pulls >= 30 THEN
        -- 2.5% chance
        v_chance := random();
        IF v_chance <= 0.025 THEN
            v_won := TRUE;
        END IF;
    END IF;

    IF v_won THEN
        UPDATE user_gacha_stats SET vip_cards = vip_cards + 1, total_pulls = 0 WHERE user_id = p_user_id; -- reset pity
        RETURN jsonb_build_object('success', true, 'won', true, 'message', 'SELAMAT! Anda mendapatkan VIP Card!');
    ELSE
        RETURN jsonb_build_object('success', true, 'won', false, 'message', 'Coba lagi!', 'pulls', v_pulls);
    END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Activate VIP Card RPC
CREATE OR REPLACE FUNCTION activate_vip_card(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_cards INTEGER;
BEGIN
    SELECT vip_cards INTO v_cards FROM user_gacha_stats WHERE user_id = p_user_id FOR UPDATE;
    IF v_cards > 0 THEN
        UPDATE user_gacha_stats SET vip_cards = vip_cards - 1 WHERE user_id = p_user_id;
        UPDATE user_tiers
        SET tier_name = 'VIP', tier_expires_at = NOW() + INTERVAL '1 month'
        WHERE user_id = p_user_id;
        RETURN TRUE;
    END IF;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Purchase VIP Direct RPC
CREATE OR REPLACE FUNCTION purchase_vip_direct(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_coins INTEGER;
BEGIN
    SELECT coins INTO v_coins FROM user_currencies WHERE user_id = p_user_id FOR UPDATE;
    IF v_coins >= 500 THEN
        UPDATE user_currencies SET coins = coins - 500 WHERE user_id = p_user_id;
        UPDATE user_tiers
        SET tier_name = 'VIP', tier_expires_at = NOW() + INTERVAL '1 month'
        WHERE user_id = p_user_id;
        RETURN TRUE;
    END IF;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Get Leaderboard View (Virtual Table)
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
    au.email,
    au.raw_user_meta_data->>'full_name' as name,
    ut.tier_name,
    uc.coins
FROM auth.users au
JOIN user_tiers ut ON au.id = ut.user_id
JOIN user_currencies uc ON au.id = uc.user_id
WHERE ut.tier_name = 'VIP' OR uc.coins > 0
ORDER BY uc.coins DESC NULLS LAST
LIMIT 20;
