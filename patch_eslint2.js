const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Chatbot.js');
let code = fs.readFileSync(filePath, 'utf8');

code = code.replace("import useSound from 'use-sound';", "");

fs.writeFileSync(filePath, code);
