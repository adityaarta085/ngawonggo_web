import React, { useState } from 'react';
import { Box, Container, VStack, Heading, Text, Button, useToast, Icon, HStack, Badge, SimpleGrid, Input } from '@chakra-ui/react';
import { FaCrown, FaCreditCard, FaGift, FaCoins, FaArrowLeft, FaShare } from 'react-icons/fa';
import { useMonetization } from '../../../contexts/MonetizationContext';
import { useNavigate } from 'react-router-dom';

const TokoPage = () => {
    const { currency, tier, gachaStats, activateVipCard, purchaseVipDirect, giftVipCard } = useMonetization();
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
                <HStack justify="space-between" bg="white" p={6} borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100">
                    <VStack align="start" spacing={1}>
                        <Text color="gray.500" fontWeight="bold">Koin Anda</Text>
                        <HStack color="yellow.500">
                            <Icon as={FaCoins} boxSize={6} />
                            <Heading size="lg">{currency?.coins || 0}</Heading>
                        </HStack>
                    </VStack>
                    <Button colorScheme="yellow" onClick={() => navigate('/topup')}>Topup Koin</Button>
                </HStack>

                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <Box p={6} bg="gray.800" color="white" borderRadius="2xl" boxShadow="lg" _hover={{ transform: 'translateY(-4px)' }} transition="all 0.2s">
                        <VStack align="start" spacing={4}>
                            <Icon as={FaGift} boxSize={10} color="yellow.400" />
                            <Box>
                                <Heading size="md" mb={2}>Lucky Box Gacha</Heading>
                                <Text fontSize="sm" color="gray.300">Uji keberuntunganmu! Dapatkan VIP Card dengan harga murah.</Text>
                            </Box>
                            <Button w="full" colorScheme="yellow" onClick={() => navigate('/portal/toko/gacha')}>
                                Main Gacha (10 Koin)
                            </Button>
                        </VStack>
                    </Box>

                    <Box p={6} bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.200">
                        <VStack align="start" spacing={4}>
                            <Icon as={FaCrown} boxSize={10} color="purple.500" />
                            <Box>
                                <Heading size="md" mb={2}>Beli VIP Langsung</Heading>
                                <Text fontSize="sm" color="gray.500">Beli VIP Card (1 Bulan) tanpa gacha.</Text>
                            </Box>
                            <Button w="full" colorScheme="purple" variant="outline" onClick={purchaseVipDirect}>
                                Beli (500 Koin)
                            </Button>
                        </VStack>
                    </Box>

                    <Box p={6} bg="purple.50" borderRadius="2xl" border="1px solid" borderColor="purple.100">
                        <VStack align="start" spacing={4}>
                            <HStack w="full" justify="space-between">
                                <Icon as={FaCreditCard} boxSize={10} color="purple.600" />
                                <Badge colorScheme="purple" p={2} borderRadius="lg">
                                    Miliki: {gachaStats?.vip_cards || 0} Tiket
                                </Badge>
                            </HStack>
                            <Box>
                                <Heading size="md" mb={2}>VIP Card Kamu</Heading>
{tier?.name === "VIP" && <Badge colorScheme="red" mb={2}>VIP sudah aktif. Bagikan ke teman!</Badge>}
                                <Text fontSize="sm" color="gray.600">Gunakan tiket untuk diri sendiri atau bagikan ke teman.</Text>
                            </Box>
                            <HStack w="full">
                                <Button
                                    flex={1}
                                    colorScheme="purple"
                                    isDisabled={!gachaStats?.vip_cards || tier?.name === 'VIP'}
                                    onClick={activateVipCard}
                                >
                                    Pakai
                                </Button>
                            </HStack>

                            <Box w="full" pt={4} borderTop="1px dashed" borderColor="purple.200">
                                <Text fontSize="xs" fontWeight="bold" mb={2} color="purple.700">Bagikan ke Teman</Text>
                                <HStack>
                                    <Input
                                        size="sm"
                                        placeholder="Email teman..."
                                        value={giftEmail}
                                        onChange={(e) => setGiftEmail(e.target.value)}
                                        bg="white"
                                    />
                                    <Button
                                        size="sm"
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
