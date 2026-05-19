const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/Chatbot.js');
let code = fs.readFileSync(filePath, 'utf8');

// The position code:
/*
      <Box
        position="fixed"
        bottom={isDocked ? { base: 20, md: 24 } : 0}
        right={isDocked ? 0 : 0}
        left={isDocked ? "auto" : 0}
        w={isDocked ? "auto" : "100vw"}
*/
// We need it on the left. So `right` is "auto" when docked, `left` is 0 or some margin when docked.

code = code.replace(
  'right={isDocked ? 0 : 0}',
  'right={isDocked ? "auto" : 0}'
);
code = code.replace(
  'left={isDocked ? "auto" : 0}',
  'left={isDocked ? { base: 4, md: 8 } : 0}'
);

fs.writeFileSync(filePath, code);
