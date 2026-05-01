const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/contexts/MonetizationContext.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace("title: \\`Saldo \\${type} tidak cukup\\`,", "title: `Saldo ${type} tidak cukup`,");
content = content.replace("description: \\`Anda butuh \\${amount} \\${type} untuk menggunakan fitur ini.\\`,", "description: `Anda butuh ${amount} ${type} untuk menggunakan fitur ini.`,");

fs.writeFileSync(filePath, content);
