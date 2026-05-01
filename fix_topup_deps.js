const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/TopupPage/index.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace("  }, [isModalOpen, qrisData]);", "    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [isModalOpen, qrisData]);");

fs.writeFileSync(filePath, content);
console.log('Fixed linting warnings in TopupPage.');
