module.exports = async (req, res) => {
  const start = Date.now();
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

  results.total_latency = `${Date.now() - start}ms`;
  return res.status(200).json(results);
};
