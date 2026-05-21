module.exports = async (req, res) => {
  // Super lightweight check for internal resources
  return res.status(200).json({
    status: "ok",
    type: "internal",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory_usage: process.memoryUsage()
  });
};
