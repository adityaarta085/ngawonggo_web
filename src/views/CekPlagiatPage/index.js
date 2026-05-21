import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  Icon,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import { FaSearch, FaShieldAlt } from 'react-icons/fa';
import SEO from '../../components/SEO';
import TextInputForm from './components/TextInputForm';
import ResultDisplay from './components/ResultDisplay';
import HistoryPanel from './components/HistoryPanel';
import ScanAnimation from './components/ScanAnimation';

// --- Simulated plagiarism checking engine ---
// In production, replace this with a real API call.
const simulatePlagiarismCheck = (text) => {
  return new Promise((resolve) => {
    const delay = 2000 + Math.random() * 2000;

    setTimeout(() => {
      const words = text.split(/\s+/).filter(Boolean);
      const wordCount = words.length;

      // Generate a random but seeded score
      const hash = text.length * 7 + wordCount * 13;
      const score = Math.min(95, Math.max(2, (hash % 60) + Math.floor(Math.random() * 20)));

      // Generate plausible sources
      const sourceSamples = [
        { title: 'Wikipedia - Artikel Terkait', url: 'https://id.wikipedia.org/wiki/Contoh_Artikel', similarity: Math.min(score, 30 + Math.floor(Math.random() * 25)) },
        { title: 'Jurnal Ilmiah Indonesia Vol.12', url: 'https://jurnal.example.ac.id/vol12/artikel', similarity: Math.min(score, 15 + Math.floor(Math.random() * 20)) },
        { title: 'Kompas.com - Berita Nasional', url: 'https://kompas.com/read/berita-contoh', similarity: Math.min(score, 10 + Math.floor(Math.random() * 15)) },
        { title: 'Skripsi Repository Universitas', url: 'https://repository.example.ac.id/skripsi/123', similarity: Math.min(score, 20 + Math.floor(Math.random() * 18)) },
        { title: 'Blog Pendidikan Online', url: 'https://blog-pendidikan.example.com/artikel', similarity: Math.min(score, 8 + Math.floor(Math.random() * 12)) },
      ];

      // Only include sources that contribute to the score
      const numSources = score <= 15 ? 0 : Math.min(5, Math.floor(score / 15) + 1);
      const sources = sourceSamples
        .sort(() => Math.random() - 0.5)
        .slice(0, numSources)
        .sort((a, b) => b.similarity - a.similarity);

      // Generate highlighted regions
      const highlights = [];
      if (score > 15 && text.length > 50) {
        const numHighlights = Math.min(5, Math.floor(score / 12));
        const segmentLen = Math.floor(text.length / (numHighlights + 2));

        for (let i = 0; i < numHighlights; i++) {
          const startBase = segmentLen * (i + 1);
          const start = Math.max(0, startBase - Math.floor(Math.random() * 10));
          const len = Math.min(
            text.length - start,
            20 + Math.floor(Math.random() * 40)
          );
          const end = Math.min(text.length, start + len);

          // Make sure we highlight whole words
          const adjustedStart = text.lastIndexOf(' ', start) + 1;
          const adjustedEnd = text.indexOf(' ', end);
          const finalEnd = adjustedEnd === -1 ? text.length : adjustedEnd;

          if (finalEnd > adjustedStart) {
            highlights.push({
              start: adjustedStart,
              end: finalEnd,
              source: sources[i % sources.length]?.title || 'Sumber Online',
            });
          }
        }
      }

      resolve({
        score,
        sources,
        highlights,
        originalText: text,
        checkedAt: new Date().toISOString(),
        wordCount,
      });
    }, delay);
  });
};

const HISTORY_KEY = 'plagiat_history';

const CekPlagiatPage = () => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const toast = useToast();

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((newHistory) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }, []);

  const handleCheck = async () => {
    const trimmedText = text.trim();

    if (!trimmedText && !file) {
      toast({
        title: 'Input diperlukan',
        description: 'Masukkan teks atau upload file untuk dicek plagiarisme.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (trimmedText.length < 30) {
      toast({
        title: 'Teks terlalu pendek',
        description: 'Minimal 30 karakter untuk analisis yang akurat.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const checkResult = await simulatePlagiarismCheck(trimmedText);
      setResult(checkResult);

      // Add to history
      const historyEntry = {
        preview: trimmedText.substring(0, 80) + (trimmedText.length > 80 ? '...' : ''),
        score: checkResult.score,
        checkedAt: checkResult.checkedAt,
        text: trimmedText,
      };

      const newHistory = [historyEntry, ...history].slice(0, 10);
      setHistory(newHistory);
      saveHistory(newHistory);

      toast({
        title: 'Analisis selesai!',
        description: `Kemiripan: ${checkResult.score}% — ${checkResult.sources.length} sumber terdeteksi.`,
        status: checkResult.score <= 40 ? 'success' : 'warning',
        duration: 4000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat menganalisis teks. Silakan coba lagi.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecheck = (item) => {
    setText(item.text);
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
    toast({
      title: 'Riwayat dihapus',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const charCount = text.length;

  return (
    <>
      <SEO
        title="Cek Plagiat"
        description="Cek plagiarisme teks secara online dengan analisis kemiripan, deteksi sumber, dan highlight teks plagiat."
      />
      <Box
        minH="100vh"
        pb={10}
        bgGradient="linear(to-br, #0F172A, #1a1a4e, #0F172A)"
        position="relative"
        overflow="hidden"
      >
        {/* Background decoration */}
        <Box
          position="absolute"
          top="-200px"
          right="-200px"
          w="500px"
          h="500px"
          borderRadius="full"
          bg="brand.500"
          opacity={0.04}
          filter="blur(120px)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          bottom="-150px"
          left="-100px"
          w="400px"
          h="400px"
          borderRadius="full"
          bg="purple.500"
          opacity={0.04}
          filter="blur(100px)"
          pointerEvents="none"
        />

        <Container maxW="container.lg" pt={{ base: 4, md: 6 }}>
          <VStack spacing={8}>
            {/* Page Header */}
            <VStack spacing={3} textAlign="center" maxW="600px">
              <HStack spacing={3}>
                <Icon as={FaShieldAlt} color="brand.400" boxSize={7} />
                <Heading
                  color="white"
                  size="xl"
                  bgGradient="linear(to-r, brand.300, purple.300)"
                  bgClip="text"
                >
                  Cek Plagiarisme
                </Heading>
              </HStack>
              <Text color="whiteAlpha.700" fontSize={{ base: 'sm', md: 'md' }}>
                Analisis teks Anda secara instan. Deteksi kemiripan, temukan sumber terduplikasi,
                dan lihat bagian mana yang perlu direvisi.
              </Text>
            </VStack>

            {/* Input Form */}
            <TextInputForm
              text={text}
              setText={setText}
              file={file}
              setFile={setFile}
              charCount={charCount}
            />

            {/* Check Button */}
            <Button
              id="btn-cek-plagiat"
              w="full"
              maxW="400px"
              size="lg"
              colorScheme="brand"
              leftIcon={<FaSearch />}
              onClick={handleCheck}
              isDisabled={loading || (!text.trim() && !file)}
              isLoading={loading}
              loadingText="Menganalisis..."
              bgGradient="linear(to-r, brand.500, purple.500)"
              _hover={{
                bgGradient: 'linear(to-r, brand.400, purple.400)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(99, 102, 241, 0.35)',
              }}
              _active={{
                transform: 'translateY(0)',
              }}
              transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              py={7}
              fontSize="lg"
              fontWeight="700"
              borderRadius="xl"
            >
              Cek Plagiat
            </Button>

            {/* Loading Animation */}
            {loading && <ScanAnimation />}

            {/* Results & History */}
            <SimpleGrid
              columns={{ base: 1, lg: result ? 1 : 1 }}
              spacing={6}
              w="full"
            >
              {result && <ResultDisplay result={result} />}
            </SimpleGrid>

            {/* History */}
            <HistoryPanel
              history={history}
              onRecheck={handleRecheck}
              onClear={handleClearHistory}
            />
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default CekPlagiatPage;
