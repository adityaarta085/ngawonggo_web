const fs = require('fs');
const file = 'src/views/KreativitasPage/index.js';
let content = fs.readFileSync(file, 'utf8');

// Fix the doubled w="full" property which might cause jsx error
content = content.replace(/w="full"\n[\s]*h=\{\{ base: "450px", md: "600px" \}\} w=\{\{ base: "full", md: "auto" \}\}/g, `h={{ base: "450px", md: "600px" }}\n                        w={{ base: "full", md: "auto" }}`);

// Need to make sure the style block uses dangerouslySetInnerHTML or it's just raw string in react
content = content.replace(/<style>\n\.loader \{([\s\S]*?)<\/style>/g, `<style dangerouslySetInnerHTML={{__html: \`
.loader {
$1\n\`}} />`);

fs.writeFileSync(file, content);
