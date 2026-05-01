const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/TopupPage/index.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace("await axios.get(\\`/api/qrispy?action=checkstatus&qris_id=\\${qrisData.qris_id}\\`);", "await axios.get(`/api/qrispy?action=checkstatus&qris_id=${qrisData.qris_id}`);");
content = content.replace("description: \\`\\${qrisData.package.coins} Koin telah ditambahkan.\\`,", "description: `${qrisData.package.coins} Koin telah ditambahkan.`,");

fs.writeFileSync(filePath, content);
console.log('Fixed Unicode escape strings in TopupPage.');
