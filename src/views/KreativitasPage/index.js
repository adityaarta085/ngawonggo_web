import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  useToast,
  Switch,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Image,
  Flex,
    Badge,
  Icon,
  useColorModeValue
} from '@chakra-ui/react';
import { FaMagic, FaPaintBrush } from 'react-icons/fa';
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


  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [tier, setTier] = useState(null);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
        if (user) {
            supabase.from('user_tiers').select('tier_name').eq('user_id', user.id).single().then(({ data }) => {
                if (data) setTier(data.tier_name);
            });
        }
    });
  }, []);

  const handleGenerate = async () => {
    if (!user) {
        toast({ title: 'Silakan login', description: 'Anda harus login untuk membuat gambar.', status: 'warning' });
        navigate('/auth');
        return;
    }

    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImageUrl(null);

    try {
        const generationUrl = `https://api-faa.my.id/faa/ai-text2img-pro?prompt=${encodeURIComponent(prompt)}`;
        const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

        // 1. Fetch generated image
        const imageResponse = await fetch(generationUrl);
        if (!imageResponse.ok) throw new Error('Failed to generate image');
        const blob = await imageResponse.blob();

        // 2. Upload to storage API (matching community logic)
        const formData = new FormData();
        formData.append('file', blob, `ai-image-${Date.now()}.jpg`);

        const key = "AIzaBj7z2z3xBjsk";
        const uploadResponse = await fetch(`https://c.termai.cc/api/upload?key=${key}`, {
            method: 'POST',
            body: formData,
        });

        if (!uploadResponse.ok) throw new Error('Failed to upload image to storage');
        const uploadData = await uploadResponse.json();
        if (!uploadData.status) throw new Error('Storage returned error');

        const finalImageUrl = uploadData.path;

        // 3. Simpan ke Supabase
        const { data, error } = await supabase.from('ai_images').insert([{
            user_id: user.id,
            prompt: prompt,
            image_url: finalImageUrl,
            is_public: tier === 'VIP' ? isPublic : true, // Free always public
            user_name: userName
        }]).select().single();

        if (error) throw error;

        toast({ title: 'Berhasil', description: 'Gambar berhasil dibuat dan disimpan.', status: 'success' });
        navigate(`/kreativitas/create/${data.id}`);

    } catch (error) {
        console.error("Error saving image:", error);
        toast({ title: 'Gagal', description: 'Gagal membuat gambar.', status: 'error' });
    } finally {
        setIsGenerating(false);
    }
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

<style dangerouslySetInnerHTML={{__html: `
.loader {

  display: inline-grid;
  width: 80px;
  aspect-ratio: 1;
  overflow: hidden;
  background:
   conic-gradient(from 146deg at 50% 1%,#0000, #91492A 2deg 65deg,#0000 68deg)
   -5% 100%/20% 27% repeat-x;
}
.loader:before {
  content:"";
  margin: 12.5%;
  clip-path: polygon(100% 50%,78.19% 60.26%,88.3% 82.14%,65% 75.98%,58.68% 99.24%,44.79% 79.54%,25% 93.3%,27.02% 69.28%,3.02% 67.1%,20% 50%,3.02% 32.9%,27.02% 30.72%,25% 6.7%,44.79% 20.46%,58.68% 0.76%,65% 24.02%,88.3% 17.86%,78.19% 39.74%);
  background: #CF6F46;
  animation: l7 3s linear infinite;
  translate: -135% 0;
}
@keyframes l7 {to{rotate: 400deg;translate: 135% 0}}

`}} />

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


              <HStack spacing={4} justify="center" mb={6}>
                  <Button colorScheme="brand" variant="outline" onClick={() => navigate('/kreativitas/publik')}>
                      Galeri Publik
                  </Button>
                  <Button colorScheme="purple" variant={tier === 'VIP' ? 'solid' : 'outline'} onClick={() => {
                      if (tier === 'VIP') navigate('/kreativitas/histori');
                      else {
                          toast({ title: 'Fitur VIP', description: 'Histori hanya tersedia untuk pengguna VIP.', status: 'info' });
                          navigate('/portal/toko');
                      }
                  }}>
                      Histori Saya {tier !== 'VIP' && '(VIP)'}
                  </Button>
              </HStack>

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

                  <Flex justify="space-between" align="center" mt={2} p={3} bg={useColorModeValue('whiteAlpha.500', 'blackAlpha.300')} borderRadius="lg">
                      <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="public-switch" mb="0" fontSize="sm" color={tier === 'VIP' ? 'gray.700' : 'gray.500'}>
                              Tampilkan di Publik
                          </FormLabel>
                          <Switch id="public-switch" isChecked={tier === 'VIP' ? isPublic : true} onChange={(e) => setIsPublic(e.target.checked)} isDisabled={tier !== 'VIP'} colorScheme="purple" />
                      </FormControl>
                      {tier !== 'VIP' && <Badge colorScheme="red" fontSize="xs">Hanya VIP (bisa privasi)</Badge>}
                  </Flex>

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
                    <div className="loader"></div>
                    <Text fontWeight="bold" color="purple.500" animation="pulse 2s infinite">Sedang melukis mahakarya...</Text>
                  </VStack>
                ) : generatedImageUrl ? (
                  <VStack spacing={4} w="full" h="full">
                    <Box
                        h={{ base: "450px", md: "600px" }}
                        w={{ base: "full", md: "auto" }} aspectRatio="9/16" mx="auto"
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
                        <Text fontSize="xs" color="gray.400" fontStyle="italic">Tekan lama / klik kanan pada gambar untuk menyimpan.</Text>
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
