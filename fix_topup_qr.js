const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/TopupPage/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix the condition throwing error
content = content.replace(
    "if (data.status === 'success' && data.data?.qr_url) {",
    "if (data.status === 'success' && (data.data?.qris_image_url || data.data?.qris_url || data.data?.qr_url)) {"
);

// 2. Map the correct URL to qrisData state
const mapSearch = `setQrisData({
            ...data.data,
            package: selectedPackage
        });`;

const mapReplace = `setQrisData({
            ...data.data,
            qr_url: data.data.qris_image_url || data.data.qris_url || data.data.qr_url,
            package: selectedPackage
        });`;

content = content.replace(mapSearch, mapReplace);

fs.writeFileSync(filePath, content);
console.log('Fixed TopupPage QR URL variable mapping');
