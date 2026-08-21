import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Icon,
  Badge,
  SimpleGrid,
  useToast,
  keyframes,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex
} from '@chakra-ui/react';
import { FaCoins, FaCrown, FaGift, FaArrowLeft, FaHistory, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useMonetization } from '../../contexts/MonetizationContext';
import { SEO } from '../../components';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const PRIZES = [
  { id: 1, label: '5 Koin', color: '#3B82F6', icon: FaCoins, value: 5 },
  { id: 2, label: '10 Koin', color: '#10B981', icon: FaCoins, value: 10 },
  { id: 3, label: '20 Koin', color: '#F59E0B', icon: FaCoins, value: 20 },
  { id: 4, label: '50 Koin', color: '#EC4899', icon: FaCoins, value: 50 },
  { id: 5, label: 'JACKPOT 100 KOIN', color: '#8B5CF6', icon: FaStar, value: 100 },
  { id: 6, label: 'VIP Card (1 Bulan)', color: '#EF4444', icon: FaCrown, value: 'VIP' },
];

const LuckyWheelPage = () => {
  const { currency, isVIP, spinStats, spinLuckyWheel, settings } = useMonetization();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [recentWins, setRecentWins] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();
  const wheelRef = useRef(null);

  const spinCost = settings.spin_cost_coins || 10;
  const isFree = spinStats?.canFreeSpin;

  const handleSpin = async () => {
    if (isSpinning) return;

    if (!isFree && currency.coins < spinCost) {
      toast({
        title: 'Koin Tidak Cukup',
        description: `Anda butuh ${spinCost} Koin untuk memutar roda keberuntungan. Silakan topup di Kios Koin Desa.`,
        status: 'warning',
        duration: 4000,
      });
      return;
    }

    setIsSpinning(true);
    setWonPrize(null);

    // Call Supabase RPC
    const result = await spinLuckyWheel();

    if (!result || !result.success) {
      setIsSpinning(false);
      return;
    }

    // Determine target slice angle based on prize
    let targetIndex = 0;
    if (result.prize_type === 'vip_card') {
      targetIndex = 5;
    } else {
      if (result.prize_value === 5) targetIndex = 0;
      else if (result.prize_value === 10) targetIndex = 1;
      else if (result.prize_value === 20) targetIndex = 2;
      else if (result.prize_value === 50) targetIndex = 3;
      else if (result.prize_value === 100) targetIndex = 4;
    }

    const sliceAngle = 360 / PRIZES.length;
    // Calculate new rotation: multiple full rotations + target slice offset
    const randomExtraRotations = (5 + Math.floor(Math.random() * 3)) * 360;
    const targetAngle = 360 - (targetIndex * sliceAngle + sliceAngle / 2);
    const newTotalRotation = rotation + randomExtraRotations + (targetAngle - (rotation % 360));

    setRotation(newTotalRotation);

    // Wait for wheel animation to finish (4s)
    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(result);
      setIsResultOpen(true);
      setRecentWins(prev => [
        { label: result.prize_label, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4)
      ]);
    }, 4200);
  };

  return (
    <Box minH="100vh" bg="gray.900" color="white" py={{ base: 24, md: 32 }} position="relative" overflow="hidden">
      <SEO title="Roda Keberuntungan Desa | Lucky Wheel" description="Putar roda keberuntungan setiap hari untuk memenangkan Koin Desa dan VIP Card gratis." />

      <Container maxW="container.lg">
        <Button leftIcon={<FaArrowLeft />} variant="ghost" color="whiteAlpha.800" onClick={() => navigate('/portal/toko')} mb={6}>
          Kembali ke Toko
        </Button>

        <VStack spacing={8} align="stretch">
          {/* Header Banner */}
          <Box
            p={{ base: 6, md: 8 }}
            bgGradient="linear(to-r, purple.900, brand.900, blue.900)"
            borderRadius="3xl"
            borderWidth="1px"
            borderColor="purple.500"
            boxShadow="0 20px 50px rgba(147, 51, 234, 0.3)"
            textAlign="center"
          >
            <VStack spacing={3}>
              <Badge colorScheme="yellow" fontSize="sm" px={4} py={1} borderRadius="full">
                🎡 MINIGAME KEBERUNTUNGAN DESA
              </Badge>
              <Heading size="2xl" bgGradient="linear(to-r, yellow.300, orange.400, purple.300)" bgClip="text" fontWeight="900">
                RODA KEBERUNTUNGAN
              </Heading>
              <Text color="gray.300" maxW="xl" mx="auto" fontSize="md">
                Putar roda setiap hari! Dapatkan kesempatan meraih hingga <Text as="span" color="yellow.400" fontWeight="bold">100 Koin Jackpot</Text> atau <Text as="span" color="purple.300" fontWeight="bold">VIP Card 1 Bulan</Text>.
              </Text>

              {/* Status Bar */}
              <HStack spacing={4} pt={2} flexWrap="wrap" justify="center">
                <HStack bg="blackAlpha.600" px={4} py={2} borderRadius="xl" border="1px solid" borderColor="yellow.500">
                  <Icon as={FaCoins} color="yellow.400" />
                  <Text fontSize="sm" color="gray.300">Koin Anda:</Text>
                  <Text fontSize="lg" fontWeight="bold" color="yellow.300">{currency?.coins || 0}</Text>
                </HStack>

                <HStack bg="blackAlpha.600" px={4} py={2} borderRadius="xl" border="1px solid" borderColor="purple.500">
                  <Icon as={FaCrown} color="purple.400" />
                  <Text fontSize="sm" color="gray.300">Status Tier:</Text>
                  <Text fontSize="lg" fontWeight="bold" color="purple.300">{isVIP ? 'VIP Member' : 'Free Member'}</Text>
                </HStack>
              </HStack>
            </VStack>
          </Box>

          <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} alignItems="center">
            {/* Left Column: Rules & Stats */}
            <VStack spacing={4} align="stretch">
              <Box p={6} bg="gray.800" borderRadius="2xl" borderWidth="1px" borderColor="gray.700">
                <Heading size="sm" mb={3} color="yellow.400" display="flex" alignItems="center" gap={2}>
                  <Icon as={FaStar} /> Aturan Hadiah
                </Heading>
                <VStack align="start" spacing={2} fontSize="xs" color="gray.300">
                  <HStack><Badge colorScheme="blue">35%</Badge><Text>5 Koin Desa</Text></HStack>
                  <HStack><Badge colorScheme="green">30%</Badge><Text>10 Koin Desa</Text></HStack>
                  <HStack><Badge colorScheme="yellow">20%</Badge><Text>20 Koin Desa</Text></HStack>
                  <HStack><Badge colorScheme="pink">10%</Badge><Text>50 Koin Desa</Text></HStack>
                  <HStack><Badge colorScheme="purple">3%</Badge><Text>JACKPOT 100 Koin!</Text></HStack>
                  <HStack><Badge colorScheme="red">2%</Badge><Text>1x VIP Card (1 Bulan)</Text></HStack>
                </VStack>
              </Box>

              <Box p={6} bg="gray.800" borderRadius="2xl" borderWidth="1px" borderColor="gray.700">
                <Heading size="sm" mb={3} color="purple.400" display="flex" alignItems="center" gap={2}>
                  <Icon as={FaHistory} /> Riwayat Putaran Anda
                </Heading>
                {recentWins.length === 0 ? (
                  <Text fontSize="xs" color="gray.500">Belum ada putaran dalam sesi ini.</Text>
                ) : (
                  <VStack align="start" spacing={2}>
                    {recentWins.map((win, idx) => (
                      <HStack key={idx} justify="space-between" w="full" fontSize="xs">
                        <Text color="yellow.300">🎁 {win.label}</Text>
                        <Text color="gray.500">{win.time}</Text>
                      </HStack>
                    ))}
                  </VStack>
                )}
              </Box>
            </VStack>

            {/* Middle: Wheel Interface */}
            <VStack spacing={6} align="center" position="relative">
              {/* Pointer Arrow */}
              <Box
                position="absolute"
                top="-15px"
                zIndex={10}
                w={0}
                h={0}
                borderLeft="18px solid transparent"
                borderRight="18px solid transparent"
                borderTop="32px solid #EF4444"
                filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
              />

              {/* Wheel Circular Canvas / SVG */}
              <Box
                ref={wheelRef}
                w={{ base: "280px", sm: "340px", md: "360px" }}
                h={{ base: "280px", sm: "340px", md: "360px" }}
                borderRadius="full"
                border="8px solid #F59E0B"
                boxShadow="0 0 40px rgba(245, 158, 11, 0.4), inset 0 0 20px rgba(0,0,0,0.6)"
                position="relative"
                overflow="hidden"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
                }}
              >
                {/* SVG Segments */}
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                  {PRIZES.map((prize, i) => {
                    const angle = 360 / PRIZES.length;
                    const startAngle = i * angle;
                    const endAngle = (i + 1) * angle;

                    const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                    const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                    const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                    const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                    const textAngle = startAngle + angle / 2;
                    const tx = 50 + 32 * Math.cos((Math.PI * textAngle) / 180);
                    const ty = 50 + 32 * Math.sin((Math.PI * textAngle) / 180);

                    return (
                      <g key={prize.id}>
                        <path
                          d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                          fill={prize.color}
                          stroke="#1F2937"
                          strokeWidth="0.5"
                        />
                        <text
                          x={tx}
                          y={ty}
                          fill="#FFFFFF"
                          fontSize="4"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                        >
                          {prize.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Center Hub */}
                <Center
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  w="50px"
                  h="50px"
                  borderRadius="full"
                  bg="yellow.400"
                  border="4px solid #1F2937"
                  boxShadow="0 0 10px rgba(0,0,0,0.5)"
                  zIndex={5}
                >
                  <Icon as={FaGift} color="gray.900" boxSize={5} />
                </Center>
              </Box>

              {/* Action Spin Button */}
              <Button
                size="lg"
                h="60px"
                px={10}
                fontSize="xl"
                fontWeight="900"
                colorScheme={isFree ? "green" : "yellow"}
                bgGradient={isFree ? "linear(to-r, green.400, teal.500)" : "linear(to-r, yellow.400, orange.500)"}
                color="gray.950"
                shadow="2xl"
                borderRadius="full"
                isLoading={isSpinning}
                loadingText="Memutar..."
                onClick={handleSpin}
                _hover={{
                  transform: 'scale(1.06)',
                  boxShadow: '0 0 30px rgba(245, 158, 11, 0.6)'
                }}
                transition="all 0.2s"
              >
                {isFree ? 'PUTAR GRATIS HARI INI 🎁' : `PUTAR (${spinCost} KOIN) 🎲`}
              </Button>

              <Text fontSize="xs" color="gray.400">
                {isFree ? '✨ Anda memiliki 1x kesempatan putar gratis hari ini!' : `💡 Putaran berikutnya menggunakan ${spinCost} Koin Desa.`}
              </Text>
            </VStack>

            {/* Right Column: Shortcut Actions */}
            <VStack spacing={4} align="stretch">
              <Box p={6} bg="purple.900" borderRadius="2xl" borderWidth="1px" borderColor="purple.500" textAlign="center">
                <Icon as={FaCrown} boxSize={10} color="yellow.400" mb={3} />
                <Heading size="sm" mb={2}>Beli VIP Langsung</Heading>
                <Text fontSize="xs" color="purple.200" mb={4}>
                  Nikmati semua fitur tanpa batas kuota dengan menjadi member VIP.
                </Text>
                <Button size="sm" colorScheme="purple" w="full" onClick={() => navigate('/portal/toko')}>
                  Buka Toko VIP
                </Button>
              </Box>

              <Box p={6} bg="yellow.950" borderRadius="2xl" borderWidth="1px" borderColor="yellow.600" textAlign="center">
                <Icon as={FaCoins} boxSize={10} color="yellow.400" mb={3} />
                <Heading size="sm" mb={2}>Isi Ulang Koin Desa</Heading>
                <Text fontSize="xs" color="yellow.200" mb={4}>
                  Topup instan via QRIS mulai dari Rp 5.000 untuk ratusan koin.
                </Text>
                <Button size="sm" colorScheme="yellow" color="gray.900" w="full" onClick={() => navigate('/topup')}>
                  Kios Topup QRIS
                </Button>
              </Box>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>

      {/* Result Modal */}
      <Modal isOpen={isResultOpen} onClose={() => setIsResultOpen(false)} isCentered size="md">
        <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.800" />
        <ModalContent bg="gray.850" color="white" borderRadius="3xl" borderWidth="2px" borderColor="yellow.400" overflow="hidden">
          <ModalHeader textAlign="center" pt={6} pb={0}>
            <Heading size="lg" color="yellow.400">🎉 SELAMAT! 🎉</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6} textAlign="center">
            <VStack spacing={5}>
              <Icon
                as={wonPrize?.prize_type === 'vip_card' ? FaCrown : FaCoins}
                boxSize={16}
                color={wonPrize?.prize_type === 'vip_card' ? "purple.400" : "yellow.400"}
                animation={`${pulseAnimation} 1.5s infinite`}
              />
              <VStack spacing={1}>
                <Text fontSize="sm" color="gray.400">Anda berhasil memenangkan:</Text>
                <Heading size="xl" color="yellow.300">{wonPrize?.prize_label}</Heading>
              </VStack>

              <Box p={4} bg="whiteAlpha.100" borderRadius="xl" w="full">
                <HStack justify="space-between" fontSize="sm">
                  <Text color="gray.300">Saldo Koin Baru:</Text>
                  <Text fontWeight="bold" color="yellow.400">{wonPrize?.new_coins} Koin</Text>
                </HStack>
              </Box>

              <HStack w="full" spacing={3}>
                <Button flex={1} colorScheme="yellow" onClick={() => setIsResultOpen(false)}>
                  Tutup
                </Button>
                {wonPrize?.prize_type === 'vip_card' && (
                  <Button flex={1} colorScheme="purple" onClick={() => navigate('/portal/toko')}>
                    Cek Tas VIP
                  </Button>
                )}
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Helper Center Component
const Center = ({ children, ...props }) => (
  <Flex align="center" justify="center" {...props}>
    {children}
  </Flex>
);

export default LuckyWheelPage;
