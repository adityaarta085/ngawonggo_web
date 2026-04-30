const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/PortalPage/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add imports
content = content.replace(
    "import { supabase } from '../../lib/supabase';",
    "import { supabase } from '../../lib/supabase';\nimport { useMonetization } from '../../contexts/MonetizationContext';\nimport { FaCoins, FaTicketAlt, FaCrown, FaStore, FaPaintBrush, FaMedal } from 'react-icons/fa';"
);

// 2. Add Hooks & Store UI State
content = content.replace(
    "const [feedback, setFeedback] = useState('');",
    "const [feedback, setFeedback] = useState('');\n  const { currency, tier, deductCurrency } = useMonetization();\n  const { isOpen: isStoreOpen, onOpen: onStoreOpen, onClose: onStoreClose } = useDisclosure();"
);

// 3. Inject Store and Economy UI
const searchOverview = "{/* Activity Overview */}";
const economyUI = `          {/* Economy Section */}
          <Box p={{ base: 6, md: 8 }} borderRadius="3xl" bg="white" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <HStack mb={4}>
                <Icon as={FaStore} color="brand.500" />
                <Heading size="sm" color="gray.700">Dompet & Status</Heading>
            </HStack>
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                <VStack p={4} bg="yellow.50" borderRadius="xl" align="start">
                    <HStack color="yellow.600">
                        <Icon as={FaCoins} />
                        <Text fontWeight="bold">Koin</Text>
                    </HStack>
                    <Heading size="lg" color="yellow.700">{currency?.coins || 0}</Heading>
                </VStack>
                <VStack p={4} bg="blue.50" borderRadius="xl" align="start">
                    <HStack color="blue.600">
                        <Icon as={FaTicketAlt} />
                        <Text fontWeight="bold">Tiket</Text>
                    </HStack>
                    <Heading size="lg" color="blue.700">{currency?.tickets || 0}</Heading>
                </VStack>
                <VStack p={4} bg="purple.50" borderRadius="xl" align="start">
                    <HStack color="purple.600">
                        <Icon as={FaCrown} />
                        <Text fontWeight="bold">Tier</Text>
                    </HStack>
                    <Heading size="md" color="purple.700">{tier?.name || 'Free'}</Heading>
                </VStack>
                <VStack p={4} bg="brand.50" borderRadius="xl" align="center" justify="center" as="button" onClick={onStoreOpen} _hover={{ bg: 'brand.100' }} transition="all 0.2s">
                    <Icon as={FaStore} color="brand.500" boxSize={6} mb={1} />
                    <Text fontWeight="bold" color="brand.600" fontSize="sm">Buka Toko</Text>
                </VStack>
            </SimpleGrid>
          </Box>

          {/* Activity Overview */}`;

content = content.replace(searchOverview, economyUI);

// 4. Inject Modal for the Store
const searchModal = "{/* Deletion Modal */}";
const storeModal = `{/* Store Modal */}
      <Modal isOpen={isStoreOpen} onClose={onStoreClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" bg="gray.50">
          <ModalHeader>Toko Profil (Kustomisasi)</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
                <HStack justify="space-between" bg="white" p={4} borderRadius="xl" boxShadow="sm">
                    <Text fontWeight="bold">Koin Anda:</Text>
                    <HStack color="yellow.500">
                        <Icon as={FaCoins} />
                        <Text fontWeight="bold" fontSize="lg">{currency?.coins || 0}</Text>
                    </HStack>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box p={5} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
                        <HStack mb={3}>
                            <Icon as={FaPaintBrush} color="blue.500" />
                            <Heading size="sm">Tema Gelap (Dark Mode)</Heading>
                        </HStack>
                        <Text fontSize="sm" color="gray.500" mb={4}>Ubah tampilan portal Anda menjadi elegan dan eksklusif.</Text>
                        <Button w="full" colorScheme="yellow" onClick={() => deductCurrency(100, 'coins', 'Tema Gelap')}>Beli - 100 Koin</Button>
                    </Box>
                    <Box p={5} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.100" boxShadow="sm">
                        <HStack mb={3}>
                            <Icon as={FaMedal} color="purple.500" />
                            <Heading size="sm">Badge VIP Eksklusif</Heading>
                        </HStack>
                        <Text fontSize="sm" color="gray.500" mb={4}>Tampil menonjol di papan peringkat dan komentar.</Text>
                        <Button w="full" colorScheme="yellow" onClick={() => deductCurrency(500, 'coins', 'Badge VIP')}>Beli - 500 Koin</Button>
                    </Box>
                </SimpleGrid>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Deletion Modal */}`;

content = content.replace(searchModal, storeModal);

fs.writeFileSync(filePath, content);
console.log("Portal UI patched.");
