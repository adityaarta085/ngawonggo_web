const fs = require('fs');
let content = fs.readFileSync('src/views/PortalPage/index.js', 'utf8');

content = content.replace(/<HStack>\s*<IconButton icon=\{<Icon as=\{FaBell\} \/>\} colorScheme="blue" variant="ghost" isRound onClick=\{\(\) => navigate\("\/portal\/notifikasi"\)\} aria-label="Notifikasi" ml=\{4\} \/>\s*<\/HStack>/g, '');
content = content.replace(/<HStack color="yellow\.600" justify="space-between" w="full">\s*<Heading size="2xl" color="yellow\.700">\{currency\?\.coins \|\| 0\}<\/Heading>\s*<\/VStack>/g, '<HStack color="yellow.600" justify="space-between" w="full">\n<Icon as={FaCoins} />\n<Text fontWeight="bold">Koin Dompet</Text>\n</HStack>\n<Heading size="2xl" color="yellow.700">{currency?.coins || 0}</Heading>\n</VStack>');

// We also need to add back the Dompet & Status heading + Notif that we removed accidentally
content = content.replace(/\{gachaStats\?\.canClaimDaily && \(/g, '<HStack>\n<Icon as={FaStore} color="brand.500" />\n<Heading size="sm" color="gray.700">Dompet & Status</Heading>\n<IconButton icon={<Icon as={FaBell} />} colorScheme="blue" variant="ghost" isRound onClick={() => navigate("/portal/notifikasi")} aria-label="Notifikasi" ml={4} />\n</HStack>\n{gachaStats?.canClaimDaily && (');

fs.writeFileSync('src/views/PortalPage/index.js', content);
