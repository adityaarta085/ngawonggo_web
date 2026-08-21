import React, { useState } from 'react';
import { Box, Container, VStack, Heading, Text, Button, Icon, HStack, Badge, SimpleGrid, Input } from '@chakra-ui/react';
import { FaCrown, FaCreditCard, FaGift, FaCoins, FaArrowLeft, FaShare, FaStar } from 'react-icons/fa';
import { useMonetization } from '../../../contexts/MonetizationContext';
import { useNavigate } from 'react-router-dom';

const TokoPage = () => {
    const { currency, tier, gachaStats, spinStats, activateVipCard, purchaseVipDirect, giftVipCard, settings } = useMonetization();
    const navigate = useNavigate();
    const [giftEmail, setGiftEmail] = useState('');
    const [isGifting, setIsGifting] = useState(false);

    const handleGift = async () => {
        if (!giftEmail) return;
        setIsGifting(true);
        await giftVipCard(giftEmail);
        setIsGifting(false);
        setGiftEmail('');
    };

    return (
        <Container maxW="container.lg" py={8}>
            <Button leftIcon={<FaArrowLeft />} variant="ghost" onClick={() => navigate('/portal')} mb={4}>
                Kembali ke Portal
            </Button>

            <VStack spacing={8} align="stretch">
                <HStack justify="space-between" bg="white" _dark={{ bg: "gray.800" }} p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" flexWrap="wrap" gap={4}>
                    <VStack align="start" spacing={1}>
                        <Text color="gray.500" fontWeight="bold">Koin Desa Anda</Text>
                        <HStack color="yellow.500">
                            <Icon as={FaCoins} boxSize={6} />
                            <Heading size="lg">{currency?.coins || 0}</Heading>
                        </HStack>
                    </VStack>
                    <HStack spacing={3}>
                        <Button colorScheme="yellow" onClick={() => navigate('/topup')}>Topup Koin QRIS</Button>
                    </HStack>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                    {/* Card 1: Lucky Wheel */}
                    <Box p={6} bg="purple.900" color="white" borderRadius="2xl" boxShadow="lg" _hover={{ transform: 'translateY(-4px)' }} transition="all 0.2s" border="1px solid" borderColor="purple.500">
                        <VStack align="start" spacing={4}>
                            <HStack justify="space-between" w="full">
                                <Icon as={FaStar} boxSize={8} color="yellow.400" />
                                {spinStats?.canFreeSpin && (
                                    <Badge colorScheme="green" px={2} py={1} borderRadius="full">GRATIS HARI INI</Badge>
                                )}
                            </HStack>
                            <Box>
                                <Heading size="md" mb={2}>Roda Keberuntungan</Heading>
                                <Text fontSize="xs" color="purple.200">Putar roda dan dapatkan koin jackpot atau tiket VIP!</Text>
                            </Box>
                            <Button w="full" colorScheme="yellow" onClick={() => navigate('/portal/toko/lucky-wheel')}>
                                {spinStats?.canFreeSpin ? 'Putar Gratis' : `Putar (${settings?.spin_cost_coins || 10} Koin)`}
                            </Button>
                        </VStack>
                    </Box>

                    {/* Card 2: Lucky Box Gacha */}
                    <Box p={6} bg="gray.800" color="white" borderRadius="2xl" boxShadow="lg" _hover={{ transform: 'translateY(-4px)' }} transition="all 0.2s">
                        <VStack align="start" spacing={4}>
                            <Icon as={FaGift} boxSize={8} color="yellow.400" />
                            <Box>
                                <Heading size="md" mb={2}>Lucky Box Gacha</Heading>
                                <Text fontSize="xs" color="gray.300">Uji keberuntunganmu! Dapatkan VIP Card dengan pity system.</Text>
                            </Box>
                            <Button w="full" colorScheme="yellow" variant="outline" onClick={() => navigate('/portal/toko/gacha')}>
                                Main Gacha (10 Koin)
                            </Button>
                        </VStack>
                    </Box>

                    {/* Card 3: Beli VIP Langsung */}
                    <Box p={6} bg="white" _dark={{ bg: "gray.800" }} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.200">
                        <VStack align="start" spacing={4}>
                            <Icon as={FaCrown} boxSize={8} color="purple.500" />
                            <Box>
                                <Heading size="md" mb={2}>Beli VIP Langsung</Heading>
                                <Text fontSize="xs" color="gray.500">Beli VIP Card (1 Bulan) tanpa gacha. Masuk ke tas Anda.</Text>
                            </Box>
                            <Button w="full" colorScheme="purple" variant="outline" onClick={purchaseVipDirect}>
                                Beli ({settings?.badge_vip_price || 500} Koin)
                            </Button>
                        </VStack>
                    </Box>

                    {/* Card 4: VIP Backpack & Gift */}
                    <Box p={6} bg="purple.50" _dark={{ bg: "purple.950" }} borderRadius="2xl" border="1px solid" borderColor="purple.200">
                        <VStack align="start" spacing={3}>
                            <HStack w="full" justify="space-between">
                                <Icon as={FaCreditCard} boxSize={7} color="purple.600" />
                                <Badge colorScheme="purple" p={1.5} borderRadius="md" fontSize="xs">
                                    Tas: {gachaStats?.vip_cards || 0} Tiket
                                </Badge>
                            </HStack>
                            <Box>
                                <Heading size="sm" mb={1}>Tas VIP Card</Heading>
                                {tier?.name === "VIP" && <Badge colorScheme="green" fontSize="2xs" mb={1}>VIP Aktif</Badge>}
                                <Text fontSize="2xs" color="gray.600" _dark={{ color: "gray.400" }}>Pakai untuk diri sendiri atau kirim ke teman.</Text>
                            </Box>
                            <Button
                                w="full"
                                size="sm"
                                colorScheme="purple"
                                isDisabled={!gachaStats?.vip_cards || tier?.name === 'VIP'}
                                onClick={activateVipCard}
                            >
                                Aktifkan VIP
                            </Button>

                            <Box w="full" pt={2} borderTop="1px dashed" borderColor="purple.300">
                                <Text fontSize="2xs" fontWeight="bold" mb={1} color="purple.700" _dark={{ color: "purple.300" }}>Kirim ke Teman</Text>
                                <HStack>
                                    <Input
                                        size="xs"
                                        placeholder="Email penerima..."
                                        value={giftEmail}
                                        onChange={(e) => setGiftEmail(e.target.value)}
                                        bg="white" _dark={{ bg: "gray.800" }}
                                    />
                                    <Button
                                        size="xs"
                                        colorScheme="blue"
                                        isDisabled={!gachaStats?.vip_cards || !giftEmail}
                                        isLoading={isGifting}
                                        onClick={handleGift}
                                    >
                                        <Icon as={FaShare} />
                                    </Button>
                                </HStack>
                            </Box>
                        </VStack>
                    </Box>
                </SimpleGrid>
            </VStack>
        </Container>
    );
};

export default TokoPage;
