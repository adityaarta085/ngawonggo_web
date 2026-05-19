const fs = require('fs');

const appFile = 'src/components/Mascot3D.js';
let appCode = fs.readFileSync(appFile, 'utf8');

// Use the catbox link provided by the user as fallback directly if needed, or stick to /azma.glb
// The prompt said: "kalau ngomomg/ biacara mulutnya gerak dan lain lain aktifitas gituu."
// The prompt also said: "FILE GLB YANG SAYA KIRIM!! KALAU TIDAK PAKAI LINK INI https://files.catbox.moe/302oln.glb BUAT UNDUH FILE GLB NYA!!"
// I have already downloaded 302oln.glb to /azma.glb in a previous step!

appCode = appCode.replace('<Model url="/azma.glb" isSpeaking={isSpeaking} />', '<Model url="/azma.glb" isSpeaking={isSpeaking} />');

fs.writeFileSync(appFile, appCode);
