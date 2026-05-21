const fs = require('fs');
let code = fs.readFileSync('src/views/TopupPage/index.js', 'utf8');
code = code.replace("    // eslint-disable-next-line react-hooks/exhaustive-deps\n    // eslint-disable-next-line react-hooks/exhaustive-deps", "    // eslint-disable-next-line react-hooks/exhaustive-deps");
fs.writeFileSync('src/views/TopupPage/index.js', code);
