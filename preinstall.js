const fs = require('fs');
const path = require('path');

try {
  const filePath = path.join(__dirname, 'node_modules/react-dev-utils/checkRequiredFiles.js');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace("fs.accessSync(filePath, fs.F_OK);", "fs.accessSync(filePath, fs.constants.F_OK);");
    fs.writeFileSync(filePath, content);
  }
} catch (e) {
  // Ignored
}
