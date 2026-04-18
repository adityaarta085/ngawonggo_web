const fs = require('fs');
try {
  require('./src/views/PortalPage/index.js');
  console.log("Syntax OK");
} catch(e) {
  console.log("Syntax Error:", e);
}
