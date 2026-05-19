const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Chatbot.js');
let code = fs.readFileSync(filePath, 'utf8');

// Revert position
code = code.replace(
  'right={isDocked ? "auto" : 0}',
  'right={isDocked ? 0 : 0}'
);
code = code.replace(
  'left={isDocked ? { base: 4, md: 8 } : 0}',
  'left={isDocked ? "auto" : 0}'
);

fs.writeFileSync(filePath, code);

const appFilePath = path.join(__dirname, 'src/App.js');
let appCode = fs.readFileSync(appFilePath, 'utf8');

// Revert App.js tooltip placement
appCode = appCode.replace('placement="right" aria-label="Restore Panels"', 'placement="left" aria-label="Restore Panels"');
appCode = appCode.replace(
  '<Box\n                  position="fixed"\n                  left={0}\n                  top="50%"',
  '<Box\n                  position="fixed"\n                  right={0}\n                  top="50%"'
);
appCode = appCode.replace(
  'borderRightRadius="full"',
  'borderLeftRadius="full"'
);

fs.writeFileSync(appFilePath, appCode);
