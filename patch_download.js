const fs = require('fs');
const file = 'src/views/KreativitasPage/index.js';
let content = fs.readFileSync(file, 'utf8');

// Replace the download button with manual text instructions
const downloadBtnRegex = /<Button[\s\S]*?as="a"[\s\S]*?href=\{generatedImageUrl\}[\s\S]*?target="_blank"[\s\S]*?download="ai_generated_image\.png"[\s\S]*?>[\s\S]*?Buka Gambar Full[\s\S]*?<\/Button>/;

content = content.replace(downloadBtnRegex, `<Text fontSize="xs" color="gray.400" mt={2} fontStyle="italic">Tekan lama / klik kanan pada gambar untuk menyimpan.</Text>`);

fs.writeFileSync(file, content);
