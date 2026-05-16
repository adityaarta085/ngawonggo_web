const fs = require('fs');
let content = fs.readFileSync('src/views/KreativitasPage/index.js', 'utf8');

content = content.replace("toast({ title: 'Gagal', description: 'Gagal membuat gambar.', status: 'error' });", "toast({ title: 'Gagal', description: error.message || 'Gagal membuat gambar.', status: 'error', duration: 7000, isClosable: true });");

fs.writeFileSync('src/views/KreativitasPage/index.js', content);
