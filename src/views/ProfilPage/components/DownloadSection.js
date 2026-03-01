import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  useToast,
  VStack,
  HStack,
  Image,
  SimpleGrid,
} from '@chakra-ui/react';
import { DownloadIcon } from '@chakra-ui/icons';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import NgawonggoLogo from '../../../components/NgawonggoLogo';
import { useLanguage } from '../../../contexts/LanguageContext';
import { translations } from '../../../translations';

const DownloadSection = () => {
  const { language } = useLanguage();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const t = translations[language].profile;

  const logoRef = useRef(null);
  const splashRef = useRef(null);
  const combinedRef = useRef(null);

  const downloadPNG = async (ref, filename) => {
    try {
      setLoading(true);
      const canvas = await html2canvas(ref.current, {
        backgroundColor: '#ffffff',
        scale: 4,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast({
        title: t.success,
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: t.error,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (ref, filename) => {
    try {
      setLoading(true);
      const canvas = await html2canvas(ref.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.setFontSize(18);
      pdf.text('Aset Resmi Desa Ngawonggo', 10, 20);
      pdf.addImage(imgData, 'PNG', 10, 30, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);

      toast({
        title: t.success,
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: t.error,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadVideo = async (filename) => {
    setLoading(true);
    toast({
      title: language === 'id' ? "Merekam Animasi..." : "Recording Animation...",
      description: language === 'id' ? "Mohon tunggu sejenak, sedang menghasilkan video WebM." : "Please wait a moment, generating WebM video.",
      status: "info",
      duration: 5000,
    });

    try {
      const logoImg = new window.Image();
      logoImg.src = '/logo_desa.png';
      await new Promise(resolve => { logoImg.onload = resolve; });

      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      const stream = canvas.captureStream(30);

      // Check for supported mime types
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.webm`;
        link.click();
        setLoading(false);
        toast({ title: t.success, status: 'success' });
      };

      recorder.start();

      let startTime = null;
      const drawFrame = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) / 1000;

        if (elapsed > 4) { // 4 seconds video
          recorder.stop();
          return;
        }

        // Draw background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw logo (animated)
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2 - 50);
        const scale = 5 + Math.sin(elapsed * 3) * 0.3; // Pulsing effect
        ctx.scale(scale, scale);

        // Draw logo image
        ctx.drawImage(logoImg, -40, -40, 80, 80);
        ctx.restore();

        // Draw Text
        ctx.fillStyle = '#2D5A27';
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Desa Ngawonggo', canvas.width / 2, canvas.height / 2 + 120);

        // Draw attribution
        ctx.fillStyle = '#666';
        ctx.font = '20px Arial';
        ctx.fillText('MADE WITH SMK MUHAMMADIYAH BANDONGAN 2026 TJKT A', canvas.width / 2, canvas.height / 2 + 180);

        if (recorder.state === 'recording') {
          requestAnimationFrame(drawFrame);
        }
      };
      requestAnimationFrame(drawFrame);

    } catch (e) {
      console.error(e);
      setLoading(false);
      toast({ title: t.error, status: 'error' });
    }
  };

  return (
    <Box mt={10} p={8} borderRadius="2xl" bg="white" border="1px solid" borderColor="gray.100" boxShadow="xl">
      <VStack align="start" spacing={8}>
        <Box>
          <Heading size="lg" color="green.600" mb={2}>{t.downloadTitle}</Heading>
          <Text fontSize="md" color="gray.500">{t.downloadSubtitle}</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
          {/* Logo Section */}
          <VStack align="center" p={6} bg="gray.50" rounded="xl" border="1px solid" borderColor="gray.200" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'md' }}>
            <Box ref={logoRef} p={4} bg="white" rounded="lg" mb={4}>
              <NgawonggoLogo iconSize={16} fontSize="xl" flexDirection="column" />
            </Box>
            <Text fontWeight="bold" fontSize="lg" mb={4}>{t.logo}</Text>
            <Stack direction="column" w="full" spacing={3}>
              <Button leftIcon={<DownloadIcon />} colorScheme="green" onClick={() => downloadPNG(logoRef, 'Logo_Desa_Ngawonggo')} isLoading={loading}>
                {t.asImage}
              </Button>
              <Button variant="outline" colorScheme="green" onClick={() => downloadPDF(logoRef, 'Logo_Desa_Ngawonggo')} isLoading={loading}>
                {t.asPDF}
              </Button>
            </Stack>
          </VStack>

          {/* Splash Screen Section */}
          <VStack align="center" p={6} bg="gray.50" rounded="xl" border="1px solid" borderColor="gray.200" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'md' }}>
            <Box ref={splashRef} p={6} bg="white" rounded="lg" mb={4} textAlign="center" w="200px">
               <NgawonggoLogo iconSize={12} fontSize="sm" flexDirection="column" />
               <Text fontSize="9px" mt={3} color="gray.400" fontWeight="bold">MADE WITH SMK MUHAMMADIYAH BANDONGAN 2026 TJKT A</Text>
            </Box>
            <Text fontWeight="bold" fontSize="lg" mb={4}>{t.splash}</Text>
            <Stack direction="column" w="full" spacing={3}>
              <Button leftIcon={<DownloadIcon />} colorScheme="blue" onClick={() => downloadPNG(splashRef, 'Splash_Screen_Ngawonggo')} isLoading={loading}>
                {t.asImage}
              </Button>
              <Button variant="solid" colorScheme="red" onClick={() => downloadVideo('Splash_Animation_Ngawonggo')} isLoading={loading}>
                {t.asVideo}
              </Button>
            </Stack>
          </VStack>

          {/* Combined Section */}
          <VStack align="center" p={6} bg="gray.50" rounded="xl" border="1px solid" borderColor="gray.200" transition="all 0.3s" _hover={{ transform: 'translateY(-5px)', shadow: 'md' }}>
            <Box ref={combinedRef} p={6} bg="white" rounded="lg" mb={4} w="full">
              <VStack spacing={4}>
                 <NgawonggoLogo iconSize={10} fontSize="xs" />
                 <HStack spacing={6} justify="center">
                    <Image src="https://scn.magelangkab.go.id/sid/assets-landing/images/logo_kab_mgl.png" h="25px" objectFit="contain" />
                    <Image src="https://but.co.id/wp-content/uploads/2023/09/Logo-SPBE.png" h="25px" objectFit="contain" />
                 </HStack>
              </VStack>
            </Box>
            <Text fontWeight="bold" fontSize="lg" mb={4}>{t.combined}</Text>
            <Stack direction="column" w="full" spacing={3}>
              <Button leftIcon={<DownloadIcon />} colorScheme="purple" onClick={() => downloadPNG(combinedRef, 'Logo_Bundel_Ngawonggo')} isLoading={loading}>
                {t.asImage}
              </Button>
              <Button variant="outline" colorScheme="purple" onClick={() => downloadPDF(combinedRef, 'Logo_Bundel_Ngawonggo')} isLoading={loading}>
                {t.asPDF}
              </Button>
            </Stack>
          </VStack>
        </SimpleGrid>
      </VStack>
    </Box>
  );
};

export default DownloadSection;
