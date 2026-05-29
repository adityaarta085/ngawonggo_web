const fs = require('fs');
let code = fs.readFileSync('src/views/DracinPage/api.js', 'utf8');

code = code.replace("  };", "  }\n};");

fs.writeFileSync('src/views/DracinPage/api.js', code);
