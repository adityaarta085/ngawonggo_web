const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/App.js');
let code = fs.readFileSync(filePath, 'utf8');

// Also update the tooltip button that restores the panel so it stays consistent, but wait - the tooltip is on the right ("Tampilkan Panel"). It's ok to leave the show/hide panel button on the right, or we can move it left too. Actually, the prompt only asked to move the maskot to "kiri bawah" (bottom left). The "Tampilkan Panel" button restores *all* panels, including possibly others. Wait, it's `setIsFloatingHidden(false)` which restores Chatbot.
// Let's change the placement to "right" and right={0} to left={0}

code = code.replace('placement="left" aria-label="Restore Panels"', 'placement="right" aria-label="Restore Panels"');
code = code.replace(
  '<Box\n                  position="fixed"\n                  right={0}\n                  top="50%"',
  '<Box\n                  position="fixed"\n                  left={0}\n                  top="50%"'
);

code = code.replace(
  'borderLeftRadius="full"',
  'borderRightRadius="full"'
);

fs.writeFileSync(filePath, code);
