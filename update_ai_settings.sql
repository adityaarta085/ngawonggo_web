-- Update existing AI settings
UPDATE site_settings SET value = 'acv-72ac0d2177c199ac9d9a8f4e1cd4ada406ec99cd309890ba8f4f3dbaa1927053' WHERE key = 'groq_api_key';
UPDATE site_settings SET key = 'openai_api_key' WHERE key = 'groq_api_key';

-- Set the default prompt
INSERT INTO site_settings (key, value, description)
VALUES (
    'default_ai_prompt',
    'Anda adalah Asisten AI Desa Ngawonggo. Anda ramah, cerdas, dan membantu. Anda memberikan informasi tentang Desa Ngawonggo Kabupaten Magelang, seperti berita desa, tempat wisata (Wisata Ngawonggo, dll), layanan publik, dan lembaga desa. Jika tidak tahu, sarankan untuk menghubungi kantor desa.',
    'Default system prompt for AI assistant'
)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value;

-- Clean up unused old groq model if present
DELETE FROM site_settings WHERE key = 'groq_model';
