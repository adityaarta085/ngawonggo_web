const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/LayananPage/ComplaintSystem.js');
let content = fs.readFileSync(filePath, 'utf8');

// The admin requested Layanan to be 1 per 3 days limit
const search = `const limitCheck = await checkFeatureLimit('layanan_pengaduan', 1);`;
const replace = `const limitCheck = await checkFeatureLimit('layanan_pengaduan', 1, 3);`;

if (content.includes(search)) {
    content = content.replace(search, replace);
}

fs.writeFileSync(filePath, content);
console.log("Patched limit check window");
