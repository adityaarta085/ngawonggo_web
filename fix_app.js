const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/App.js');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace(
  '<Mascot3D />\n              <Chatbot',
  '<>\n              <Mascot3D />\n              <Chatbot'
);

code = code.replace(
  'onHide={() => setIsFloatingHidden(true)}\n              />\n            )}',
  'onHide={() => setIsFloatingHidden(true)}\n              />\n              </>\n            )}'
);

fs.writeFileSync(filePath, code);
