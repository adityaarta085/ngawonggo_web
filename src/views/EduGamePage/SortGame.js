
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { FaMicrophone, FaEnvelope, FaKeyboard, FaMobileAlt, FaDesktop, FaBook, FaWifi } from 'react-icons/fa';

const items = [
  { name: "Surat Kertas", type: "analog", icon: FaEnvelope },
  { name: "WhatsApp", type: "digital", icon: FaMobileAlt },
  { name: "Mesin Ketik", type: "analog", icon: FaKeyboard },
  { name: "Laptop", type: "digital", icon: FaDesktop },
  { name: "Buku Cetak", type: "analog", icon: FaBook },
  { name: "E-Book", type: "digital", icon: FaWifi },
  { name: "Kentongan", type: "analog", icon: FaMicrophone },
  { name: "E-Mail", type: "digital", icon: FaEnvelope },
];

const SortGame = ({ onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const toast = useToast();

  const handleChoice = (choice) => {
    if (choice === items[currentIndex].type) {
      setScore(score + 1);
      toast({ title: "Benar!", status: "success", duration: 1000, position: "top" });
    } else {
      toast({ title: "Kurang Tepat", status: "error", duration: 1000, position: "top" });
    }

    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <VStack spacing={6} p={8} bg="white" borderRadius="2xl" textAlign="center" boxShadow="xl">
        <Heading color="brand.500">Permainan Selesai!</Heading>
        <Text fontSize="xl">Kamu berhasil menyortir {score} dari {items.length} teknologi.</Text>
        <Button colorScheme="brand" onClick={() => {
          setCurrentIndex(0);
          setScore(0);
          setIsFinished(false);
        }}>Main Lagi</Button>
        <Button variant="ghost" onClick={onBack}>Kembali ke Menu</Button>
      </VStack>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <Box p={6} bg="white" borderRadius="2xl" boxShadow="xl" w="full" maxW="500px">
      <VStack spacing={8}>
        <VStack spacing={2}>
          <Heading size="md" color="brand.500">Sortir Digital vs Analog</Heading>
          <Text fontSize="sm" color="gray.500">Tentukan kategori teknologi di bawah ini</Text>
        </VStack>

        <Box
          p={10}
          bg="gray.50"
          borderRadius="2xl"
          w="full"
          textAlign="center"
          border="4px dashed"
          borderColor="brand.200"
        >
          <Icon as={currentItem.icon} w={20} h={20} color="brand.500" mb={4} />
          <Heading size="lg">{currentItem.name}</Heading>
        </Box>

        <SimpleGrid columns={2} spacing={4} w="full">
          <Button
            h="80px"
            colorScheme="orange"
            borderRadius="xl"
            fontSize="xl"
            onClick={() => handleChoice('analog')}
          >
            ANALOG
          </Button>
          <Button
            h="80px"
            colorScheme="blue"
            borderRadius="xl"
            fontSize="xl"
            onClick={() => handleChoice('digital')}
          >
            DIGITAL
          </Button>
        </SimpleGrid>

        <HStack w="full" justify="space-between">
          <Text fontWeight="bold">Skor: {score}</Text>
          <Text fontWeight="bold">Progres: {currentIndex + 1} / {items.length}</Text>
        </HStack>

        <Button variant="ghost" onClick={onBack} size="sm">Kembali</Button>
      </VStack>
    </Box>
  );
};

export default SortGame;
