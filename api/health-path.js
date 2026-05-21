module.exports = async (req, res) => {
  const path = req.query.path || 'unknown';

  // Super lightweight 200 OK for any dynamic path checking
  return res.status(200).json({
    status: "ok",
    path: `/${path}`,
    message: `Endpoint /${path} is functioning correctly.`,
    timestamp: new Date().toISOString()
  });
};
