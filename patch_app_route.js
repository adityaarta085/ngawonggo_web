const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/App.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add import
if (!content.includes('import TopupPage')) {
    content = content.replace(
        "import DonasiRouter from './views/DonasiPage/index.js';",
        "import DonasiRouter from './views/DonasiPage/index.js';\nimport TopupPage from './views/TopupPage/index.js';"
    );
}

// Add route
if (!content.includes('<Route path="/topup"')) {
    content = content.replace(
        '<Route path="/donasi/*" element={<DonasiRouter />} />',
        '<Route path="/donasi/*" element={<DonasiRouter />} />\n            <Route path="/topup" element={<TopupPage />} />'
    );
}

fs.writeFileSync(filePath, content);
console.log('App.js routed to TopupPage');
