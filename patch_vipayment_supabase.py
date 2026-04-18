import sys

content = """const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ result: false, message: 'Method not allowed' });
  }

  const { endpoint, action, service, data_no, data_zone, data, quantity } = req.body;

  if (!endpoint) {
    return res.status(400).json({ result: false, message: 'Endpoint is required' });
  }

  try {
    // 1. Get API Key and ID from Supabase site_settings
    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['vipayment_api_id', 'vipayment_api_key']);

    if (settingsError || !settings || settings.length === 0) {
      return res.status(400).json({ result: false, message: 'VIPayment credentials not configured in settings.' });
    }

    const apiIdSetting = settings.find(s => s.key === 'vipayment_api_id');
    const apiKeySetting = settings.find(s => s.key === 'vipayment_api_key');

    if (!apiIdSetting?.value || !apiKeySetting?.value) {
      return res.status(400).json({ result: false, message: 'VIPayment API ID or Key missing.' });
    }

    const API_ID = apiIdSetting.value;
    const API_KEY = apiKeySetting.value;

    const sign = crypto.createHash('md5').update(API_ID + API_KEY).digest('hex');
    const baseUrl = 'https://vip-reseller.co.id/api';

    let apiUrl = `${baseUrl}/${endpoint}`;
    let payload = {
      key: API_KEY,
      sign: sign,
    };

    if (endpoint === 'profile') {
      // POST /api/profile
      // No extra params
    } else {
      payload.type = action;

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
        if (endpoint === 'prepaid') {
            payload.filter_type = 'type';
            payload.filter_value = '';
        } else if (endpoint === 'game-feature') {
            payload.filter_status = 'available';
        }
      }
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(payload).toString(),
    });

    const result = await response.json();
    return res.status(200).json(result);

  } catch (error) {
    console.error('VIPayment API Error:', error);
    return res.status(500).json({ result: false, message: 'Internal Server Error' });
  }
}
"""

with open("api/vipayment.js", "w") as f:
    f.write(content)
