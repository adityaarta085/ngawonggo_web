const fs = require('fs');
const file = 'src/views/AdminPage/components/BroadcastManager.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\\\`\\\`\\\`html/g, '```html');
content = content.replace(/\\\`\\\`\\\`/g, '```');

fs.writeFileSync(file, content);
