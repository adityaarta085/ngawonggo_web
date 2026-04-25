import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const apiKey = process.env.YOGATEWAY_API_KEY || "yo_sec_da1ecad21d5d8a6a880383ea24a7c206";
  const signature = req.headers.get('x-yogateway-signature') || req.headers['x-yogateway-signature'];

  if (signature !== apiKey) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const payload = await req.json();
    const { trx_id, status, amount } = payload;

    if (!trx_id || !status) {
      return new Response('Invalid payload', { status: 400 });
    }

    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    // We need service role key to bypass RLS for webhook updates
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error("Supabase credentials missing in webhook");
        return new Response('Server Config Error', { status: 500 });
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
      return new Response('Database Error', { status: 500 });
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

    return new Response(JSON.stringify({ message: 'Webhook processed successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
