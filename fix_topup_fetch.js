const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/TopupPage/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace axios with fetch identically to DonasiDetail.js
const axiosCheckoutSearch = `const response = await axios.post(\`/api/qrispy?action=createpayment&amount=\${selectedPackage.price}\`);

      if (response.data?.data?.qr_url) {
        setQrisData({
            ...response.data.data,
            package: selectedPackage
        });`;

const fetchCheckoutReplace = `const res = await fetch('https://api.qrispy.id/api/payment/qris/generate', {
        method: 'POST',
        headers: {
            "X-API-Token": "cki_Z9G03nQ2wBKuHlQZrYGAJ52wqWNHWqCxquq8xh089cJod4Zb",
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            amount: parseInt(selectedPackage.price, 10),
            payment_reference: "INV-COIN-" + Date.now(),
        })
      });
      const data = await res.json();

      if (data.status === 'success' && data.data?.qr_url) {
        setQrisData({
            ...data.data,
            package: selectedPackage
        });`;

content = content.replace(axiosCheckoutSearch, fetchCheckoutReplace);

const axiosStatusSearch = `const response = await axios.get(\`/api/qrispy?action=checkstatus&qris_id=\${qrisData.qris_id}\`);

      if (response.data?.data?.status === 'success') {`;

const fetchStatusReplace = `const res = await fetch(\`https://api.qrispy.id/api/payment/qris/\${qrisData.qris_id}/status\`, {
          headers: {
              "X-API-Token": "cki_Z9G03nQ2wBKuHlQZrYGAJ52wqWNHWqCxquq8xh089cJod4Zb",
              "Content-Type": "application/json",
              Accept: "application/json"
          }
      });
      const data = await res.json();

      let currentStatus = (data.data?.payment_status || data.data?.status || 'pending').toLowerCase();
      if (currentStatus === 'paid') currentStatus = 'success';

      if (currentStatus === 'success') {`;

content = content.replace(axiosStatusSearch, fetchStatusReplace);

fs.writeFileSync(filePath, content);
console.log('Patched TopupPage to use identical fetch strategy as DonasiDetail');
