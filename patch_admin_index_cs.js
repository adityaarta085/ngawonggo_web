const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'views', 'AdminPage', 'index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add import for CsManager
content = content.replace(
  `import UserManager from './components/UserManager';`,
  `import UserManager from './components/UserManager';\nimport CsManager from './components/CsManager';\nimport { FaHeadset } from 'react-icons/fa';`
);

// Add to menuItems
content = content.replace(
  `{ name: 'Pengguna', icon: FaUsers },`,
  `{ name: 'Customer Service', icon: FaHeadset },\n    { name: 'Pengguna', icon: FaUsers },`
);

// Add to Main Content switch
content = content.replace(
  `{activeTab === 'Pengguna' && <UserManager />}`,
  `{activeTab === 'Customer Service' && <CsManager />}\n          {activeTab === 'Pengguna' && <UserManager />}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('AdminPage/index.js patched with CsManager');
