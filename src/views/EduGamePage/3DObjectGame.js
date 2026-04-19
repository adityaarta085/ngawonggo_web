import React, { useState, Suspense } from 'react';
import { Box, VStack, Heading, Text, Button, Flex, SimpleGrid, Icon, Badge, useToast, Progress } from '@chakra-ui/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';
import { FaTrophy, FaRedo, FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// 3D Objects
const BoxShape = () => (
  <mesh castShadow receiveShadow>
    <boxGeometry args={[2, 2, 2]} />
    <meshStandardMaterial color="#4299E1" roughness={0.3} metalness={0.8} />
  </mesh>
);

const SphereShape = () => (
  <mesh castShadow receiveShadow>
    <sphereGeometry args={[1.5, 32, 32]} />
    <meshStandardMaterial color="#48BB78" roughness={0.2} metalness={0.5} />
  </mesh>
);

const ConeShape = () => (
  <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
    <coneGeometry args={[1.5, 3, 32]} />
    <meshStandardMaterial color="#ED8936" roughness={0.4} metalness={0.6} />
  </mesh>
);

const TorusShape = () => (
  <mesh castShadow receiveShadow>
    <torusGeometry args={[1.2, 0.4, 16, 100]} />
    <meshStandardMaterial color="#9F7AEA" roughness={0.1} metalness={0.9} />
  </mesh>
);

const CylinderShape = () => (
  <mesh castShadow receiveShadow>
    <cylinderGeometry args={[1, 1, 3, 32]} />
    <meshStandardMaterial color="#F56565" roughness={0.3} metalness={0.4} />
  </mesh>
);

const DodecahedronShape = () => (
  <mesh castShadow receiveShadow>
    <dodecahedronGeometry args={[1.5]} />
    <meshStandardMaterial color="#38B2AC" roughness={0.2} metalness={0.8} />
  </mesh>
);

const levels = [
  {
    component: BoxShape,
    question: 'Bentuk 3D apakah ini?',
    options: ['Kubus', 'Balok', 'Prisma', 'Piramida'],
    correct: 'Kubus',
    fact: 'Kubus memiliki 6 sisi persegi yang sama besar, 12 rusuk, dan 8 titik sudut.'
  },
  {
    component: SphereShape,
    question: 'Benda langit seperti planet dan bintang memiliki bentuk yang mendekati bangun ruang ini. Apa namanya?',
    options: ['Lingkaran', 'Elips', 'Bola', 'Tabung'],
    correct: 'Bola',
    fact: 'Bola adalah bangun ruang sisi lengkung yang dibatasi oleh satu bidang lengkung. Bola tidak memiliki rusuk maupun titik sudut.'
  },
  {
    component: ConeShape,
    question: 'Topi ulang tahun dan tumpeng memiliki bentuk dasar bangun ruang ini. Apa namanya?',
    options: ['Piramida', 'Kerucut', 'Prisma Segitiga', 'Limas'],
    correct: 'Kerucut',
    fact: 'Kerucut memiliki 2 sisi (alas berbentuk lingkaran dan selimut), 1 rusuk lengkung, dan 1 titik puncak.'
  },
  {
    component: TorusShape,
    question: 'Bangun ruang ini bentuknya mirip dengan donat atau ban mobil. Dalam geometri, disebut apa?',
    options: ['Cincin', 'Silinder', 'Torus', 'Bola Lubang'],
    correct: 'Torus',
    fact: 'Torus dihasilkan dengan memutar sebuah lingkaran mengelilingi sumbu coplanar yang tidak memotong lingkaran tersebut.'
  },
  {
    component: CylinderShape,
    question: 'Pipa air dan kaleng minuman adalah contoh penerapan bangun ruang ini dalam kehidupan sehari-hari.',
    options: ['Tabung (Silinder)', 'Balok', 'Prisma', 'Kerucut'],
    correct: 'Tabung (Silinder)',
    fact: 'Tabung memiliki 3 sisi (2 lingkaran yang kongruen dan 1 selimut persegi panjang) serta 2 rusuk lengkung.'
  },
  {
    component: DodecahedronShape,
    question: 'Bangun ruang platonik ini memiliki 12 sisi yang masing-masing berbentuk segi lima beraturan.',
    options: ['Icosahedron', 'Oktahedron', 'Dodekahedron', 'Heksahedron'],
    correct: 'Dodekahedron',
    fact: 'Dodekahedron beraturan memiliki 12 sisi segi lima beraturan, 30 rusuk, dan 20 titik sudut.'
  }
];

const Object3DGame = ({ onFinish }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const toast = useToast();

  const handleAnswer = (answer) => {
    if (selectedAnswer) return; // Prevent multiple clicks

    setSelectedAnswer(answer);
    const correct = answer === levels[currentLevel].correct;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 10);
      toast({
        title: "Tepat Sekali!",
        description: levels[currentLevel].fact,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      toast({
        title: "Kurang Tepat!",
        description: `Jawaban yang benar adalah ${levels[currentLevel].correct}. ${levels[currentLevel].fact}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }

    // Move to next level after delay
    setTimeout(() => {
      if (currentLevel < levels.length - 1) {
        setCurrentLevel(c => c + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        const finalScore = correct ? score + 10 : score;
        if (typeof onFinish === 'function') {
           onFinish({
             score: finalScore,
             maxScore: levels.length * 10,
             message: "Luar biasa! Kamu telah menguasai konsep Geometri 3D!"
           });
        } else {
           setGameOver(true);
        }
      }
    }, 5000);
  };

  const restartGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setGameOver(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const CurrentShape = levels[currentLevel]?.component;

  if (gameOver) {
    return (
      <VStack spacing={8} py={10} w="full" maxW="2xl" mx="auto" bg="white" p={10} borderRadius="3xl" boxShadow="xl">
        <Icon as={FaTrophy} w={20} h={20} color="yellow.400" />
        <VStack spacing={3} textAlign="center">
          <Heading size="2xl" color="gray.800">Kuis Selesai!</Heading>
          <Text fontSize="xl" color="gray.600">Skor Akhir Anda: <Text as="span" fontWeight="bold" color="brand.500">{score}</Text> / {levels.length * 10}</Text>
          <Text color="gray.500">Luar biasa! Anda telah mempelajari berbagai bentuk geometri 3D.</Text>
        </VStack>
        <Flex gap={4}>
          <Button size="lg" colorScheme="brand" onClick={restartGame} leftIcon={<FaRedo />} borderRadius="xl">
            Main Lagi
          </Button>
          <Button size="lg" variant="outline"  borderRadius="xl">
            Kembali ke Menu
          </Button>
        </Flex>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} w="full">
      <Flex w="full" justify="space-between" align="center" bg="white" p={6} borderRadius="2xl" boxShadow="sm">
        <VStack align="start" spacing={1}>
          <Badge colorScheme="purple" fontSize="sm" px={3} py={1} borderRadius="full">
            Kuis Geometri 3D
          </Badge>
          <Text color="gray.500" fontWeight="bold">Pertanyaan {currentLevel + 1} dari {levels.length}</Text>
        </VStack>
        <Flex align="center" gap={3}>
          <Icon as={FaTrophy} color="yellow.500" w={6} h={6} />
          <Heading size="md" color="gray.700">Skor: {score}</Heading>
        </Flex>
      </Flex>

      <Progress value={(currentLevel / levels.length) * 100} w="full" colorScheme="purple" borderRadius="full" size="sm" />

      <Flex w="full" direction={{ base: 'column', lg: 'row' }} gap={6}>
        {/* 3D Viewer */}
        <Box
          flex={1}
          h={{ base: '300px', lg: '450px' }}
          bg="gray.900"
          borderRadius="3xl"
          overflow="hidden"
          position="relative"
          boxShadow="inner"
        >
          <Badge position="absolute" top={4} left={4} zIndex={2} colorScheme="whiteAlpha" backdropFilter="blur(10px)">
            Putar & Zoom Model 3D
          </Badge>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Suspense fallback={null}>
              <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <CurrentShape />
              </Float>
              <Environment preset="city" />
              <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
            </Suspense>
            <OrbitControls autoRotate autoRotateSpeed={2} enablePan={false} maxDistance={10} minDistance={3} />
          </Canvas>
        </Box>

        {/* Questions and Options */}
        <VStack flex={1} spacing={6} align="stretch" bg="white" p={8} borderRadius="3xl" boxShadow="sm">
          <Flex gap={3} align="center">
            <Icon as={FaBrain} color="purple.500" w={6} h={6} />
            <Heading size="md" color="gray.700" lineHeight="tall">
              {levels[currentLevel].question}
            </Heading>
          </Flex>

          <SimpleGrid columns={1} spacing={4}>
            {levels[currentLevel].options.map((option, index) => {
              let bg = "gray.50";
              let color = "gray.700";
              let borderColor = "gray.200";

              if (selectedAnswer) {
                if (option === levels[currentLevel].correct) {
                  bg = "green.50";
                  color = "green.700";
                  borderColor = "green.400";
                } else if (option === selectedAnswer && option !== levels[currentLevel].correct) {
                  bg = "red.50";
                  color = "red.700";
                  borderColor = "red.400";
                }
              }

              return (
                <MotionBox
                  key={index}
                  whileHover={!selectedAnswer ? { scale: 1.02 } : {}}
                  whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                >
                  <Button
                    w="full"
                    h="auto"
                    py={5}
                    justifyContent="flex-start"
                    variant="outline"
                    bg={bg}
                    color={color}
                    borderColor={borderColor}
                    borderWidth="2px"
                    fontSize="lg"
                    fontWeight="bold"
                    whiteSpace="normal"
                    textAlign="left"
                    onClick={() => handleAnswer(option)}
                    isDisabled={selectedAnswer !== null}
                    _hover={!selectedAnswer ? { bg: 'gray.100' } : {}}
                  >
                    {option}
                  </Button>
                </MotionBox>
              );
            })}
          </SimpleGrid>

          {selectedAnswer && (
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              p={4}
              bg={isCorrect ? 'green.50' : 'blue.50'}
              borderRadius="xl"
              borderLeft="4px solid"
              borderColor={isCorrect ? 'green.500' : 'blue.500'}
            >
              <Text fontSize="sm" color={isCorrect ? 'green.800' : 'blue.800'} fontWeight="medium">
                <Text as="span" fontWeight="bold">Fakta Menarik: </Text>
                {levels[currentLevel].fact}
              </Text>
              <Text fontSize="xs" mt={2} color="gray.500" fontStyle="italic">
                Memuat pertanyaan selanjutnya...
              </Text>
            </MotionBox>
          )}
        </VStack>
      </Flex>
    </VStack>
  );
};

export default Object3DGame;
