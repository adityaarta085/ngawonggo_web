const fs = require('fs');
const portal = fs.readFileSync('src/views/PortalPage/index.js', 'utf8');

if (portal.includes('Verifikasi WhatsApp') && portal.includes('user?.user_metadata?.whatsapp_verified')) {
  console.log("PortalPage successfully updated with WA verification logic.");
} else {
  console.log("PortalPage WA verification logic missing!");
}
