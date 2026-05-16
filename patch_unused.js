const fs = require('fs');
const file = 'src/views/KreativitasPage/index.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/SimpleGrid,\n/g, '');
fs.writeFileSync(file, content);
