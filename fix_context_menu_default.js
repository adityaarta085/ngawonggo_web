const fs = require('fs');
const path = 'src/components/CustomContextMenu.js';

let code = fs.readFileSync(path, 'utf8');

code = code.replace(
    /const handleContextMenu = \(e\) => {[\s\S]*?setContextData\({ visible: true, x: clickX, y: clickY, fromSelection: false, selectedText: text }\);\n        };/,
`const handleContextMenu = (e) => {
            const text = window.getSelection().toString().trim();

            // Allow default context menu if no text is selected
            if (!text || text.length === 0) {
                return;
            }

            e.preventDefault();

            // Adjust coordinates to prevent menu from going off-screen
            const menuWidth = 200;
            const menuHeight = 150;

            let clickX = e.clientX;
            let clickY = e.clientY;

            if (clickX + menuWidth > window.innerWidth) {
                clickX = window.innerWidth - menuWidth - 10;
            }
            if (clickY + menuHeight > window.innerHeight) {
                clickY = window.innerHeight - menuHeight - 10;
            }

            setContextData({ visible: true, x: clickX, y: clickY, fromSelection: false, selectedText: text });
        };`
);

fs.writeFileSync(path, code);
