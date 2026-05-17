const fs = require('fs');

const path = 'src/views/LandingPage/components/QuickLinks.js';
let content = fs.readFileSync(path, 'utf8');

const importRegex = /from\s+'react-icons\/fa';/;
if (content.match(importRegex) && !content.includes('FaFilm')) {
    content = content.replace(/(from\s+'react-icons\/fa';)/, "  FaFilm,\n$1");
}

const dracinLink = `
    {
      label: language === 'id' ? 'Dracin' : 'Dracin',
      icon: FaFilm,
      href: '/dracin',
      color: 'red.400',
    },`;

if (!content.includes("'Dracin'")) {
    content = content.replace(/(\{\s*label:\s*language\s*===\s*'id'\s*\?\s*'Kreativitas'\s*:\s*'Creativity',)/, `${dracinLink}\n    $1`);
}

fs.writeFileSync(path, content);
console.log('QuickLinks patched');
