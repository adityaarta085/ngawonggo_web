const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const secret = process.env.QRISPY_WEBHOOK_SECRET || 'whsec_B1vJEw0y1g6ZVHK66VP0HLhaaQglOXxb';
    const signature = req.headers['x-qrispy-signature'];

    if (!signature) {
      return res.status(400).send('Missing signature');
    }

    const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

    if (expectedSignature !== signature) {
      return res.status(401).send('Invalid signature');
    }

    const payload = JSON.parse(rawBody);

    if (payload.event !== 'payment.received') {
       return res.status(200).send('Event not handled');
    }

    const { qris_id } = payload.data;
    const trx_id = qris_id;
    let status = 'success'; // Since the event is payment.received, it implies success

    if (!trx_id) {
      return res.status(400).send('Invalid payload');
    }

    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    // We need service role key to bypass RLS for webhook updates
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Supabase credentials missing in webhook");
        return res.status(500).send('Server Config Error');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Update Donation Status
    const { data: donation, error: updateError } = await supabase
      .from('donations')
      .update({ status: status.toLowerCase() })
      .eq('trx_id', trx_id)
      .select('campaign_id, amount, status')
      .single();

    if (updateError) {
      console.error('Error updating donation:', updateError);
      return res.status(500).send('Database Error');
    }

    // 2. If Success, update Campaign Current Amount
    if (status.toLowerCase() === 'success' && donation) {
       // Note: Since webhooks might be sent multiple times, it's safer to recalculate
       // the total amount for the campaign from all successful donations.
       const { data: allSuccessDonations, error: calcError } = await supabase
        .from('donations')
        .select('amount')
        .eq('campaign_id', donation.campaign_id)
        .eq('status', 'success');

       if(!calcError && allSuccessDonations) {
           const total = allSuccessDonations.reduce((sum, item) => sum + item.amount, 0);

           await supabase
            .from('donation_campaigns')
            .update({ current_amount: total })
            .eq('id', donation.campaign_id);
       }
    }


    // Send Telegram Notification
    try {
      const fetch = (await import('node-fetch')).default;
      let messageStr = '';
      if (donation && status.toLowerCase() === 'success') {
         messageStr = `<b>User Sudah Donasi / Membeli Layanan!</b>\n\n<b>Trx ID:</b> ${trx_id}\n<b>Jumlah:</b> Rp ${donation.amount}\n\n<a href="https://ngawonggo.web.id/admin">Lihat Detail di Admin Panel</a>`;

         const telegramUrl = `https://${req.headers.host || 'ngawonggo.web.id'}/api/telegram`;
         await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: messageStr })
         });
      }
    } catch(err) {
      console.error("Telegram webhook error:", err);
    }

    // Process Topup if it's a topup transaction
    if (trx_id.startsWith('INV-COIN-')) {
        const { data: topupUser, error: topupError } = await supabase.rpc('process_topup_success_webhook_by_trx', {
            p_trx_id: trx_id,
            p_amount: payload.data.amount
        });

        if (topupError) {
            console.error('Error processing topup webhook:', topupError);
            // Optionally continue or return error
        }
        // We assume we might need a custom RPC if we just process by trx_id and amount to grant correct coins.
    }

    return res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).send('Internal Server Error');
  }
}
