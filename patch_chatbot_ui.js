const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Chatbot.js');
let code = fs.readFileSync(filePath, 'utf8');

// Replace the title
code = code.replace(
  '<Text fontSize="xs" fontWeight="bold">ASISTEN AI DESA</Text>',
  '<Text fontSize="xs" fontWeight="bold">AZMA - MASKOT DESA</Text>'
);

fs.writeFileSync(filePath, code);
