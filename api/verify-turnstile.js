const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const SECRET_KEY = '0x4AAAAAACrMKsqMZ1ltbuGN79FbjKWsb2c'; // Using the key provided

    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      new URLSearchParams({
        secret: SECRET_KEY,
        response: token,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const data = response.data;

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: data['error-codes'] });
    }
  } catch (error) {
    console.error('Turnstile Verification Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
