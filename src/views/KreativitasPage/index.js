import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Image,
  Flex,
    Badge,
  Spinner,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FaMagic, FaDownload, FaPaintBrush } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { SEO } from '../../components';

const MotionBox = motion(Box);

export default function KreativitasPage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  const templates = [
    "NARUTO UZUMAKI",
    "Pemandangan desa di pagi hari yang cerah dengan gaya studio ghibli",
    "Futuristic cyberpunk city street at night with neon lights",
    "A cute cat wearing astronaut suit on the moon"
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImageUrl(null);

    // Simulate API call loading time before showing the image to allow loader to show
    setTimeout(() => {
        setGeneratedImageUrl(`https://api-faa.my.id/faa/ai-text2img-pro?prompt=${encodeURIComponent(prompt)}`);
        setIsGenerating(false);
    }, 1500); // 1.5 seconds artificial delay for dramatic effect
  };

  const handleTemplateClick = (text) => {
    setPrompt(text);
  };

  const bgGradient = useColorModeValue(
    "linear(to-br, brand.50, purple.50, pink.50)",
    "linear(to-br, gray.900, purple.900, brand.900)"
  );
  const cardBg = useColorModeValue("whiteAlpha.900", "blackAlpha.600");

  return (
    <Box pt={0} minH="100vh" bgGradient={bgGradient} pb={32}>
      <SEO
        title="Kreativitas Tanpa Batas"
        description="Fitur Text-to-Image Super Realistis Desa Ngawonggo."
      />

      {/* Hero Header */}
      <Box pt={{ base: 28, md: 36 }} pb={{ base: 12, md: 20 }} position="relative" overflow="hidden">
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack spacing={6} textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Badge colorScheme="purple" variant="solid" px={4} py={1} borderRadius="full" mb={4} fontWeight="900" letterSpacing="widest" bgGradient="linear(to-r, purple.400, pink.400)">
                NEW FREE FEATURE
              </Badge>
              <Heading size="3xl" mb={4} fontWeight="900" bgGradient="linear(to-r, purple.400, brand.500)" bgClip="text">
                Kreativitas <Text as="span" color={useColorModeValue('gray.800', 'white')}>Tanpa Batas</Text>
              </Heading>
              <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')} maxW="3xl" mx="auto" lineHeight="tall">
                Wujudkan imajinasimu menjadi karya seni visual yang super realistis dan menakjubkan hanya dengan beberapa kata. Menggambarkan kreativitas, emosi, dan inovasi!
              </Text>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      <Container maxW="container.xl">
        <Flex direction={{ base: "column", lg: "row" }} gap={10} align="flex-start">

          {/* Main Content Area */}
          <Box flex={1} w="full">
            <VStack spacing={8} align="stretch">

              {/* Input Section */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                p={8}
                borderRadius="3xl"
                bg={cardBg}
                boxShadow="2xl"
                backdropFilter="blur(20px)"
                border="1px solid"
                borderColor={useColorModeValue("white", "whiteAlpha.200")}
              >
                <VStack spacing={6} align="stretch">
                  <Flex gap={4} direction={{ base: "column", md: "row" }}>
                    <Input
                      placeholder="Deskripsikan gambar imajinasimu di sini..."
                      size="lg"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                      borderRadius="xl"
                      bg={useColorModeValue("gray.50", "whiteAlpha.100")}
                      border={0}
                      _focus={{ ring: 2, ringColor: "purple.400" }}
                    />
                    <Button
                      size="lg"
                      colorScheme="purple"
                      bgGradient="linear(to-r, purple.500, pink.500)"
                      _hover={{ bgGradient: "linear(to-r, purple.600, pink.600)", transform: "translateY(-2px)", boxShadow: "xl" }}
                      px={8}
                      borderRadius="xl"
                      onClick={handleGenerate}
                      isLoading={isGenerating}
                      leftIcon={<FaMagic />}
                    >
                      Generate Gambar
                    </Button>
                  </Flex>

                  <Box>
                    <Text fontSize="sm" fontWeight="bold" color="gray.500" mb={3}>Template Prompt Inspirasi:</Text>
                    <Flex wrap="wrap" gap={3}>
                      {templates.map((tpl, idx) => (
                        <Badge
                          key={idx}
                          px={4}
                          py={2}
                          borderRadius="full"
                          colorScheme="purple"
                          variant="subtle"
                          cursor="pointer"
                          _hover={{ bg: "purple.100", transform: "scale(1.05)" }}
                          onClick={() => handleTemplateClick(tpl)}
                          transition="all 0.2s"
                        >
                          {tpl}
                        </Badge>
                      ))}
                    </Flex>
                  </Box>
                  <Text fontSize="8px" color="gray.400" textAlign="right">(hanya sementara ini free)</Text>
                </VStack>
              </MotionBox>

              {/* Result Section */}
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                p={8}
                borderRadius="3xl"
                bg={cardBg}
                boxShadow="2xl"
                backdropFilter="blur(20px)"
                minH="400px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px solid"
                borderColor={useColorModeValue("white", "whiteAlpha.200")}
                position="relative"
                overflow="hidden"
              >
                {isGenerating ? (
                  <VStack spacing={6}>
                    <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="purple.500" />
                    <Text fontWeight="bold" color="purple.500" animation="pulse 2s infinite">Sedang melukis mahakarya...</Text>
                  </VStack>
                ) : generatedImageUrl ? (
                  <VStack spacing={4} w="full" h="full">
                    <Box
                        w="full"
                        h={{ base: "300px", md: "500px" }}
                        position="relative"
                        borderRadius="2xl"
                        overflow="hidden"
                        boxShadow="2xl"
                    >
                        <Image
                            src={generatedImageUrl}
                            alt={prompt}
                            objectFit="contain"
                            w="full"
                            h="full"
                            bg="blackAlpha.800"
                        />
                    </Box>
                    <Flex w="full" justify="space-between" align="center" px={2}>
                        <Text fontSize="sm" color="gray.500" fontStyle="italic">"{prompt}"</Text>
                        <Button
                            as="a"
                            href={generatedImageUrl}
                            target="_blank"
                            download="ai_generated_image.png"
                            size="sm"
                            leftIcon={<FaDownload />}
                            colorScheme="purple"
                            variant="ghost"
                        >
                            Buka Gambar Full
                        </Button>
                    </Flex>
                  </VStack>
                ) : (
                  <VStack spacing={4} opacity={0.4}>
                    <Icon as={FaPaintBrush} w={16} h={16} />
                    <Text fontSize="lg" fontWeight="bold">Area Kanvas</Text>
                    <Text>Hasil generate gambar akan muncul di sini.</Text>
                  </VStack>
                )}
              </MotionBox>
            </VStack>
          </Box>

          {/* Sidebar Area */}
          <Box w={{ base: "full", lg: "350px" }} flexShrink={0}>
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              position="sticky"
              top="120px"
            >
              <VStack spacing={6}>
                <Box
                  borderRadius="3xl"
                  overflow="hidden"
                  boxShadow="2xl"
                  position="relative"
                  role="group"
                >
                  <Image
                    src="/sideimage.webp"
                    alt="Magic at your fingertips"
                    w="full"
                    transition="transform 0.5s"
                    _groupHover={{ transform: "scale(1.05)" }}
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bgGradient="linear(to-t, blackAlpha.800, transparent)"
                    p={6}
                    pt={20}
                  >
                    <Text color="white" fontWeight="bold" fontSize="lg">Sihir Di Ujung Jari Anda.</Text>
                    <Text color="whiteAlpha.800" fontSize="sm">Eksplorasi batas imajinasi dengan teknologi AI terkini.</Text>
                  </Box>
                </Box>
              </VStack>
            </MotionBox>
          </Box>

        </Flex>
      </Container>
    </Box>
  );
}
