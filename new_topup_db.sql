-- Check user by email safely
CREATE OR REPLACE FUNCTION check_user_by_email(p_email TEXT)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_name TEXT;
BEGIN
    SELECT id, raw_user_meta_data->>'full_name' INTO v_user_id, v_name
    FROM auth.users
    WHERE email = p_email
    LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        RETURN jsonb_build_object('success', true, 'id', v_user_id, 'name', COALESCE(v_name, split_part(p_email, '@', 1)));
    END IF;

    RETURN jsonb_build_object('success', false, 'message', 'Email tidak ditemukan di sistem.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Secure coin grant after payment
CREATE OR REPLACE FUNCTION process_topup_success(p_user_id UUID, p_coins INTEGER, p_trx_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_exists BOOLEAN;
BEGIN
    -- Prevent double spending using transaction table
    SELECT EXISTS(SELECT 1 FROM transactions WHERE id::text = p_trx_id) INTO v_exists;
    IF v_exists THEN
        RETURN FALSE;
    END IF;

    -- Grant coins
    UPDATE user_currencies SET coins = coins + p_coins WHERE user_id = p_user_id;

    -- Record transaction
    INSERT INTO transactions (id, user_id, amount, currency_type, quantity, status)
    VALUES (extensions.uuid_generate_v4(), p_user_id, 0, 'coins', p_coins, 'SUCCESS');

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
