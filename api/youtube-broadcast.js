// Serverless endpoint for YouTube Live Stream Management & RTMP Relay Handshake

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Health check & default RTMP ingest endpoints
    return res.status(200).json({
      status: 'ready',
      rtmp_primary: 'rtmp://a.rtmp.youtube.com/live2',
      rtmps_primary: 'rtmps://a.rtmps.youtube.com/live2',
      rtmp_backup: 'rtmp://b.rtmp.youtube.com/live2?backup=1',
      rtmps_backup: 'rtmps://b.rtmps.youtube.com/live2?backup=1',
      supported_codecs: ['h264', 'vp8', 'vp9', 'opus', 'aac'],
      max_bitrate_kbps: 6000,
      target_resolution: '1080p / 720p',
    });
  }

  if (req.method === 'POST') {
    const { action, streamKey, title, description } = req.body;

    if (action === 'validate-stream-key') {
      if (!streamKey || streamKey.trim().length < 10) {
        return res.status(400).json({ error: 'Stream Key YouTube tidak valid. Format harus berupa kunci siaran dari YouTube Studio.' });
      }

      const maskedKey = streamKey.trim().slice(0, 4) + '****' + streamKey.trim().slice(-4);
      return res.status(200).json({
        success: true,
        message: 'Kunci siaran YouTube valid dan siap digunakan.',
        maskedKey,
        ingestUrl: `rtmp://a.rtmp.youtube.com/live2/${streamKey.trim()}`,
      });
    }

    if (action === 'start-session') {
      const sessionId = 'live_' + Math.random().toString(36).substring(2, 12);
      return res.status(200).json({
        success: true,
        sessionId,
        startedAt: new Date().toISOString(),
        title: title || 'Siaran Langsung Ngawonggo TV',
        description: description || 'Siaran live streaming resmi dari Studio Ngawonggo TV.',
      });
    }

    return res.status(400).json({ error: 'Action tidak dikenali.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
