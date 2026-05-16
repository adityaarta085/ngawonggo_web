const fs = require('fs');
const file = 'src/components/Navbar.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/{ label: t\.explore \|\| 'Jelajahi', href: '\/jelajahi' },/g, `{
      label: t.explore || 'Jelajahi',
      children: [
        { label: 'Dusun', subLabel: 'Jelajahi wilayah dusun', href: '/jelajahi' },
        { label: 'Kreativitas', subLabel: 'AI Text-to-Image Super Realistis', href: '/kreativitas' }
      ],
      href: '/jelajahi'
    },`);

fs.writeFileSync(file, content);
