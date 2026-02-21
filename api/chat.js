const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  try {
    // 1. Get API Key from Supabase
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'groq_api_key')
      .single();

    if (settingsError || !settings?.value) {
      return res.status(400).json({ error: 'Asisten AI belum dikonfigurasi oleh admin.' });
    }

    const GROQ_API_KEY = settings.value;

    // 2. Call Groq API
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Anda adalah Asisten AI Desa Ngawonggo. Anda ramah, cerdas, dan membantu. Anda memberikan informasi tentang Desa Ngawonggo, seperti berita desa, tempat wisata (Wisata Ngawonggo, dll), layanan publik, dan lembaga desa. Jika tidak tahu, sarankan untuk menghubungi kantor desa.'
        },
        ...messages
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Chat API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error?.message || error.message
    });
  }
};
