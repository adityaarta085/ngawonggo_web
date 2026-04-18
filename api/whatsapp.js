import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { to, message } = req.body;
  if (!to || !message) {
    return res.status(400).json({ error: 'Missing to or message' });
  }

  try {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    // We will just try using the fallback API Key if there is an issue with Supabase
    let apiKey = '881036955b2c50ba6adcb01b66b1b6549897124f8daed38c1bf23613581fff0f';
    let sessionId = 'sess_1';

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data: settings } = await supabase.from('site_settings').select('key, value').in('key', ['whatsapp_api_key', 'whatsapp_session_id']);

      if (settings) {
         const keySetting = settings.find(s => s.key === 'whatsapp_api_key');
         const sessionSetting = settings.find(s => s.key === 'whatsapp_session_id');
         if (keySetting && keySetting.value) apiKey = keySetting.value;
         if (sessionSetting && sessionSetting.value) sessionId = sessionSetting.value;
      }
    }

    const response = await fetch('https://whats.yobase.me/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify({
        session_id: sessionId,
        to,
        message,
        type: 'text'
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('WhatsApp API error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
