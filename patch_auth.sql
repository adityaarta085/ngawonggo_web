-- Drop the trigger first
DROP TRIGGER IF EXISTS on_auth_user_created_monetization ON auth.users;

-- Recreate the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user_monetization()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into currencies
  INSERT INTO public.user_currencies (user_id, coins, tickets, points)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  -- Insert into tiers (default Free)
  INSERT INTO public.user_tiers (user_id, tier_name)
  VALUES (NEW.id, 'Free')
  ON CONFLICT (user_id) DO NOTHING;

  -- Insert into gamification
  INSERT INTO public.user_gamification (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Insert into profile customization
  INSERT INTO public.user_profile_customizations (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created_monetization
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_monetization();

-- Insert dummy data into existing users
INSERT INTO public.user_currencies (user_id, coins, tickets, points)
SELECT id, 0, 0, 0 FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_tiers (user_id, tier_name)
SELECT id, 'Free' FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_gamification (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.user_profile_customizations (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
