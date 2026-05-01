const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/index.js');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('MonetizationProvider')) {
    content = content.replace(
        "import { LanguageProvider } from './contexts/LanguageContext';",
        "import { LanguageProvider } from './contexts/LanguageContext';\nimport { MonetizationProvider } from './contexts/MonetizationContext';"
    );

    content = content.replace(
        "<BrowserRouter>",
        "<MonetizationProvider>\n            <BrowserRouter>"
    );

    content = content.replace(
        "</BrowserRouter>",
        "</BrowserRouter>\n            </MonetizationProvider>"
    );
}

fs.writeFileSync(filePath, content);
console.log('Fixed src/index.js missing Provider');
