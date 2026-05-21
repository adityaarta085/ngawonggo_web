-- Update existing AI settings
UPDATE site_settings SET value = 'acv-5ba0703e794843d66034b8eeb4801bdfd402471740e2f44f04ca225b2e465659' WHERE key = 'groq_api_key';
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
