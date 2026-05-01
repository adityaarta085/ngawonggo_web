const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/views/PortalPage/index.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Clean Imports & Hooks
content = content.replace("import { FaCoins, FaTicketAlt, FaCrown, FaStore, FaPaintBrush, FaMedal } from 'react-icons/fa';", "import { FaCoins, FaCrown, FaStore, FaPaintBrush, FaMedal, FaGift, FaTrophy, FaArrowRight, FaCreditCard } from 'react-icons/fa';");

content = content.replace("const { currency, tier, deductCurrency } = useMonetization();", "const { currency, tier, deductCurrency, gachaStats, claimDailyLogin, rollGacha, activateVipCard, purchaseVipDirect } = useMonetization();");

content = content.replace("const [feedback, setFeedback] = useState('');", "const [feedback, setFeedback] = useState('');\n  const [leaderboard, setLeaderboard] = useState([]);\n  const [gachaLoading, setGachaLoading] = useState(false);\n  const [claimLoading, setClaimLoading] = useState(false);");

// 2. Fetch Leaderboard inside useEffect
const fetchLeaderboardLogic = `    const getUserData = async () => {`;
const fetchLeaderboardLogicReplace = `    const getUserData = async () => {
      try {
        const { data: ld } = await supabase.from('leaderboard_view').select('*').limit(10);
        if(ld) setLeaderboard(ld);
      } catch(e) {}
`;
content = content.replace(fetchLeaderboardLogic, fetchLeaderboardLogicReplace);

// 3. New Economy Section replacing the old Dompet & Status
const oldEconomySectionSearch = `          {/* Economy Section */}
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
          </Box>`;

const newEconomySectionReplace = `          {/* Economy & Status Section */}
          <Box p={{ base: 6, md: 8 }} borderRadius="3xl" bg="white" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} gap={4} mb={6}>
              <HStack>
                  <Icon as={FaStore} color="brand.500" />
                  <Heading size="sm" color="gray.700">Dompet & Status</Heading>
              </HStack>
              {gachaStats?.canClaimDaily && (
                  <Button size="sm" colorScheme="yellow" leftIcon={<FaGift />} isLoading={claimLoading} onClick={async () => {
                      setClaimLoading(true);
                      await claimDailyLogin();
                      setClaimLoading(false);
                  }}>Klaim Daily Login (+10 Koin)</Button>
              )}
            </Flex>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <VStack p={4} bg="yellow.50" borderRadius="xl" align="start" border="1px solid" borderColor="yellow.100">
                    <HStack color="yellow.600" justify="space-between" w="full">
                        <HStack><Icon as={FaCoins} /><Text fontWeight="bold">Koin Desa</Text></HStack>
                        <IconButton size="xs" colorScheme="yellow" variant="ghost" icon={<FaCreditCard />} onClick={() => navigate('/donasi')} aria-label="Topup Koin" />
                    </HStack>
                    <Heading size="2xl" color="yellow.700">{currency?.coins || 0}</Heading>
                </VStack>
                <VStack p={4} bg="purple.50" borderRadius="xl" align="start" border="1px solid" borderColor="purple.100">
                    <HStack color="purple.600">
                        <Icon as={FaCrown} />
                        <Text fontWeight="bold">Tier Status</Text>
                    </HStack>
                    <Heading size="xl" color="purple.700">{tier?.name || 'Free'}</Heading>
                </VStack>
                <VStack p={4} bg="brand.50" borderRadius="xl" align="center" justify="center" as="button" onClick={onStoreOpen} _hover={{ bg: 'brand.100' }} transition="all 0.2s" border="1px solid" borderColor="brand.100">
                    <Icon as={FaStore} color="brand.500" boxSize={8} mb={1} />
                    <Text fontWeight="bold" color="brand.600" fontSize="md">Beli VIP & Gacha</Text>
                </VStack>
            </SimpleGrid>
          </Box>`;

content = content.replace(oldEconomySectionSearch, newEconomySectionReplace);

// 4. Leaderboard Section above Data Management
const dataManagementSearch = `{/* Data Management Section */}`;
const leaderboardSection = `{/* Papan Peringkat */}
          <Box p={{ base: 6, md: 8 }} borderRadius="3xl" bg="white" boxShadow="sm" border="1px solid" borderColor="gray.100">
            <HStack mb={6}>
                <Icon as={FaTrophy} color="yellow.400" boxSize={6} />
                <Heading size="md" color="gray.800">Sultan Koin & VIP (Leaderboard)</Heading>
            </HStack>
            {tier?.name !== 'VIP' ? (
                <Center p={8} bg="gray.50" borderRadius="xl" border="1px dashed" borderColor="gray.300">
                    <VStack spacing={3}>
                        <Icon as={FaLock} color="gray.400" boxSize={8} />
                        <Text color="gray.500" fontWeight="bold">Hanya untuk member VIP</Text>
                        <Button size="sm" colorScheme="purple" onClick={onStoreOpen}>Upgrade ke VIP</Button>
                    </VStack>
                </Center>
            ) : (
                <VStack align="stretch" spacing={3}>
                    {leaderboard.map((lb, i) => (
                        <Flex key={i} p={3} bg="gray.50" borderRadius="lg" justify="space-between" align="center">
                            <HStack>
                                <Badge colorScheme={i < 3 ? 'yellow' : 'gray'} borderRadius="full" w="24px" h="24px" display="flex" alignItems="center" justify="center">{i + 1}</Badge>
                                <Text fontWeight="bold">{lb.name || lb.email.split('@')[0]}</Text>
                                {lb.tier_name === 'VIP' && <Badge colorScheme="purple" fontSize="10px">VIP</Badge>}
                            </HStack>
                            <HStack color="yellow.500">
                                <Icon as={FaCoins} />
                                <Text fontWeight="bold">{lb.coins}</Text>
                            </HStack>
                        </Flex>
                    ))}
                    {leaderboard.length === 0 && <Text color="gray.500" fontSize="sm">Belum ada data Sultan.</Text>}
                </VStack>
            )}
          </Box>

          {/* Data Management Section */}`;

content = content.replace(dataManagementSearch, leaderboardSection);

// 5. Replace Old Store Modal with New Gacha / VIP Store
const oldStoreSearch = `<ModalHeader>Toko Profil (Kustomisasi)</ModalHeader>`;
const oldStoreBlockSearch = `<Modal isOpen={isStoreOpen} onClose={onStoreClose} size="xl" isCentered>
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
      </Modal>`;

const newStoreBlock = `<Modal isOpen={isStoreOpen} onClose={onStoreClose} size="xl" isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" bg="gray.50">
          <ModalHeader>Toko & Gacha VIP</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
                <HStack justify="space-between" bg="white" p={4} borderRadius="xl" boxShadow="sm">
                    <Text fontWeight="bold">Koin Anda:</Text>
                    <HStack color="yellow.500">
                        <Icon as={FaCoins} />
                        <Text fontWeight="bold" fontSize="lg">{currency?.coins || 0}</Text>
                        <Button size="xs" colorScheme="yellow" onClick={() => navigate('/donasi')}>Topup</Button>
                    </HStack>
                </HStack>

                <Box p={5} bgGradient="linear(to-r, purple.500, blue.500)" color="white" borderRadius="xl" boxShadow="md">
                    <VStack align="start" spacing={3}>
                        <HStack justify="space-between" w="full">
                            <HStack>
                                <Icon as={FaGift} boxSize={5} />
                                <Heading size="md">Lucky Box Gacha</Heading>
                            </HStack>
                            <Badge colorScheme="yellow">10 Koin / Pull</Badge>
                        </HStack>
                        <Text fontSize="sm" opacity={0.9}>Gacha untuk kesempatan mendapatkan VIP Card (1 Bulan). Kesempatan 2.5% setelah 30x percobaan. Dijamin dapat di percobaan ke-75!</Text>
                        <HStack w="full" justify="space-between" pt={2}>
                            <VStack align="start" spacing={0}>
                                <Text fontSize="xs" fontWeight="bold">Total Percobaan Anda:</Text>
                                <Text fontSize="lg" fontWeight="900">{gachaStats?.total_pulls || 0} / 75</Text>
                            </VStack>
                            <Button colorScheme="yellow" size="lg" isLoading={gachaLoading} onClick={async () => {
                                setGachaLoading(true);
                                await rollGacha();
                                setGachaLoading(false);
                            }}>Gacha Sekarang</Button>
                        </HStack>
                    </VStack>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box p={5} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <HStack mb={3}>
                            <Icon as={FaCrown} color="yellow.500" boxSize={6} />
                            <Heading size="sm">Beli VIP Langsung</Heading>
                        </HStack>
                        <Text fontSize="xs" color="gray.500" mb={4}>Tidak mau gacha? Beli tier VIP langsung selama 1 Bulan dengan koin.</Text>
                        <Button w="full" colorScheme="yellow" variant="outline" onClick={async () => {
                            await purchaseVipDirect();
                            onStoreClose();
                        }}>Beli (500 Koin)</Button>
                    </Box>

                    <Box p={5} bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" boxShadow="sm">
                        <HStack mb={3}>
                            <Icon as={FaCreditCard} color="purple.500" boxSize={6} />
                            <Heading size="sm">Tukar VIP Card</Heading>
                        </HStack>
                        <Text fontSize="xs" color="gray.500" mb={4}>Gunakan tiket VIP Card dari hasil gacha Anda.</Text>
                        <Button w="full" colorScheme="purple" isDisabled={!gachaStats?.vip_cards} onClick={async () => {
                            await activateVipCard();
                            onStoreClose();
                        }}>Tukar ({gachaStats?.vip_cards || 0} Tiket)</Button>
                    </Box>
                </SimpleGrid>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>`;

content = content.replace(oldStoreBlockSearch, newStoreBlock);

fs.writeFileSync(filePath, content);
console.log('Portal UI redesigned heavily.');
