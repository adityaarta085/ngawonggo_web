const fs = require('fs');
const path = require('path');

const pages = [
  'auth', 'donasi', 'topup', 'news', 'profil', 'pemerintahan',
  'layanan', 'jelajahi', 'kreativitas', 'downloader', 'cekplagiat',
  'transparansi', 'kontak', 'media', 'dracin', 'anime', 'quran',
  'admin', 'portal', 'game'
];

const internalApis = [
  'ai-image', 'ai-summary', 'berita-magelang', 'broadcast', 'chat',
  'cron-national-news', 'qrispy-sync', 'qrispy-webhook', 'qrispy',
  'telegram', 'verify-turnstile'
];

const rootDir = __dirname;
const vercelJsonPath = path.join(rootDir, 'vercel.json');
let vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

if (!vercelJson.rewrites) {
  vercelJson.rewrites = [];
}

// Filter out old health rewrites and the wildcard
let newRewrites = vercelJson.rewrites.filter(r => 
  r.source !== '/(.*)' && 
  !r.source.endsWith('/health') &&
  r.source !== '/health'
);

// Helper to create simple health handler
const getHealthContent = (serviceName) => `module.exports = (req, res) => {
  res.status(200).json({ status: "ok", service: "${serviceName}" });
};
`;

pages.forEach(page => {
  const dir = path.join(rootDir, 'api', 'health', 'pages');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${page}.js`), getHealthContent(page));
  
  newRewrites.push({
    source: `/${page}/health`,
    destination: `/api/health/pages/${page}`
  });
});

internalApis.forEach(api => {
  const dir = path.join(rootDir, 'api', 'health', 'apis');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${api}.js`), getHealthContent(api));
  
  newRewrites.push({
    source: `/api/${api}/health`,
    destination: `/api/health/apis/${api}`
  });
});

// Main Aggregator
const mainAggregatorContent = `const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || 'localhost:3000';
  const baseUrl = \`\${protocol}://\${host}\`;
  
  const pages = ${JSON.stringify(pages)};
  const apis = ${JSON.stringify(internalApis)};

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
        const response = await axios.get(\`\${baseUrl}\${path}\`, { timeout: timeoutMs });
        results[group][key] = response.status === 200 ? 'ok' : 'error';
      } catch (e) {
        results[group][key] = 'error';
      }
    };

    const promises = [];
    pages.forEach(page => {
      promises.push(checkEndpoint(\`/\${page}/health\`, 'frontend', page));
    });

    apis.forEach(api => {
      promises.push(checkEndpoint(\`/api/\${api}/health\`, 'backend', api));
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
`;

const dirMain = path.join(rootDir, 'api', 'health');
if (!fs.existsSync(dirMain)) fs.mkdirSync(dirMain, { recursive: true });
fs.writeFileSync(path.join(dirMain, 'main.js'), mainAggregatorContent);

newRewrites.push({
  source: '/health',
  destination: '/api/health/main'
});

// Wildcard at the end
newRewrites.push({
  source: '/(.*)',
  destination: '/index.html'
});

vercelJson.rewrites = newRewrites;
fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelJson, null, 2));
console.log('Successfully generated health endpoints and updated vercel.json');
