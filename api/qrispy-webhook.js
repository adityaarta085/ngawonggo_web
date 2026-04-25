import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Assuming qrispy webhook also sends an auth header or we can verify by checking qrispy API if needed
  // For now we will accept the payload since there is no mention of signature for webhook in doc
  // but if qrispy has it, we should use it.

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // According to Qrispy docs, status could be: pending, paid, expired, cancelled
    // So we map paid to success, and cancelled to failed, or just use their statuses
    // Let's check what fields Qrispy sends. Assuming qris_id and payment_status based on their poll response

    const { qris_id, payment_status } = payload;

    // In case payload is different, adapt here
    const trx_id = qris_id || payload.trx_id;
    let status = payment_status || payload.status;

    if (!trx_id || !status) {
      return res.status(400).send('Invalid payload');
    }

    if (status === 'paid') status = 'success';
    if (status === 'cancelled') status = 'failed';

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

    return res.status(200).json({ message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).send('Internal Server Error');
  }
}
