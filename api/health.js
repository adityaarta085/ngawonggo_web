module.exports = async (req, res) => {
  const startTime = Date.now();

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
