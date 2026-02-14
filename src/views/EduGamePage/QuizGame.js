
import React, { useState } from 'react';
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

const questions = [
  {
    question: "Apa singkatan dari SPBE?",
    options: [
      "Sistem Pemerintahan Berbasis Elektronik",
      "Sistem Pengelolaan Berita Elektronik",
      "Sistem Pelayanan Bocah Edan",
      "Sistem Pembangunan Berbasis Ekonomi"
    ],
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
    options: [
      "Menggantikan manusia tidur",
      "Meniru kecerdasan manusia untuk tugas tertentu",
      "Membuat kopi secara otomatis",
      "Menghapus semua data internet"
    ],
    answer: 1
  }
];

const QuizGame = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const toast = useToast();

  const handleNext = () => {
    if (selected === null) {
      toast({ title: "Pilih jawaban dulu ya!", status: "warning", duration: 2000 });
      return;
    }

    if (parseInt(selected) === questions[currentStep].answer) {
      setScore(score + 1);
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelected(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <VStack spacing={6} p={8} bg="white" borderRadius="2xl" textAlign="center" boxShadow="xl">
        <Heading color="brand.500">Kuis Selesai!</Heading>
        <Text fontSize="xl">Skor Kamu: {score} / {questions.length}</Text>
        <Badge colorScheme={score === questions.length ? "green" : "blue"} fontSize="lg" p={2}>
          {score === questions.length ? "Luar Biasa! Ahli Teknologi!" : "Bagus! Terus Belajar!"}
        </Badge>
        <Button colorScheme="brand" onClick={() => {
          setCurrentStep(0);
          setScore(0);
          setIsFinished(false);
          setSelected(null);
        }}>Main Lagi</Button>
        <Button variant="ghost" onClick={onBack}>Kembali ke Menu</Button>
      </VStack>
    );
  }

  return (
    <Box p={6} bg="white" borderRadius="2xl" boxShadow="xl" w="full" maxW="600px">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="md" color="brand.500">Kuis Tekno-Sains</Heading>
          <Text fontWeight="bold">{currentStep + 1} / {questions.length}</Text>
        </HStack>
        <Progress value={((currentStep + 1) / questions.length) * 100} borderRadius="full" colorScheme="brand" />

        <Box py={4}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>{questions[currentStep].question}</Text>
          <RadioGroup onChange={setSelected} value={selected}>
            <Stack spacing={3}>
              {questions[currentStep].options.map((opt, idx) => (
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
          {currentStep === questions.length - 1 ? "Lihat Hasil" : "Lanjut"}
        </Button>
        <Button variant="ghost" onClick={onBack}>Menyerah</Button>
      </VStack>
    </Box>
  );
};

export default QuizGame;
