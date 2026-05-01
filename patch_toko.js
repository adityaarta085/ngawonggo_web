const fs = require('fs');
let content = fs.readFileSync('src/views/PortalPage/TokoPage/index.js', 'utf8');

// Ensure the button is completely disabled if tier is VIP, as requested: "KALAU UDAH AKTIF YA NNDAK BISA DITUKARR"
content = content.replace('isDisabled={!gachaStats?.vip_cards || tier?.name === \'VIP\'}', 'isDisabled={!gachaStats?.vip_cards || tier?.name === \'VIP\'}');
// Also add tooltip or explanation text
content = content.replace('<Heading size="md" mb={2}>VIP Card Kamu</Heading>', '<Heading size="md" mb={2}>VIP Card Kamu</Heading>\n{tier?.name === "VIP" && <Badge colorScheme="red" mb={2}>VIP sudah aktif. Bagikan ke teman!</Badge>}');

fs.writeFileSync('src/views/PortalPage/TokoPage/index.js', content);
