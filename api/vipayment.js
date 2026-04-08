const crypto = require('crypto');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ result: false, message: 'Method not allowed' });
  }

  // Use environment variables for VIPayment credentials
  // Ensure these exist in the actual Vercel project environment
  const API_KEY = process.env.VIPAYMENT_API_KEY || 'dummy_key';
  const API_ID = process.env.VIPAYMENT_API_ID || 'dummy_id';

  const sign = crypto.createHash('md5').update(API_ID + API_KEY).digest('hex');
  const baseUrl = 'https://vip-reseller.co.id/api';

  const { endpoint, action, service, data_no, data_zone, data, quantity } = req.body;

  if (!endpoint) {
    return res.status(400).json({ result: false, message: 'Endpoint is required' });
  }

  let apiUrl = `${baseUrl}/${endpoint}`;
  let payload = {
    key: API_KEY,
    sign: sign,
  };

  try {
    if (endpoint === 'profile') {
      // POST /api/profile
      // No extra params
    } else {
      payload.type = action; // 'order', 'status', 'services', etc.

      if (action === 'order') {
        payload.service = service;

        if (endpoint === 'prepaid') {
           payload.data_no = data_no;
        } else if (endpoint === 'social-media') {
           payload.data = data;
           payload.quantity = quantity;
        } else if (endpoint === 'game-feature') {
           payload.data_no = data_no;
           if (data_zone) payload.data_zone = data_zone;
        }
      } else if (action === 'services') {
        // Fetch services
        if (endpoint === 'prepaid') {
            payload.filter_type = 'type';
            payload.filter_value = ''; // all
        } else if (endpoint === 'social-media') {
            //
        } else if (endpoint === 'game-feature') {
            payload.filter_status = 'available';
        }
      }
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // VIPayment often expects form data
      },
      // Using URLSearchParams to handle form encoding
      body: new URLSearchParams(payload).toString(),
    });

    const result = await response.json();
    return res.status(200).json(result);

  } catch (error) {
    console.error('VIPayment API Error:', error);
    return res.status(500).json({ result: false, message: 'Internal Server Error' });
  }
}
