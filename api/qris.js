const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
// Using node-fetch globally is not strictly needed in next.js environments but we can use native fetch if available or keep axios. Let's strictly follow the user's example using native fetch.

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = async (req, res) => {
  try {
    const apiToken = 'cki_gM3Rdw6QPhO8eaWRqSZjRXmnf5K2rYvJYjvPrr11voERsUBm';
    const API_URL = 'https://api.qrispy.id';

    const { action } = req.query;

    if (req.method === 'POST' && action === 'generate') {
      const { amount, donation_id, donor_name, donor_msg } = req.body;

      if (!amount || !donation_id) {
        return res.status(400).json({ error: 'Amount and donation_id are required' });
      }

      let response;
      try {
        const fetchResponse = await fetch(`${API_URL}/api/payment/qris/generate`, {
          method: 'POST',
          headers: {
            'X-API-Token': apiToken,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
             amount,
             payment_reference: `DON-${donation_id}-${Date.now()}`
          })
        });

        const data = await fetchResponse.json();
        if (!fetchResponse.ok || data.status !== 'success') {
           throw new Error(data.message || 'Failed to generate from QRIS API');
        }

        const qrisData = data.data;

      // Save to donation_transactions
      const { data: txData, error: txError } = await supabase
        .from('donation_transactions')
        .insert([{
          donation_id,
          qris_id: qrisData.qris_id,
          donor_name: donor_name || 'Hamba Allah',
          donor_msg: donor_msg || '',
          amount: qrisData.amount,
          status: 'pending',
          qris_image_url: qrisData.qris_image_url,
          expired_at: qrisData.expired_at
        }])
        .select()
        .single();

      if (txError) {
        console.error('Error saving tx:', txError);
        return res.status(500).json({ error: 'Failed to save transaction' });
      }

      return res.status(200).json({ success: true, transaction: txData, qris: qrisData });

      } catch(err) {
         console.error('QRIS Generation Error:', err);
         return res.status(500).json({ error: err.message });
      }
    }

    if (req.method === 'GET' && action === 'status') {
      const { qris_id } = req.query;

      if (!qris_id) return res.status(400).json({ error: 'qris_id is required' });

      // Check current tx status in DB first
      const { data: txInfo } = await supabase
        .from('donation_transactions')
        .select('*')
        .eq('qris_id', qris_id)
        .single();

      if (txInfo && txInfo.status === 'paid') {
        return res.status(200).json({ success: true, status: 'paid' });
      }

      // Call QRISPY status
      try {
        const fetchResponse = await fetch(`${API_URL}/api/payment/qris/${qris_id}/status`, {
          method: 'GET',
          headers: { 'X-API-Token': apiToken }
        });

        const responseData = await fetchResponse.json();
        const statusData = responseData.data || responseData;
        let currentStatus = statusData?.payment_status || statusData?.status || 'pending';

        // Update DB if paid or expired
        if (currentStatus === 'paid' && txInfo && txInfo.status !== 'paid') {
            await supabase.from('donation_transactions').update({ status: 'paid' }).eq('qris_id', qris_id);
            // Increment current_amount in donations
            await supabase.rpc('increment_donation_amount', { row_id: txInfo.donation_id, amount_to_add: txInfo.amount }).catch(console.error);
        } else if (currentStatus === 'expired' && txInfo && txInfo.status !== 'expired') {
            await supabase.from('donation_transactions').update({ status: 'expired' }).eq('qris_id', qris_id);
        }

        return res.status(200).json({ success: true, status: currentStatus, data: statusData });
      } catch (err) {
         return res.status(500).json({ error: 'Failed to check status from QRISPY' });
      }
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('QRIS API Error:', error);
    return res.status(500).json({ error: error.message });
  }
};
