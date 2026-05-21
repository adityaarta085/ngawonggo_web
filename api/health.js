const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const startTime = Date.now();
  const action = req.query.action || 'master';

  // 1. PATH CHECK (wildcard /:path*/health)
  if (action === 'path') {
    const path = req.query.path || 'unknown';
    return res.status(200).json({
      status: "ok",
      path: `/${path}`,
      message: `Endpoint /${path} is functioning correctly.`,
      timestamp: new Date().toISOString()
    });
  }

  // 2. DATABASE CHECK
  if (action === 'db') {
    const results = { status: "ok", type: "database" };
    try {
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error } = await supabase.from('site_settings').select('key').limit(1);
        results.supabase = { status: error ? "error" : "ok", error: error?.message };
        if (error) results.status = "degraded";
      } else {
        results.supabase = { status: "warning", message: "Supabase config missing" };
      }
    } catch (err) {
      results.status = "error";
      results.supabase = { status: "error", error: err.message };
    }
    results.latency = `${Date.now() - startTime}ms`;
    return res.status(results.status === "error" ? 500 : 200).json(results);
  }

  // 3. EXTERNAL APIS CHECK
  if (action === 'external') {
    const results = { status: "ok", type: "external_apis", checks: {} };
    const checkApi = async (name, url, options = { method: 'HEAD' }) => {
      try {
        const apiStart = Date.now();
        const response = await fetch(url, options);
        results.checks[name] = {
          status: response.ok ? "ok" : "warning",
          statusCode: response.status,
          latency: `${Date.now() - apiStart}ms`
        };
      } catch (err) {
        results.checks[name] = { status: "error", error: err.message };
        results.status = "degraded";
      }
    };

    await Promise.all([
      checkApi('dracin', 'https://api.sansekai.my.id/api/pinedrama/'),
      checkApi('turnstile', 'https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST' }),
      checkApi('telegram', 'https://api.telegram.org/', { method: 'GET' })
    ]);

    results.total_latency = `${Date.now() - startTime}ms`;
    return res.status(200).json(results);
  }

  // 4. INTERNAL CHECK
  if (action === 'internal') {
    return res.status(200).json({
      status: "ok",
      type: "internal",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory_usage: process.memoryUsage()
    });
  }

  // 5. MASTER CHECK (Default)
  const results = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    message: "Master Healthcheck. All systems operational.",
    endpoints: {
      database: "/api/health/db",
      external: "/api/health/external",
      internal: "/api/health/internal",
      wildcard: "/* /health (e.g., /auth/health, /donasi/health, /api/chat/health)"
    }
  };
  results.total_latency = `${Date.now() - startTime}ms`;
  return res.status(200).json(results);
};
