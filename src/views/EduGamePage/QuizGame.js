import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Radio,
  RadioGroup,
  Stack,
  useToast,
  Progress,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { FaLightbulb, FaTrophy, FaRedo, FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

const allQuestions = [
  {
    question: "Apa singkatan dari SPBE?",
    options: [
      "Sistem Pemerintahan Berbasis Elektronik",
      "Sistem Pengelolaan Berita Elektronik",
      "Sistem Pelayanan Bocah Edan",
      "Sistem Pembangunan Berbasis Ekonomi"
    ],
    answer: 0,
    category: "Pemerintahan"
  },
  {
    question: "Tahun berapa Desa Ngawonggo ditargetkan menjadi model Desa Digital?",
    options: ["2025", "2030", "2045", "2100"],
    answer: 2,
    category: "Desa"
  },
  {
    question: "Teknologi apa yang digunakan untuk mengirim data internet super cepat melalui kabel?",
    options: ["Kabel Listrik", "Fiber Optik", "Pipa Air", "Tali Jemuran"],
    answer: 1,
    category: "Teknologi"
  },
  {
    question: "Apa fungsi utama AI (Artificial Intelligence)?",
    options: [
      "Menggantikan manusia tidur",
      "Meniru kecerdasan manusia untuk tugas tertentu",
      "Membuat kopi secara otomatis",
      "Menghapus semua data internet"
    ],
    answer: 1,
    category: "Teknologi"
  },
  {
    question: "Siapa penemu World Wide Web (WWW)?",
    options: ["Steve Jobs", "Bill Gates", "Tim Berners-Lee", "Mark Zuckerberg"],
    answer: 2,
    category: "Teknologi"
  },
  {
    question: "Apa arti dari 'Phishing' dalam dunia digital?",
    options: [
      "Memancing ikan di laut",
      "Upaya penipuan untuk mendapatkan informasi sensitif",
      "Mengunduh file secara ilegal",
      "Memperbaiki kabel internet yang rusak"
    ],
    answer: 1,
    category: "Keamanan"
  },
  {
    question: "Manakah yang merupakan bahasa pemrograman untuk membuat website?",
    options: ["Microsoft Word", "JavaScript", "Adobe Photoshop", "Google Chrome"],
    answer: 1,
    category: "Teknologi"
  },
  {
    question: "Apa singkatan dari IKN?",
    options: ["Ibukota Kota Nasional", "Ibu Kota Nusantara", "Ikatan Keluarga Nasional", "Industri Kecil Nusantara"],
    answer: 1,
    category: "Umum"
  }
];

const QuizGame = ({ onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [user, setUser] = useState(null);
  const toast = useToast();

  // Shuffle and pick questions
  const initializeGame = () => {
      const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
      setQuestions(shuffled.slice(0, 5)); // Pick 5 random questions
      setCurrentStep(0);
      setScore(0);
      setIsFinished(false);
      setSelected(null);
  };

  useEffect(() => {
    initializeGame();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const saveScore = async (finalScore) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_game_scores')
      .insert([{
        user_id: user.id,
        game_name: 'Quiz Game (Dynamic)',
        score: finalScore
      }]);

    if (error) console.error('Error saving score:', error);
  };

  const handleNext = () => {
    if (selected === null) {
      toast({
        title: "Pilih jawaban dulu ya!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: 'top'
      });
      return;
    }

    const isCorrect = parseInt(selected) === questions[currentStep].answer;
    const currentScore = isCorrect ? score + 1 : score;
    setScore(currentScore);

    if (isCorrect) {
        toast({
            title: "Benar!",
            status: "success",
            duration: 1000,
            position: 'top-right'
        });
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelected(null);
    } else {
      setIsFinished(true);
      saveScore(currentScore);
    }
  };

  if (questions.length === 0) return null;

  if (isFinished) {
    return (
      <VStack spacing={6} p={8} bg="white" borderRadius="2xl" textAlign="center" boxShadow="2xl" border="1px solid" borderColor="gray.100">
        <Icon as={FaTrophy} w={16} h={16} color="gold" />
        <VStack spacing={1}>
            <Heading color="brand.500">Kuis Selesai!</Heading>
            <Text fontSize="lg" color="gray.500">Hebat! Kamu telah menyelesaikan tantangan ini.</Text>
        </VStack>

        <Box p={6} bg="brand.50" borderRadius="2xl" w="full">
            <Text fontSize="4xl" fontWeight="black" color="brand.600">{score} / {questions.length}</Text>
            <Text fontSize="sm" fontWeight="bold" color="brand.400">SKOR AKHIR</Text>
        </Box>

        <Badge colorScheme={score >= 4 ? "green" : "blue"} fontSize="md" p={2} borderRadius="lg" variant="subtle">
          {score === questions.length ? "Luar Biasa! Ahli Teknologi!" : score >= 3 ? "Bagus! Terus Belajar!" : "Jangan Menyerah! Coba Lagi!"}
        </Badge>

        {user && (
            <HStack bg="green.50" p={2} borderRadius="md" color="green.600">
                <Text fontSize="xs" fontWeight="bold">✓ Skor Anda telah disimpan ke Portal Warga!</Text>
            </HStack>
        )}

        <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} w="full">
            <Button
                flex={1}
                leftIcon={<FaRedo />}
                colorScheme="brand"
                size="lg"
                onClick={initializeGame}
                borderRadius="xl"
            >
                Main Lagi
            </Button>
            <Button
                flex={1}
                leftIcon={<FaArrowLeft />}
                variant="ghost"
                size="lg"
                onClick={onBack}
                borderRadius="xl"
            >
                Ke Menu
            </Button>
        </Stack>
      </VStack>
    );
  }

  return (
    <Box p={{ base: 4, md: 8 }} bg="white" borderRadius="3xl" boxShadow="2xl" w="full" maxW="600px" position="relative" overflow="hidden">
      {/* Background decoration */}
      <Box position="absolute" top="-20px" right="-20px" opacity={0.05}>
          <Icon as={FaLightbulb} w="150px" h="150px" color="brand.500" />
      </Box>

      <VStack spacing={6} align="stretch" position="relative">
        <HStack justify="space-between">
          <VStack align="start" spacing={0}>
              <Badge colorScheme="brand" variant="solid" borderRadius="full" px={3}>{questions[currentStep].category}</Badge>
              <Heading size="md" mt={2}>Kuis Tekno-Sains</Heading>
          </VStack>
          <Box textAlign="right">
              <Text fontWeight="black" fontSize="2xl" color="brand.500" lineHeight="1">{currentStep + 1}</Text>
              <Text fontSize="xs" color="gray.400">DARI {questions.length}</Text>
          </Box>
        </HStack>

        <Progress value={((currentStep + 1) / questions.length) * 100} borderRadius="full" colorScheme="brand" h="8px" bg="gray.100" />

        <Box py={4}>
          <Text fontSize="xl" fontWeight="bold" mb={6} lineHeight="1.4">{questions[currentStep].question}</Text>
          <RadioGroup onChange={setSelected} value={selected}>
            <Stack spacing={4}>
              {questions[currentStep].options.map((opt, idx) => (
                <Box
                  key={idx}
                  p={5}
                  border="2px solid"
                  borderColor={selected === idx.toString() ? "brand.500" : "gray.100"}
                  bg={selected === idx.toString() ? "brand.50" : "transparent"}
                  borderRadius="2xl"
                  cursor="pointer"
                  onClick={() => setSelected(idx.toString())}
                  _hover={{ borderColor: selected === idx.toString() ? "brand.500" : "brand.200", bg: selected === idx.toString() ? "brand.50" : "gray.50" }}
                  transition="all 0.2s"
                >
                  <HStack spacing={4}>
                      <Box
                        w="30px" h="30px"
                        borderRadius="full"
                        bg={selected === idx.toString() ? "brand.500" : "gray.200"}
                        color="white"
                        display="flex" align="center" justify="center"
                        fontSize="sm" fontWeight="bold"
                      >
                          {String.fromCharCode(65 + idx)}
                      </Box>
                      <Text fontWeight="600" color={selected === idx.toString() ? "brand.700" : "gray.700"}>{opt}</Text>
                  </HStack>
                  <Radio value={idx.toString()} display="none" />
                </Box>
              ))}
            </Stack>
          </RadioGroup>
        </Box>

        <Stack direction="row" spacing={4} pt={4}>
            <Button variant="ghost" flex={1} onClick={onBack} borderRadius="xl" size="lg">Berhenti</Button>
            <Button
                colorScheme="brand"
                size="lg"
                flex={2}
                onClick={handleNext}
                borderRadius="xl"
                boxShadow="lg"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
            >
              {currentStep === questions.length - 1 ? "Lihat Hasil" : "Lanjut"}
            </Button>
        </Stack>
      </VStack>
    </Box>
  );
};

export default QuizGame;
