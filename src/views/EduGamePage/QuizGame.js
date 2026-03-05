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
} from '@chakra-ui/react';
import { supabase } from '../../lib/supabase';

const questionPool = [
  {
    question: "Apa singkatan dari SPBE?",
    options: ["Sistem Pemerintahan Berbasis Elektronik", "Sistem Pengelolaan Berita Elektronik", "Sistem Pelayanan Bocah Edan", "Sistem Pembangunan Berbasis Ekonomi"],
    answer: 0
  },
  {
    question: "Tahun berapa Desa Ngawonggo ditargetkan menjadi model Desa Digital?",
    options: ["2025", "2030", "2045", "2100"],
    answer: 2
  },
  {
    question: "Teknologi apa yang digunakan untuk mengirim data internet super cepat melalui kabel?",
    options: ["Kabel Listrik", "Fiber Optik", "Pipa Air", "Tali Jemuran"],
    answer: 1
  },
  {
    question: "Apa fungsi utama AI (Artificial Intelligence)?",
    options: ["Menggantikan manusia tidur", "Meniru kecerdasan manusia untuk tugas tertentu", "Membuat kopi secara otomatis", "Menghapus semua data internet"],
    answer: 1
  },
  {
    question: "Apa yang dimaksud dengan 'Internet of Things' (IoT)?",
    options: ["Internet khusus untuk barang antik", "Jaringan perangkat fisik yang terhubung ke internet", "Cara baru memasak nasi pakai wifi", "Alat untuk menangkap sinyal alien"],
    answer: 1
  },
  {
    question: "Manakah yang merupakan bahasa pemrograman untuk membuat website?",
    options: ["Microsoft Word", "JavaScript", "Adobe Photoshop", "Google Chrome"],
    answer: 1
  },
  {
    question: "Apa fungsi dari Router?",
    options: ["Untuk memotong kayu", "Untuk mengarahkan lalu lintas data dalam jaringan", "Untuk mencetak foto", "Untuk mendinginkan ruangan"],
    answer: 1
  },
  {
    question: "Apa itu Cloud Computing?",
    options: ["Menghitung jumlah awan di langit", "Penyimpanan dan pengolahan data melalui server internet", "Komputer yang bisa terbang", "Alat ramalan cuaca digital"],
    answer: 1
  },
  {
    question: "Siapa penemu World Wide Web (WWW)?",
    options: ["Steve Jobs", "Tim Berners-Lee", "Mark Zuckerberg", "Bill Gates"],
    answer: 1
  },
  {
    question: "Apa kegunaan dari Firewall?",
    options: ["Memadamkan api di komputer", "Melindungi jaringan dari akses yang tidak sah", "Mempercepat koneksi internet", "Membersihkan debu di dalam CPU"],
    answer: 1
  }
];

const QuizGame = ({ onBack }) => {
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [user, setUser] = useState(null);
  const toast = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Randomize and pick 5 questions from the pool
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, 5));
  }, []);

  const saveScore = async (finalScore) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_game_scores')
      .insert([{
        user_id: user.id,
        game_name: 'Quiz Game',
        score: finalScore
      }]);

    if (error) console.error('Error saving score:', error);
  };

  const handleNext = () => {
    if (selected === null) {
      toast({ title: "Pilih jawaban dulu ya!", status: "warning", duration: 2000 });
      return;
    }

    const currentScore = parseInt(selected) === activeQuestions[currentStep].answer ? score + 1 : score;
    setScore(currentScore);

    if (currentStep < activeQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelected(null);
    } else {
      setIsFinished(true);
      saveScore(currentScore);
    }
  };

  const handleReset = () => {
    const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
    setActiveQuestions(shuffled.slice(0, 5));
    setCurrentStep(0);
    setScore(0);
    setIsFinished(false);
    setSelected(null);
  };

  if (activeQuestions.length === 0) return null;

  if (isFinished) {
    return (
      <VStack spacing={6} p={8} bg="white" borderRadius="2xl" textAlign="center" boxShadow="xl" w="full">
        <Heading color="brand.500">Kuis Selesai!</Heading>
        <Text fontSize="xl">Skor Kamu: {score} / {activeQuestions.length}</Text>
        <Badge colorScheme={score === activeQuestions.length ? "green" : "blue"} fontSize="lg" p={2}>
          {score === activeQuestions.length ? "Luar Biasa! Ahli Teknologi!" : "Bagus! Terus Belajar!"}
        </Badge>
        {user && <Text fontSize="xs" color="green.500">Skor Anda telah disimpan ke Portal Warga!</Text>}
        <Button colorScheme="brand" onClick={handleReset}>Main Lagi</Button>
        <Button variant="ghost" onClick={onBack}>Kembali ke Menu</Button>
      </VStack>
    );
  }

  return (
    <Box p={6} bg="white" borderRadius="2xl" boxShadow="xl" w="full" maxW="600px">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="md" color="brand.500">Kuis Tekno-Sains</Heading>
          <Text fontWeight="bold">{currentStep + 1} / {activeQuestions.length}</Text>
        </HStack>
        <Progress value={((currentStep + 1) / activeQuestions.length) * 100} borderRadius="full" colorScheme="brand" />

        <Box py={4}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>{activeQuestions[currentStep].question}</Text>
          <RadioGroup onChange={setSelected} value={selected}>
            <Stack spacing={3}>
              {activeQuestions[currentStep].options.map((opt, idx) => (
                <Box
                  key={idx}
                  p={4}
                  border="2px solid"
                  borderColor={selected === idx.toString() ? "brand.500" : "gray.100"}
                  borderRadius="xl"
                  cursor="pointer"
                  onClick={() => setSelected(idx.toString())}
                  _hover={{ bg: "brand.50" }}
                >
                  <Radio value={idx.toString()} colorScheme="brand">{opt}</Radio>
                </Box>
              ))}
            </Stack>
          </RadioGroup>
        </Box>

        <Button colorScheme="brand" size="lg" onClick={handleNext} borderRadius="xl">
          {currentStep === activeQuestions.length - 1 ? "Lihat Hasil" : "Lanjut"}
        </Button>
        <Button variant="ghost" onClick={onBack}>Menyerah</Button>
      </VStack>
    </Box>
  );
};

export default QuizGame;
