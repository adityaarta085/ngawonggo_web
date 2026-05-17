const fs = require('fs');

const path = 'src/views/LandingPage/components/QuickLinks.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/\}   FaFilm,/, "  FaFilm,\n}");

fs.writeFileSync(path, content);
console.log('QuickLinks import fixed');
