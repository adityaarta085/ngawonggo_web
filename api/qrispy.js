export default async function handler(req, res) {
  const { action, amount, qris_id } = req.query;
  const apiKey = process.env.QRISPY_API_KEY || "cki_Z9G03nQ2wBKuHlQZrYGAJ52wqWNHWqCxquq8xh089cJod4Zb";
  const apiUrl = "https://api.qrispy.id";

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    Accept: "application/json"
  };

  try {
    let url = '';
    let method = 'GET';
    let body = null;

    if (action === 'createpayment') {
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

    const apiRes = await fetch(url, {
      method,
      headers,
      body
    });

    const data = await apiRes.json();

    return res.status(apiRes.status).json(data);

  } catch (error) {
    console.error('Qrispy API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
