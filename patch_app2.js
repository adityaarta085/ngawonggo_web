const fs = require('fs');
const file = 'src/App.js';
let content = fs.readFileSync(file, 'utf8');

// The first patch might have failed if it wasn't importing JelajahiPage like that
content = content.replace(/import JelajahiPage from '\.\/views\/JelajahiPage\/index\.js';/g, `import JelajahiPage from './views/JelajahiPage/index.js';\nimport KreativitasPage from './views/KreativitasPage/index.js';`);

fs.writeFileSync(file, content);
