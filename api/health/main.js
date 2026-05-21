const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;
  
  const pages = ["auth","donasi","topup","news","profil","pemerintahan","layanan","jelajahi","kreativitas","downloader","cekplagiat","transparansi","kontak","media","dracin","anime","quran","admin","portal","game"];
  const apis = ["ai-image","ai-summary","berita-magelang","broadcast","chat","cron-national-news","qrispy-sync","qrispy-webhook","qrispy","telegram","verify-turnstile"];

  const results = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    frontend: {},
    backend: {},
    external: {}
  };

  const timeoutMs = 5000;

  // External APIs Check
  try {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error } = await supabase.from('site_settings').select('id').limit(1);
        results.external['supabase_db'] = error ? 'error' : 'ok';
    } else {
        results.external['supabase_db'] = 'missing_env';
    }
  } catch (e) {
    results.external['supabase_db'] = 'error';
  }

  try {
    const aiResponse = await axios.get('https://api.nexray.eu.cc/ai/claude?text=ping', { timeout: timeoutMs });
    results.external['nexray_ai'] = aiResponse.status === 200 ? 'ok' : 'error';
  } catch (e) {
    results.external['nexray_ai'] = 'error';
  }

  // Verify internal endpoints if ?full=1 is provided to prevent extreme load during basic pings
  if (req.query.full === '1') {
    const checkEndpoint = async (path, group, key) => {
      try {
        const response = await axios.get(`${baseUrl}${path}`, { timeout: timeoutMs });
        results[group][key] = response.status === 200 ? 'ok' : 'error';
      } catch (e) {
        results[group][key] = 'error';
      }
    };

    const promises = [];
    pages.forEach(page => {
      promises.push(checkEndpoint(`/${page}/health`, 'frontend', page));
    });

    apis.forEach(api => {
      promises.push(checkEndpoint(`/api/${api}/health`, 'backend', api));
    });

    await Promise.allSettled(promises);
  } else {
    results.note = "Use ?full=1 to check all internal frontend/backend endpoints.";
    pages.forEach(page => results.frontend[page] = 'configured');
    apis.forEach(api => results.backend[api] = 'configured');
  }

  const hasError = Object.values(results.frontend).some(v => v === 'error') ||
                   Object.values(results.backend).some(v => v === 'error') ||
                   Object.values(results.external).some(v => v === 'error');
  
  if (hasError) {
    results.status = 'degraded';
  }

  res.status(200).json(results);
};
