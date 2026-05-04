const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing message content' });
  }

  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
     return res.status(500).json({ error: 'Database configuration missing' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Fetch Telegram configuration from Supabase
    const { data: settingsData, error: settingsError } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['telegram_bot_token', 'telegram_chat_ids']);

    if (settingsError) throw settingsError;

    let botToken = '';
    let chatIdsStr = '';

    settingsData.forEach(item => {
      if (item.key === 'telegram_bot_token') botToken = item.value;
      if (item.key === 'telegram_chat_ids') chatIdsStr = item.value;
    });

    if (!botToken || !chatIdsStr) {
        return res.status(200).json({ message: 'Telegram bot not configured. Skipped.' });
    }

    const chatIds = chatIdsStr.split(',').map(id => id.trim()).filter(id => id);

    if (chatIds.length === 0) {
        return res.status(200).json({ message: 'No Telegram chat IDs configured. Skipped.' });
    }

    const errors = [];

    // Using fetch directly as it is available in newer Node.js versions which Vercel uses
    for (const chatId of chatIds) {
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
          }),
        });

        if (!response.ok) {
           const errData = await response.json();
           errors.push(`Failed for ${chatId}: ${errData.description || response.statusText}`);
        }
      } catch (err) {
        errors.push(`Error for ${chatId}: ${err.message}`);
      }
    }

    if (errors.length > 0) {
      console.error('Telegram sending errors:', errors);
      // Still return 200 if it was partially successful or we at least tried
      return res.status(200).json({ message: 'Sent with some errors', errors });
    }

    return res.status(200).json({ message: 'Telegram messages sent successfully' });
  } catch (error) {
    console.error('Telegram integration error:', error);
    return res.status(500).json({ error: 'Failed to send Telegram message', details: error.message });
  }
};
