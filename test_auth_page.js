const fs = require('fs');
const auth = fs.readFileSync('src/views/AuthPage/index.js', 'utf8');

if (auth.includes('Lanjutkan dengan WhatsApp')) {
  console.log("WhatsApp login still present in AuthPage!");
} else {
  console.log("WhatsApp login removed from AuthPage.");
}

if (auth.includes('Atau gunakan Email')) {
  console.log("Email login still present in AuthPage.");
} else {
  console.log("Email login missing from AuthPage!");
}

if (auth.includes('Tampilkan metode login lainnya')) {
  console.log("Other login methods hidden behind toggle in AuthPage.");
} else {
  console.log("Other login methods toggle missing in AuthPage!");
}
