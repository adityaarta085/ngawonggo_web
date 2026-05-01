sed -i '320,326d' src/views/PortalPage/index.js
sed -i '/<Flex direction={{ base: .column., md: .row. }} justify="space-between" align={{ base: .start., md: .center. }} gap={4} mb={6}>/a \
              <HStack>\
                  <Icon as={FaStore} color="brand.500" />\
                  <Heading size="sm" color="gray.700">Dompet & Status</Heading>\
              </HStack>\
              <HStack>\
                  <IconButton icon={<Icon as={FaBell} />} colorScheme="blue" variant="ghost" isRound onClick={() => navigate("\/portal\/notifikasi")} aria-label="Notifikasi" />\
' src/views/PortalPage/index.js
