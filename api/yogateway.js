export default async function handler(req, res) {
  const { action, amount, trxid } = req.query;
  const apiKey = process.env.YOGATEWAY_API_KEY || "yo_sec_da1ecad21d5d8a6a880383ea24a7c206";

  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    let url = '';
    let method = 'GET';
    let body = null;

    if (action === 'createpayment') {
        url = `https://yogateway.id/api.php?action=createpayment&apikey=${apiKey}&amount=${amount}`;
    } else if (action === 'checkstatus') {
        url = `https://yogateway.id/api.php?action=checkstatus&apikey=${apiKey}&trxid=${trxid}`;
    } else if (action === 'check_public') {
        url = `https://yogateway.id/api.php?action=check_public&trxid=${trxid}`;
    } else if (action === 'check_profile') {
        url = `https://yogateway.id/api.php?action=check_profile&apikey=${apiKey}`;
    } else if (action === 'get_withdrawal_methods') {
        url = `https://yogateway.id/api.php?action=get_withdrawal_methods&apikey=${apiKey}`;
    } else if (action === 'request_withdrawal' && req.method === 'POST') {
        url = `https://yogateway.id/api.php?action=request_withdrawal`;
        method = 'POST';
        const reqBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        body = JSON.stringify({
            api_key: apiKey,
            ...reqBody
        });
    } else if (action === 'cancel_transaction' && req.method === 'POST') {
         url = `https://yogateway.id/api.php?action=cancel_transaction`;
         method = 'POST';
         const reqBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
         body = JSON.stringify({
             api_key: apiKey,
             trx_id: reqBody.trx_id
         });
    } else {
        return res.status(400).json({ error: 'Invalid action' });
    }

    const fetchOptions = {
        method,
        headers: { 'Content-Type': 'application/json' },
    };
    if (body) fetchOptions.body = body;

    const apiRes = await fetch(url, fetchOptions);
    const data = await apiRes.json();

    return res.status(200).json(data);

  } catch (error) {
    console.error('YogaGateway API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
