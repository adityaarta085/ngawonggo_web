const fs = require('fs');

let content = fs.readFileSync('src/views/PortalPage/GachaPage/index.js', 'utf8');

// Replace the Gacha component entirely to make it look much cooler and remove pity stats
content = `import React, { useState, useEffect } from 'react';
import { Box, Container, VStack, Heading, Text, Button, useToast, Icon, HStack, Badge, Center, keyframes } from '@chakra-ui/react';
import { FaGift, FaCoins, FaCrown, FaArrowLeft, FaStar } from 'react-icons/fa';
import { useMonetization } from '../../../contexts/MonetizationContext';
import { useNavigate } from 'react-router-dom';

const spinAnimation = keyframes\`
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
\`;

const GachaPage = () => {
    const { currency, gachaStats, rollGacha } = useMonetization();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleGacha = async () => {
        setIsAnimating(true);
        setLoading(true);
        setResult(null);

        // Simulate dramatic delay for gacha
        await new Promise(r => setTimeout(r, 1500));

        const data = await rollGacha();

        setIsAnimating(false);
        setLoading(false);
        if (data) {
            setResult(data);
            if (data.won) {
                 // Trigger some confetti or cool effect theoretically
                 const audio = new Audio('/win-sound.mp3'); // Optional if exists
                 audio.play().catch(e=>console.log("Audio not played", e));
            }
        }
    };

    return (
        <Container maxW="container.md" py={8}>
            <Button leftIcon={<FaArrowLeft />} variant="ghost" onClick={() => navigate('/portal/toko')} mb={4}>
                Kembali ke Toko
            </Button>
            <VStack spacing={6} align="stretch">
                <Box
                    p={8}
                    bg="gray.900"
                    color="white"
                    borderRadius="3xl"
                    textAlign="center"
                    position="relative"
                    overflow="hidden"
                    boxShadow="2xl"
                    border="2px solid"
                    borderColor="purple.500"
                >
                    <Box position="absolute" top="-50%" left="-50%" w="200%" h="200%" bgGradient="conic(from 0deg, transparent 0deg, purple.500 180deg, transparent 360deg)" opacity={0.1} animation={\`\${spinAnimation} 10s linear infinite\`} zIndex={0} />

                    <VStack zIndex={1} position="relative" spacing={6}>
                        <Icon
                            as={FaGift}
                            boxSize={isAnimating ? 24 : 20}
                            color={isAnimating ? "yellow.300" : "yellow.400"}
                            animation={isAnimating ? \`\${spinAnimation} 0.5s infinite\` : "none"}
                            transition="all 0.2s"
                        />
                        <Box>
                            <Heading size="xl" bgGradient="linear(to-r, yellow.400, orange.400)" bgClip="text" fontWeight="900">
                                LUCKY BOX GACHA
                            </Heading>
                            <Text color="gray.300" mt={2} fontSize="lg">
                                Dapatkan kesempatan memenangkan <Text as="span" color="purple.300" fontWeight="bold">VIP Card (1 Bulan)</Text>!
                            </Text>
                        </Box>

                        <Badge colorScheme="yellow" p={3} borderRadius="xl" fontSize="lg" border="1px solid" borderColor="yellow.200">
                            <HStack><Icon as={FaCoins} /><Text>10 Koin / Putar</Text></HStack>
                        </Badge>

                        <Button
                            colorScheme="purple"
                            size="lg"
                            h="60px"
                            mt={4}
                            isLoading={loading}
                            loadingText="Membuka..."
                            onClick={handleGacha}
                            w="full"
                            maxW="sm"
                            shadow="lg"
                            fontSize="xl"
                            fontWeight="bold"
                            bgGradient="linear(to-r, purple.500, blue.500)"
                            _hover={{ transform: 'scale(1.05)', shadow: 'xl', bgGradient: "linear(to-r, purple.400, blue.400)" }}
                            transition="all 0.2s"
                        >
                            PUTAR SEKARANG
                        </Button>
                    </VStack>
                </Box>

                {result && (
                    <Box
                        p={8}
                        bg={result.won ? "yellow.50" : "gray.50"}
                        borderRadius="3xl"
                        border="2px solid"
                        borderColor={result.won ? "yellow.400" : "gray.200"}
                        textAlign="center"
                        animation="pulse 2s infinite"
                    >
                        <VStack spacing={4}>
                            {result.won ? (
                                <>
                                    <Icon as={FaCrown} boxSize={16} color="yellow.500" />
                                    <Heading size="xl" color="yellow.600">SELAMAT!</Heading>
                                    <Text fontSize="lg" fontWeight="bold">Anda memenangkan 1x VIP Card!</Text>
                                    <Button colorScheme="yellow" onClick={() => navigate('/portal/toko')}>Cek Tas Saya</Button>
                                </>
                            ) : (
                                <>
                                    <Icon as={FaStar} boxSize={12} color="gray.400" />
                                    <Heading size="lg" color="gray.600">ZONK!</Heading>
                                    <Text fontSize="md">Sayang sekali, keberuntungan belum berpihak. Coba lagi!</Text>
                                </>
                            )}
                        </VStack>
                    </Box>
                )}
            </VStack>
        </Container>
    );
};

export default GachaPage;
`;

fs.writeFileSync('src/views/PortalPage/GachaPage/index.js', content);
