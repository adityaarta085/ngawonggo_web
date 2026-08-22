const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  const { action, amount, qris_id } = req.query;
  const apiKey = process.env.QRISPY_API_KEY || "cki_Z9G03nQ2wBKuHlQZrYGAJ52wqWNHWqCxquq8xh089cJod4Zb";
  const apiUrl = "https://api.qrispy.id";

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-API-Token'
  );

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Action: Sync Transaction Status with Gateway & Supabase
  if (action === 'sync' && req.method === 'POST') {
    const { trx_id } = req.body || {};
    if (!trx_id) {
      return res.status(400).json({ error: 'Missing trx_id' });
    }

    try {
      const checkUrl = `${apiUrl}/api/payment/qris/${trx_id}/status`;
      const checkRes = await fetch(checkUrl, {
        headers: {
          "X-API-Token": apiKey,
          Accept: 'application/json'
        }
      });
      const checkData = await checkRes.json();

      if (checkData.status !== "success" || !checkData.data) {
        return res.status(400).json({ error: 'Failed to verify transaction from gateway' });
      }

      let currentStatus = checkData.data.payment_status.toLowerCase();
      if (currentStatus === 'paid') currentStatus = 'success';
      if (currentStatus === 'cancelled') currentStatus = 'failed';

      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ error: 'Server Config Error' });
      }

      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data: currentDonation } = await supabase
        .from('donations')
        .select('status, campaign_id')
        .eq('trx_id', trx_id)
        .single();

      if (!currentDonation) {
        return res.status(404).json({ error: 'Donation not found in database' });
      }

      if (currentDonation.status !== currentStatus) {
        const { error: updateError } = await supabase
          .from('donations')
          .update({ status: currentStatus })
          .eq('trx_id', trx_id);

        if (updateError) throw updateError;

        if (currentStatus === 'success') {
          const { data: allSuccessDonations } = await supabase
            .from('donations')
            .select('amount')
            .eq('campaign_id', currentDonation.campaign_id)
            .eq('status', 'success');

          if (allSuccessDonations) {
            const total = allSuccessDonations.reduce((sum, item) => sum + item.amount, 0);
            await supabase
              .from('donation_campaigns')
              .update({ current_amount: total })
              .eq('id', currentDonation.campaign_id);
          }
        }
      }

      return res.status(200).json({ success: true, status: currentStatus });
    } catch (error) {
      console.error('Qrispy Sync Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const headers = {
    "X-API-Token": apiKey,
    "Content-Type": "application/json"
  };

  try {
    let url = '';
    let method = 'GET';
    let body = null;

    if (action === 'createpayment' && req.method === 'POST') {
      const parsedAmount = parseInt(amount, 10);

      if (!parsedAmount || isNaN(parsedAmount)) {
        return res.status(400).json({ error: "Amount invalid" });
      }

      url = `${apiUrl}/api/payment/qris/generate`;
      method = 'POST';

      body = JSON.stringify({
        amount: parsedAmount
      });

    } else if (action === 'checkstatus' && qris_id) {
      url = `${apiUrl}/api/payment/qris/${qris_id}/status`;

    } else if (action === 'check_profile') {
      url = `${apiUrl}/api/payment/balance`;

    } else if (action === 'cancel_transaction' && req.method === 'POST' && qris_id) {
      url = `${apiUrl}/api/payment/qris/${qris_id}/cancel`;
      method = 'POST';

    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const options = {
      method,
      headers
    };

    if (body) {
      options.body = body;
    }

    const apiRes = await fetch(url, options);
    const text = await apiRes.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Invalid JSON", raw: text });
    }

    return res.status(apiRes.status).json(data);

  } catch (error) {
    console.error('Qrispy API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', detail: error.message });
  }
};
