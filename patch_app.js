const fs = require('fs');
const file = 'src/App.js';
let content = fs.readFileSync(file, 'utf8');

// Add import
content = content.replace(/import JelajahiPage from '\.\/views\/JelajahiPage';/g, `import JelajahiPage from './views/JelajahiPage';\nimport KreativitasPage from './views/KreativitasPage';`);

// Add Route
content = content.replace(/<Route path="\/jelajahi" element=\{<JelajahiPage \/>\} \/>/g, `<Route path="/jelajahi" element={<JelajahiPage />} />\n            <Route path="/kreativitas" element={<KreativitasPage />} />`);

fs.writeFileSync(file, content);
