sed -i 's/import { FaCoins, FaLock/import { FaCoins, FaLock, FaBell/g' src/views/PortalPage/index.js
sed -i '/Dompet & Status<\/Heading>/i \
                  <IconButton icon={<Icon as={FaBell} />} colorScheme="blue" variant="ghost" isRound onClick={() => navigate("\/portal\/notifikasi")} />\
' src/views/PortalPage/index.js
