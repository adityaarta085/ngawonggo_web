const fs = require('fs');
const file = 'src/views/KreativitasPage/index.js';
let content = fs.readFileSync(file, 'utf8');

// Remove unused Spinner and FaDownload
content = content.replace(/[\s]*Spinner,/, '');
content = content.replace(/ FaDownload,/, '');

fs.writeFileSync(file, content);
