const fs = require('fs');
const file = 'src/views/LandingPage/components/QuickLinks.js';
let content = fs.readFileSync(file, 'utf8');

// Add to links array
content = content.replace(/{[\s]*label: language === 'id' \? 'Jelajahi' : 'Explore',[\s]*icon: FaCompass,[\s]*href: '\/jelajahi',[\s]*color: 'yellow.400',[\s]*},/g, `{
      label: language === 'id' ? 'Jelajahi' : 'Explore',
      icon: FaCompass,
      href: '/jelajahi',
      color: 'yellow.400',
    },
    {
      label: language === 'id' ? 'Kreativitas' : 'Creativity',
      icon: FaPhotoVideo, // or FaMagic if imported
      href: '/kreativitas',
      color: 'purple.500',
    },`);

fs.writeFileSync(file, content);
