export default async function handler(req, res) {
  const { action, amount, qris_id } = req.query;
  const apiKey = process.env.QRISPY_API_KEY || "cki_Z9G03nQ2wBKuHlQZrYGAJ52wqWNHWqCxquq8xh089cJod4Zb";
  const apiUrl = "https://api.qrispy.id";

  // Handle CORS
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
        url = `${apiUrl}/api/payment/qris/generate`;
        method = 'POST';
        const reqBody = typeof req.body === 'string' && req.body ? JSON.parse(req.body) : (req.body || {});
        body = JSON.stringify({
            amount: parseInt(amount, 10),
            payment_reference: reqBody.payment_reference || ("INV-" + Date.now()),
            return_url: reqBody.return_url || "https://ngawonggo.com/donasi"
        });
    } else if (action === 'checkstatus') {
        url = `${apiUrl}/api/payment/qris/${qris_id}/status`;
    } else if (action === 'check_public') {
        // qrispy doesn't have a specific public check, use checkstatus
        url = `${apiUrl}/api/payment/qris/${qris_id}/status`;
    } else if (action === 'check_profile') {
        url = `${apiUrl}/api/payment/balance`;
    } else if (action === 'cancel_transaction' && req.method === 'POST') {
         url = `${apiUrl}/api/payment/qris/${qris_id}/cancel`;
         method = 'POST';
    } else {
        return res.status(400).json({ error: 'Invalid action' });
    }

    const fetchOptions = {
        method,
        headers,
    };
    if (body) fetchOptions.body = body;

    const apiRes = await fetch(url, fetchOptions);
    const data = await apiRes.json();

    return res.status(200).json(data);

  } catch (error) {
    console.error('Qrispy API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
