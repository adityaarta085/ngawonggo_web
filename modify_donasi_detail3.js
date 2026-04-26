const fs = require('fs');
let content = fs.readFileSync('src/views/DonasiPage/DonasiDetail.js', 'utf8');

// 5. Update form submission to navigate
const submitTarget = `        if (error) { console.error('Supabase Error:', error); throw error; }
        setPaymentData({ ...trxData, trx_id: trxData.qris_id || trxData.payment_reference, payment_url: trxData.checkout_url, qr_image: trxData.qris_image_url });
        setPaymentStatus('pending');
      } else {`;

const submitReplacement = `        if (error) { console.error('Supabase Error:', error); throw error; }

        // Navigate to the transaction URL
        navigate(\`/donasi/\${id}/\${trxData.qris_id || trxData.payment_reference}\`);
      } else {`;

content = content.replace(submitTarget, submitReplacement);

fs.writeFileSync('src/views/DonasiPage/DonasiDetail.js', content, 'utf8');
