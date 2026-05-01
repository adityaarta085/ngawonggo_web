const fs = require('fs');

let content = fs.readFileSync('src/App.js', 'utf8');

// The sed command above was a mess, let's just do it cleanly in node
// Find line 50 and replace it. Or just replace any import of PortalRouter with the correct one.
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('import PortalRouter from')) {
        lines[i] = 'import PortalRouter from "./views/PortalPage/PortalRouter.js";';
    } else if (lines[i].includes('import PortalPage from "./views/PortalPage/index.js";')) {
        lines[i] = 'import PortalRouter from "./views/PortalPage/PortalRouter.js";';
    }
}
fs.writeFileSync('src/App.js', lines.join('\n'));
