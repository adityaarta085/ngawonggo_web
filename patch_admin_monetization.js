const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/AdminPage/index.js');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('import MonetizationManager')) {
    content = content.replace(
        "import DonasiManager from './components/DonasiManager';",
        "import DonasiManager from './components/DonasiManager';\nimport MonetizationManager from './components/MonetizationManager';\nimport { FaCoins } from 'react-icons/fa';"
    );

    // add to menu
    content = content.replace(
        "{ name: 'Pengaturan', icon: FaCog },",
        "{ name: 'Pengaturan', icon: FaCog },\n    { name: 'Monetisasi & Limit', icon: FaCoins },"
    );

    // add to rendering
    content = content.replace(
        "{activeTab === 'Pengaturan' && <SettingsManager />}",
        "{activeTab === 'Pengaturan' && <SettingsManager />}\n          {activeTab === 'Monetisasi & Limit' && <MonetizationManager />}"
    );

    fs.writeFileSync(filePath, content);
    console.log('AdminPage updated with Monetization tab');
}
