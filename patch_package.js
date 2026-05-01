const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'package.json');
const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));

pkg.scripts.postinstall = "node preinstall.js";

fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2));
console.log('package.json patched');
