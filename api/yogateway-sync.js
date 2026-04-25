import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // To prevent abuse, this endpoint will force a check directly to the gateway API
  const { trx_id } = req.body;
  if (!trx_id) {
    return res.status(400).json({ error: 'Missing trx_id' });
  }

  const apiKey = process.env.YOGATEWAY_API_KEY || "yo_sec_da1ecad21d5d8a6a880383ea24a7c206";

  try {
    // 1. Fetch authoritative status from gateway
    const checkUrl = `https://yogateway.id/api.php?action=checkstatus&apikey=${apiKey}&trxid=${trx_id}`;
    const checkRes = await fetch(checkUrl);
    const checkData = await checkRes.json();

    if (!checkData.status) {
        return res.status(400).json({ error: 'Failed to verify transaction from gateway' });
    }

    const currentStatus = checkData.data.status.toLowerCase(); // success, pending, expired, failed

    // Initialize Supabase
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ error: 'Server Config Error' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Fetch current record in DB to avoid unnecessary updates if already success
    const { data: currentDonation } = await supabase
      .from('donations')
      .select('status, campaign_id')
      .eq('trx_id', trx_id)
      .single();

    if (!currentDonation) {
        return res.status(404).json({ error: 'Donation not found in database' });
    }

    // Only update if the status actually changed
    if (currentDonation.status !== currentStatus) {
        // Update donation status
        const { error: updateError } = await supabase
          .from('donations')
          .update({ status: currentStatus })
          .eq('trx_id', trx_id);

        if (updateError) throw updateError;

        // If it changed TO success, recalculate campaign total
        if (currentStatus === 'success') {
            const { data: allSuccessDonations } = await supabase
              .from('donations')
              .select('amount')
              .eq('campaign_id', currentDonation.campaign_id)
              .eq('status', 'success');

            if(allSuccessDonations) {
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
    console.error('YogaGateway Sync Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
