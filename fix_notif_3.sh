sed -i '/<HStack>/,/<\/HStack>/c \
              <HStack>\
                  <Icon as={FaStore} color="brand.500" />\
                  <Heading size="sm" color="gray.700">Dompet & Status</Heading>\
                  <IconButton icon={<Icon as={FaBell} />} colorScheme="blue" variant="ghost" isRound onClick={() => navigate("\/portal\/notifikasi")} aria-label="Notifikasi" ml={4} />\
              </HStack>' src/views/PortalPage/index.js
