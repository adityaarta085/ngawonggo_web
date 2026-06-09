-- Create Prisma-equivalent schema in Supabase Postgres
CREATE TABLE IF NOT EXISTS display_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS display_mosques (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS displays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mosque_id UUID REFERENCES display_mosques(id),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'offline',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS display_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  media_url TEXT,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS display_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  speaker TEXT,
  time TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS display_livestreams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode TEXT NOT NULL,
  url TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS display_prayer_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prayer TEXT UNIQUE NOT NULL,
  iqomah_delay INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS display_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_id UUID UNIQUE REFERENCES displays(id),
  mode TEXT DEFAULT 'normal',
  message TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Dummy Seed Data
INSERT INTO display_users (email, role) VALUES ('admin@ngawonggo.com', 'admin') ON CONFLICT DO NOTHING;
INSERT INTO display_mosques (name) VALUES ('Masjid Ngawonggo') ON CONFLICT DO NOTHING;

-- Insert a demo display if none exists
DO $$
DECLARE
  m_id UUID;
  d_id UUID;
BEGIN
  SELECT id INTO m_id FROM display_mosques LIMIT 1;
  IF m_id IS NOT NULL THEN
    INSERT INTO displays (mosque_id, code, name, status) VALUES (m_id, 'DEMO-TV', 'TV Utama', 'offline') ON CONFLICT (code) DO NOTHING;
    SELECT id INTO d_id FROM displays WHERE code = 'DEMO-TV' LIMIT 1;
    IF d_id IS NOT NULL THEN
      INSERT INTO display_states (display_id, mode) VALUES (d_id, 'normal') ON CONFLICT (display_id) DO NOTHING;
    END IF;
  END IF;
END $$;

INSERT INTO display_prayer_settings (prayer, iqomah_delay) VALUES
  ('subuh', 10),
  ('dzuhur', 5),
  ('ashar', 5),
  ('maghrib', 5),
  ('isya', 10)
ON CONFLICT (prayer) DO NOTHING;
