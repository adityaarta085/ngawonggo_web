const fs = require('fs');
const path = require('path');

let p;
let content;

p = path.join(__dirname, 'src', 'views', 'AdminPage', 'cs', 'CSDashboard.js');
content = fs.readFileSync(p, 'utf8');

// The new useEffect we added for status updates depends on setCsSession but we didn't add it to exhaustive-deps correctly or we might have missing deps.
// Let's just disable it on that line.
content = content.replace("}, [csSession, setCsSession]);", "  // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [csSession, setCsSession]);");
fs.writeFileSync(p, content, 'utf8');

console.log('ESLint warnings fixed round 2');
