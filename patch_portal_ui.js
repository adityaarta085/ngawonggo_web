const fs = require('fs');

let portal = fs.readFileSync('src/views/PortalPage/index.js', 'utf8');

const modalUI = `
          {/* Data Management Section */}
          <Box
            p={{ base: 6, md: 8 }}
            borderRadius="3xl"
            bg="white"
            boxShadow="sm"
            border="1px solid"
            borderColor="red.100"
          >
            <VStack align="start" spacing={4}>
                <HStack>
                    <Icon as={FaExclamationTriangle} color="red.500" boxSize={6} />
                    <Heading size="md" color="gray.800">Manajemen Data & Privasi</Heading>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                    Anda memegang kendali atas data Anda. Penghapusan data memerlukan verifikasi demi keamanan. Apabila perangkat Anda tidak aktif, silakan gunakan metode fallback email atau hubungi administrator melalui kontak di bagian bawah halaman.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                    <Button
                        colorScheme="red"
                        variant="outline"
                        onClick={() => openDeletionModal('whatsapp')}
                        isDisabled={!user?.user_metadata?.whatsapp_verified}
                        h="50px"
                    >
                        Hapus Verifikasi WhatsApp
                    </Button>
                    <Button
                        colorScheme="red"
                        variant="solid"
                        onClick={() => openDeletionModal('account')}
                        h="50px"
                    >
                        Hapus Akun Permanen
                    </Button>
                </SimpleGrid>
            </VStack>
          </Box>
`;

if (!portal.includes('Manajemen Data & Privasi')) {
    const insertPoint = '{/* Benefits Info Card */}';
    portal = portal.replace(insertPoint, modalUI + '\n          ' + insertPoint);
    fs.writeFileSync('src/views/PortalPage/index.js', portal);
}
