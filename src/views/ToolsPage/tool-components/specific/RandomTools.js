import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Text, VStack, HStack, SimpleGrid, Button, Input, Textarea,
  FormControl, FormLabel, Badge, Flex, IconButton, Center
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';

/* ═══════ RANDOM TEAM PICKER ═══════ */
const TeamPicker = () => {
  const [inputText, setInputText] = useState('Aditya, Budi, Citra, Dedi, Eka, Fani, Guntur, Hani');
  const [numTeams, setNumTeams] = useState(2);
  const [teams, setTeams] = useState([]);

  const pick = () => {
    const names = inputText
      .split(/[,\n]/)
      .map(n => n.trim())
      .filter(Boolean);
    
    if (names.length === 0) return;

    // Shuffle
    const shuffled = [...names];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Split into teams
    const result = Array.from({ length: numTeams }, () => []);
    shuffled.forEach((name, i) => {
      result[i % numTeams].push(name);
    });

    setTeams(result);
  };

  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <FormControl>
        <FormLabel>Daftar Nama (Pisahkan dengan koma atau baris baru)</FormLabel>
        <Textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Aditya, Budi, Citra..." rows={3} />
      </FormControl>
      <HStack w="full">
        <FormControl>
          <FormLabel>Jumlah Tim</FormLabel>
          <Input type="number" min={2} max={10} value={numTeams} onChange={e => setNumTeams(Number(e.target.value))} />
        </FormControl>
        <Button colorScheme="brand" onClick={pick} alignSelf="flex-end" px={8}>Bagi Tim</Button>
      </HStack>
      {teams.length > 0 && (
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3} w="full">
          {teams.map((t, idx) => (
            <Box key={idx} p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl" border="1px solid" borderColor="gray.200">
              <Text fontWeight="bold" color="brand.500" mb={2}>Tim {idx + 1}</Text>
              <VStack align="start" spacing={1}>
                {t.map((name, i) => <Text key={i} fontSize="sm">{name}</Text>)}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

/* ═══════ RANDOM WHEEL SPINNER ═══════ */
const WheelSpinner = () => {
  const [newItem, setNewItem] = useState('');
  const [items, setItems] = useState(['Bakso', 'Nasi Goreng', 'Mie Ayam', 'Sate', 'Gado-Gado', 'Ketoprak']);
  const [winner, setWinner] = useState('');
  const [spinning, setSpinning] = useState(false);
  const canvasRef = useRef(null);
  const startAngleRef = useRef(0);
  const spinTimeRef = useRef(0);
  const spinTimeTotalRef = useRef(0);
  const colors = ['#E53E3E', '#DD6B20', '#D69E2E', '#38A169', '#319795', '#3182CE', '#805AD5', '#D53F8C'];

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    const r = cw / 2 - 10;
    ctx.clearRect(0, 0, cw, ch);

    if (items.length === 0) return;
    const arc = Math.PI * 2 / items.length;

    for (let i = 0; i < items.length; i++) {
      const angle = startAngleRef.current + i * arc;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(cw / 2, ch / 2);
      ctx.arc(cw / 2, ch / 2, r, angle, angle + arc, false);
      ctx.lineTo(cw / 2, ch / 2);
      ctx.fill();

      // Text
      ctx.save();
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.translate(cw / 2, ch / 2);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillText(items[i], r - 20, 5);
      ctx.restore();
    }

    // Pointer pin at top-right or top center
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(cw / 2 - 10, 20);
    ctx.lineTo(cw / 2 + 10, 20);
    ctx.lineTo(cw / 2, 45);
    ctx.fill();
  };

  useEffect(() => {
    drawWheel();
  }, [items]);

  const spin = () => {
    if (spinning || items.length === 0) return;
    setSpinning(true);
    setWinner('');
    spinTimeRef.current = 0;
    spinTimeTotalRef.current = Math.random() * 3000 + 4000;
    rotateWheel();
  };

  const rotateWheel = () => {
    spinTimeRef.current += 30;
    if (spinTimeRef.current >= spinTimeTotalRef.current) {
      stopRotate();
      return;
    }
    const spinAngleStart = 50;
    const progress = spinTimeRef.current / spinTimeTotalRef.current;
    // Ease out cubic
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const speed = spinAngleStart * (1 - easeOut(progress));
    startAngleRef.current += (speed * Math.PI) / 180;
    drawWheel();
    requestAnimationFrame(rotateWheel);
  };

  const stopRotate = () => {
    setSpinning(false);
    const arc = Math.PI * 2 / items.length;
    // Angle representing the pointing direction (pointing top center: -Math.PI / 2)
    // Find index corresponding to the pointer
    let angle = (startAngleRef.current * 180 / Math.PI) % 360;
    // Pointer is at -90 degrees (270 degrees in canvas terms)
    // Normalise to [0, 360)
    const arcDegrees = 360 / items.length;
    const degreesPointer = 270;
    let winnerIndex = Math.floor((degreesPointer - angle + 360) / arcDegrees) % items.length;
    if (winnerIndex < 0) winnerIndex += items.length;
    setWinner(items[winnerIndex]);
  };

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <VStack spacing={6} maxW="lg" mx="auto" align="center">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
        <VStack spacing={3}>
          <FormControl>
            <FormLabel>Tambah Pilihan</FormLabel>
            <HStack>
              <Input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Tulis opsi..." onKeyDown={e => e.key === 'Enter' && addItem()} />
              <Button onClick={addItem} colorScheme="brand">Tambah</Button>
            </HStack>
          </FormControl>
          <VStack align="stretch" w="full" maxH="250px" overflowY="auto" border="1px solid" borderColor="gray.200" borderRadius="lg" p={2} spacing={1}>
            {items.map((it, idx) => (
              <Flex key={idx} justify="space-between" align="center" bg="gray.50" _dark={{ bg: 'gray.800' }} p={1} pl={3} borderRadius="md">
                <Text fontSize="sm">{it}</Text>
                <IconButton icon={<FaTrash />} size="xs" variant="ghost" colorScheme="red" onClick={() => removeItem(idx)} />
              </Flex>
            ))}
          </VStack>
        </VStack>

        <VStack justify="center">
          <canvas ref={canvasRef} width={280} height={280} style={{ maxWidth: '100%', height: 'auto', background: '#FFF', borderRadius: '50%' }} />
          <Button colorScheme="brand" onClick={spin} isLoading={spinning} w="full" mt={3} size="lg">PUTAR RODA</Button>
        </VStack>
      </SimpleGrid>

      {winner && (
        <Box p={4} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center" w="full">
          <Text fontSize="sm" color="gray.500">Pilihan Terpilih:</Text>
          <Text fontSize="3xl" fontWeight="bold" color="brand.500">{winner}</Text>
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ DICE ROLLER ═══════ */
const DiceRoller = () => {
  const [dices, setDices] = useState([1]);
  const [numDices, setNumDices] = useState(1);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      const results = [];
      for (let i = 0; i < numDices; i++) {
        results.push(Math.floor(Math.random() * 6) + 1);
      }
      setDices(results);
      setRolling(false);
    }, 800);
  };

  const getDots = (val) => {
    const dotsMap = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    return dotsMap[val] || [];
  };

  return (
    <VStack spacing={6} maxW="md" mx="auto" align="center">
      <HStack w="full">
        <FormControl>
          <FormLabel>Jumlah Dadu</FormLabel>
          <Input type="number" min={1} max={5} value={numDices} onChange={e => setNumDices(Number(e.target.value))} />
        </FormControl>
        <Button colorScheme="brand" onClick={roll} isLoading={rolling} alignSelf="flex-end" w="120px">Lempar</Button>
      </HStack>

      <Flex wrap="wrap" gap={6} justify="center" my={4}>
        {dices.map((val, idx) => (
          <Box key={idx} w="80px" h="80px" bg="white" border="2px solid" borderColor="gray.300" borderRadius="xl" boxShadow="lg" p={2} position="relative"
            animation={rolling ? 'shake 0.5s infinite' : ''} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: '4px'
            }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <Center key={i}>
                {getDots(val).includes(i) && <Box w="12px" h="12px" bg="gray.800" borderRadius="50%" />}
              </Center>
            ))}
          </Box>
        ))}
      </Flex>

      <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(0px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(2px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
      `}</style>
    </VStack>
  );
};

/* ═══════ COIN FLIP ═══════ */
const CoinFlip = () => {
  const [result, setResult] = useState('HEAD');
  const [flipping, setFlipping] = useState(false);
  const [degrees, setDegrees] = useState(0);

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    const outcome = Math.random() < 0.5 ? 'HEAD' : 'TAIL';
    // Spin multiple times
    const nextDegrees = degrees + 1800 + (outcome === 'HEAD' ? 0 : 180);
    setDegrees(nextDegrees);
    
    setTimeout(() => {
      setResult(outcome);
      setFlipping(false);
    }, 1000);
  };

  return (
    <VStack spacing={6} maxW="xs" mx="auto" align="center">
      <Box w="120px" h="120px" style={{ perspective: '1000px' }}>
        <Box w="full" h="full" style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          transform: `rotateY(${degrees}deg)`
        }} position="relative">
          {/* Head Side */}
          <Center w="full" h="full" bg="yellow.400" border="4px solid" borderColor="yellow.500" borderRadius="50%" position="absolute" style={{ backfaceVisibility: 'hidden' }}>
            <VStack spacing={0}>
              <Text fontSize="sm" fontWeight="bold" color="yellow.900">HEAD</Text>
              <Text fontSize="2xl">👑</Text>
            </VStack>
          </Center>
          {/* Tail Side */}
          <Center w="full" h="full" bg="gray.300" border="4px solid" borderColor="gray.400" borderRadius="50%" position="absolute" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <VStack spacing={0}>
              <Text fontSize="sm" fontWeight="bold" color="gray.800">TAIL</Text>
              <Text fontSize="2xl">⚜️</Text>
            </VStack>
          </Center>
        </Box>
      </Box>

      <Button colorScheme="brand" onClick={flip} isLoading={flipping} size="lg" w="full">LEMPAR KOIN</Button>

      {!flipping && (
        <Text fontSize="xl" fontWeight="bold">Hasil: {result === 'HEAD' ? 'ANGKA (👑)' : 'GAMBAR (⚜️)'}</Text>
      )}
    </VStack>
  );
};

/* ═══════ DISPATCHER ═══════ */
const RandomTools = ({ tool }) => {
  switch (tool.config) {
    case 'team': return <TeamPicker />;
    case 'wheel': return <WheelSpinner />;
    case 'dice': return <DiceRoller />;
    case 'coin': return <CoinFlip />;
    default: return <Text>Tool tidak ditemukan.</Text>;
  }
};

export default RandomTools;
