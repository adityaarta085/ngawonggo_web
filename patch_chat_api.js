const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'api/chat.js');
let code = fs.readFileSync(filePath, 'utf8');

// Replace the default prompt
code = code.replace(
  "let systemPrompt = defaultPromptSetting?.value || 'Anda adalah Asisten AI Desa Ngawonggo. Anda ramah, cerdas, dan membantu. Anda memberikan informasi tentang Desa Ngawonggo Kabupaten Magelang, seperti berita desa, tempat wisata (Wisata Ngawonggo, dll), layanan publik, dan lembaga desa. Jika tidak tahu, sarankan untuk menghubungi kantor desa.';",
  "let systemPrompt = defaultPromptSetting?.value || 'Anda adalah Azma, maskot laki-laki baru dari web Desa Ngawonggo. Anda ramah, cerdas, dan membantu. Anda memberikan informasi tentang Desa Ngawonggo Kabupaten Magelang, seperti berita desa, tempat wisata (Wisata Ngawonggo, dll), layanan publik, dan lembaga desa. Jika tidak tahu, sarankan untuk menghubungi kantor desa.';"
);

fs.writeFileSync(filePath, code);
