import React, { useState } from 'react';
import {
  Box, Text, VStack, HStack, SimpleGrid, Button, Input, Textarea,
  FormControl, FormLabel, useToast, Stat, StatLabel, StatNumber,
  Select, Divider, Badge, Table, Thead, Tbody, Tr, Th, Td,
  Flex, RadioGroup, Radio, Stack
} from '@chakra-ui/react';
import { FaCopy } from 'react-icons/fa';

/* ═══════ GRAPH PLOTTER ═══════ */
const GraphPlotter = () => {
  const [expr, setExpr] = useState('x*x');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const canvasRef = React.useRef(null);

  const plot = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(i * w / 10, 0); ctx.lineTo(i * w / 10, h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i * h / 10); ctx.lineTo(w, i * h / 10); ctx.stroke(); }

    // Axes
    const xRange = xMax - xMin; const yScale = h / 2;
    ctx.strokeStyle = '#999'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    const zeroX = (-xMin / xRange) * w;
    ctx.beginPath(); ctx.moveTo(zeroX, 0); ctx.lineTo(zeroX, h); ctx.stroke();

    // Plot
    ctx.strokeStyle = '#137fec'; ctx.lineWidth = 2; ctx.beginPath();
    let yMin = Infinity, yMax = -Infinity;
    const points = [];
    for (let px = 0; px < w; px++) {
      const x = xMin + (px / w) * xRange;
      try {
        // eslint-disable-next-line no-new-func
        const y = new Function('x', `return ${expr}`)(x);
        if (isFinite(y)) { yMin = Math.min(yMin, y); yMax = Math.max(yMax, y); points.push({ px, y }); }
      } catch { /* skip */ }
    }
    const yRange = Math.max(Math.abs(yMin), Math.abs(yMax)) * 2 || 20;
    points.forEach((p, i) => {
      const py = h / 2 - (p.y / yRange) * h;
      if (i === 0) ctx.moveTo(p.px, py); else ctx.lineTo(p.px, py);
    });
    ctx.stroke();
  };

  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <FormControl><FormLabel>Fungsi f(x) =</FormLabel><Input value={expr} onChange={e => setExpr(e.target.value)} fontFamily="monospace" placeholder="Math.sin(x)" /></FormControl>
      <HStack w="full"><FormControl><FormLabel>x Min</FormLabel><Input type="number" value={xMin} onChange={e => setXMin(Number(e.target.value))} /></FormControl><FormControl><FormLabel>x Max</FormLabel><Input type="number" value={xMax} onChange={e => setXMax(Number(e.target.value))} /></FormControl></HStack>
      <Button colorScheme="brand" onClick={plot} w="full">Plot Grafik</Button>
      <Box w="full" bg="white" borderRadius="xl" border="1px solid" borderColor="gray.200" p={2}>
        <canvas ref={canvasRef} width={600} height={400} style={{ width: '100%', height: 'auto' }} />
      </Box>
      <Text fontSize="xs" color="gray.400">Contoh: x*x, Math.sin(x), Math.sqrt(x), x*x*x - 3*x</Text>
    </VStack>
  );
};

/* ═══════ EQUATION SOLVER ═══════ */
const Solver = () => {
  const [type, setType] = useState('linear');
  const [a, setA] = useState(''); const [b, setB] = useState(''); const [c, setC] = useState('');
  const result = (() => {
    const va = parseFloat(a), vb = parseFloat(b), vc = parseFloat(c);
    if (type === 'linear') {
      if (isNaN(va) || isNaN(vb) || va === 0) return null;
      return { type: 'linear', x: -vb / va };
    }
    if (isNaN(va) || isNaN(vb) || isNaN(vc) || va === 0) return null;
    const disc = vb * vb - 4 * va * vc;
    if (disc < 0) return { type: 'quad', disc, msg: 'Tidak ada akar real (diskriminan negatif)' };
    if (disc === 0) return { type: 'quad', disc, x1: -vb / (2 * va) };
    return { type: 'quad', disc, x1: (-vb + Math.sqrt(disc)) / (2 * va), x2: (-vb - Math.sqrt(disc)) / (2 * va) };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <RadioGroup value={type} onChange={setType}><Stack direction="row"><Radio value="linear">Linear (ax + b = 0)</Radio><Radio value="quadratic">Kuadrat (ax² + bx + c = 0)</Radio></Stack></RadioGroup>
      <HStack w="full">
        <FormControl><FormLabel>a</FormLabel><Input type="number" value={a} onChange={e => setA(e.target.value)} /></FormControl>
        <FormControl><FormLabel>b</FormLabel><Input type="number" value={b} onChange={e => setB(e.target.value)} /></FormControl>
        {type === 'quadratic' && <FormControl><FormLabel>c</FormLabel><Input type="number" value={c} onChange={e => setC(e.target.value)} /></FormControl>}
      </HStack>
      {result && (
        <Box w="full" p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center">
          {result.msg ? <Text color="red.500">{result.msg}</Text> : (
            <>
              <Stat><StatLabel>x₁</StatLabel><StatNumber color="brand.500">{result.x1 !== undefined ? result.x1.toFixed(6) : result.x.toFixed(6)}</StatNumber></Stat>
              {result.x2 !== undefined && <Stat mt={2}><StatLabel>x₂</StatLabel><StatNumber color="brand.500">{result.x2.toFixed(6)}</StatNumber></Stat>}
              {result.disc !== undefined && <Text fontSize="sm" color="gray.500" mt={2}>Diskriminan: {result.disc}</Text>}
            </>
          )}
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ AVERAGE / MEAN ═══════ */
const Average = () => {
  const [input, setInput] = useState('');
  const nums = input.split(/[,\s\n]+/).map(Number).filter(n => !isNaN(n));
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = nums.length > 0 ? sum / nums.length : 0;
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Masukkan angka (pisahkan dengan koma atau spasi)</FormLabel><Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="10, 20, 30, 40, 50" /></FormControl>
      {nums.length > 0 && (
        <SimpleGrid columns={3} spacing={3} w="full">
          <Stat p={3} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="lg" textAlign="center"><StatLabel>Rata-rata</StatLabel><StatNumber color="brand.500">{mean.toFixed(4)}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Jumlah</StatLabel><StatNumber>{sum}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Data</StatLabel><StatNumber>{nums.length}</StatNumber></Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

/* ═══════ MEDIAN & MODE ═══════ */
const Median = () => {
  const [input, setInput] = useState('');
  const nums = input.split(/[,\s\n]+/).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
  const median = nums.length > 0 ? (nums.length % 2 === 0 ? (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2 : nums[Math.floor(nums.length / 2)]) : 0;
  const freq = {}; nums.forEach(n => freq[n] = (freq[n] || 0) + 1);
  const maxFreq = Math.max(...Object.values(freq));
  const modes = Object.entries(freq).filter(([, v]) => v === maxFreq).map(([k]) => Number(k));
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Masukkan angka</FormLabel><Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="10, 20, 20, 30, 40" /></FormControl>
      {nums.length > 0 && (
        <SimpleGrid columns={2} spacing={3} w="full">
          <Stat p={4} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="lg" textAlign="center"><StatLabel>Median</StatLabel><StatNumber color="brand.500">{median}</StatNumber></Stat>
          <Stat p={4} bg="purple.50" _dark={{ bg: 'purple.900' }} borderRadius="lg" textAlign="center"><StatLabel>Modus</StatLabel><StatNumber color="purple.500">{modes.join(', ')}</StatNumber><Text fontSize="xs" color="gray.400">Frekuensi: {maxFreq}x</Text></Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

/* ═══════ PROBABILITY ═══════ */
const Probability = () => {
  const [favorable, setFavorable] = useState('');
  const [total, setTotal] = useState('');
  const f = parseFloat(favorable), t = parseFloat(total);
  const prob = (!isNaN(f) && !isNaN(t) && t > 0) ? f / t : null;
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Kejadian yang Diharapkan</FormLabel><Input type="number" value={favorable} onChange={e => setFavorable(e.target.value)} /></FormControl>
      <FormControl><FormLabel>Total Kemungkinan</FormLabel><Input type="number" value={total} onChange={e => setTotal(e.target.value)} /></FormControl>
      {prob !== null && (
        <SimpleGrid columns={3} spacing={3} w="full">
          <Stat p={3} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="lg" textAlign="center"><StatLabel>Probabilitas</StatLabel><StatNumber color="brand.500">{prob.toFixed(4)}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Persen</StatLabel><StatNumber>{(prob * 100).toFixed(2)}%</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Rasio</StatLabel><StatNumber fontSize="md">1:{Math.round(1 / prob)}</StatNumber></Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

/* ═══════ GEOMETRY ═══════ */
const Geometry = () => {
  const [a, setA] = useState(''); const [b, setB] = useState('');
  const va = parseFloat(a), vb = parseFloat(b);
  const hyp = (!isNaN(va) && !isNaN(vb)) ? Math.sqrt(va * va + vb * vb) : null;
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <Text fontWeight="bold">Teorema Pythagoras (a² + b² = c²)</Text>
      <HStack w="full">
        <FormControl><FormLabel>Sisi a</FormLabel><Input type="number" value={a} onChange={e => setA(e.target.value)} /></FormControl>
        <FormControl><FormLabel>Sisi b</FormLabel><Input type="number" value={b} onChange={e => setB(e.target.value)} /></FormControl>
      </HStack>
      {hyp !== null && <Stat p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center"><StatLabel>Sisi Miring (c)</StatLabel><StatNumber color="brand.500" fontSize="3xl">{hyp.toFixed(4)}</StatNumber></Stat>}
    </VStack>
  );
};

/* ═══════ TRIGONOMETRY ═══════ */
const Trigo = () => {
  const [angle, setAngle] = useState('');
  const [isDeg, setIsDeg] = useState(true);
  const v = parseFloat(angle);
  const rad = isDeg ? v * Math.PI / 180 : v;
  const valid = !isNaN(v);
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <HStack w="full"><FormControl flex={1}><FormLabel>Sudut</FormLabel><Input type="number" value={angle} onChange={e => setAngle(e.target.value)} /></FormControl>
        <RadioGroup value={isDeg ? 'deg' : 'rad'} onChange={v => setIsDeg(v === 'deg')}><Stack direction="row" mt={8}><Radio value="deg">DEG</Radio><Radio value="rad">RAD</Radio></Stack></RadioGroup>
      </HStack>
      {valid && (
        <SimpleGrid columns={3} spacing={3} w="full">
          {[['Sin', Math.sin(rad)], ['Cos', Math.cos(rad)], ['Tan', Math.tan(rad)], ['Csc', 1 / Math.sin(rad)], ['Sec', 1 / Math.cos(rad)], ['Cot', 1 / Math.tan(rad)]].map(([label, val]) => (
            <Stat key={label} p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>{label}</StatLabel><StatNumber fontSize="md">{isFinite(val) ? val.toFixed(6) : '∞'}</StatNumber></Stat>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

/* ═══════ PERIODIC TABLE ═══════ */
const ELEMENTS = [
  { n: 1, s: 'H', name: 'Hidrogen', m: 1.008 }, { n: 2, s: 'He', name: 'Helium', m: 4.003 }, { n: 3, s: 'Li', name: 'Litium', m: 6.941 }, { n: 4, s: 'Be', name: 'Berilium', m: 9.012 },
  { n: 5, s: 'B', name: 'Boron', m: 10.81 }, { n: 6, s: 'C', name: 'Karbon', m: 12.01 }, { n: 7, s: 'N', name: 'Nitrogen', m: 14.01 }, { n: 8, s: 'O', name: 'Oksigen', m: 16.00 },
  { n: 9, s: 'F', name: 'Fluor', m: 19.00 }, { n: 10, s: 'Ne', name: 'Neon', m: 20.18 }, { n: 11, s: 'Na', name: 'Natrium', m: 22.99 }, { n: 12, s: 'Mg', name: 'Magnesium', m: 24.31 },
  { n: 13, s: 'Al', name: 'Aluminium', m: 26.98 }, { n: 14, s: 'Si', name: 'Silikon', m: 28.09 }, { n: 15, s: 'P', name: 'Fosfor', m: 30.97 }, { n: 16, s: 'S', name: 'Belerang', m: 32.07 },
  { n: 17, s: 'Cl', name: 'Klor', m: 35.45 }, { n: 18, s: 'Ar', name: 'Argon', m: 39.95 }, { n: 19, s: 'K', name: 'Kalium', m: 39.10 }, { n: 20, s: 'Ca', name: 'Kalsium', m: 40.08 },
  { n: 26, s: 'Fe', name: 'Besi', m: 55.85 }, { n: 29, s: 'Cu', name: 'Tembaga', m: 63.55 }, { n: 30, s: 'Zn', name: 'Seng', m: 65.38 }, { n: 47, s: 'Ag', name: 'Perak', m: 107.87 },
  { n: 79, s: 'Au', name: 'Emas', m: 196.97 }, { n: 80, s: 'Hg', name: 'Raksa', m: 200.59 }, { n: 82, s: 'Pb', name: 'Timbal', m: 207.2 },
];

const PeriodicTable = () => {
  const [search, setSearch] = useState('');
  const filtered = search ? ELEMENTS.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.s.toLowerCase().includes(search.toLowerCase())) : ELEMENTS;
  return (
    <VStack spacing={4} maxW="lg" mx="auto">
      <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari unsur..." />
      <SimpleGrid columns={{ base: 3, sm: 4, md: 5 }} spacing={2} w="full">
        {filtered.map(el => (
          <Box key={el.n} p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center" cursor="pointer" _hover={{ bg: 'brand.50', _dark: { bg: 'brand.900' } }}>
            <Text fontSize="xs" color="gray.400">{el.n}</Text>
            <Text fontSize="2xl" fontWeight="bold" color="brand.500">{el.s}</Text>
            <Text fontSize="xs" noOfLines={1}>{el.name}</Text>
            <Text fontSize="xs" color="gray.400">{el.m}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};

/* ═══════ SIMPLE TOOLS ═══════ */
const PhysicsConv = () => {
  const toast = useToast();
  const [val, setVal] = useState('');
  const [type, setType] = useState('force');
  const v = parseFloat(val);
  const conversions = {
    force: { 'Newton': 1, 'dyne': 100000, 'kgf': 0.10197, 'lbf': 0.22481 },
    energy: { 'Joule': 1, 'kJ': 0.001, 'kalori': 0.239, 'kWh': 2.778e-7, 'eV': 6.242e18 },
    pressure: { 'Pascal': 1, 'atm': 9.869e-6, 'bar': 1e-5, 'mmHg': 0.00750, 'psi': 0.000145 },
  };
  const rates = conversions[type] || {};
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <Select value={type} onChange={e => setType(e.target.value)}><option value="force">Gaya</option><option value="energy">Energi</option><option value="pressure">Tekanan</option></Select>
      <FormControl><FormLabel>Nilai (dalam satuan dasar)</FormLabel><Input type="number" value={val} onChange={e => setVal(e.target.value)} /></FormControl>
      {!isNaN(v) && v !== 0 && (
        <SimpleGrid columns={2} spacing={2} w="full">
          {Object.entries(rates).map(([unit, rate]) => (
            <Box key={unit} p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" cursor="pointer" onClick={() => { navigator.clipboard.writeText(String(v * rate)); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>
              <Text fontSize="xs" color="gray.500">{unit}</Text><Text fontWeight="bold" fontSize="sm">{(v * rate).toExponential(4)}</Text>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

const Formulas = () => (
  <VStack spacing={4} maxW="lg" mx="auto" align="start">
    {[
      { cat: 'Luas & Keliling', items: ['Persegi: L = s², K = 4s', 'Persegi Panjang: L = p×l, K = 2(p+l)', 'Lingkaran: L = πr², K = 2πr', 'Segitiga: L = ½ × a × t'] },
      { cat: 'Volume', items: ['Kubus: V = s³', 'Balok: V = p×l×t', 'Tabung: V = πr²t', 'Kerucut: V = ⅓πr²t', 'Bola: V = ⁴⁄₃πr³'] },
      { cat: 'Fisika', items: ['v = s/t (kecepatan)', 'F = m×a (gaya)', 'E = mc² (energi)', 'P = F/A (tekanan)', 'W = F×s (usaha)'] },
      { cat: 'Trigonometri', items: ['sin θ = depan/miring', 'cos θ = samping/miring', 'tan θ = depan/samping', 'sin²θ + cos²θ = 1'] },
    ].map(section => (
      <Box key={section.cat} w="full" p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl">
        <Text fontWeight="bold" mb={2} color="brand.500">{section.cat}</Text>
        {section.items.map(item => <Text key={item} fontSize="sm" fontFamily="monospace" py={1}>• {item}</Text>)}
      </Box>
    ))}
  </VStack>
);

const ExerciseGen = () => {
  const [exercises, setExercises] = useState([]);
  const generate = () => {
    const ops = ['+', '-', '×', '÷'];
    const list = [];
    for (let i = 0; i < 10; i++) {
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a, b, answer;
      if (op === '÷') { b = Math.floor(Math.random() * 12) + 1; answer = Math.floor(Math.random() * 12) + 1; a = b * answer; }
      else { a = Math.floor(Math.random() * 100); b = Math.floor(Math.random() * 100); if (op === '+') answer = a + b; else if (op === '-') { if (a < b) [a, b] = [b, a]; answer = a - b; } else answer = a * b; }
      list.push({ q: `${a} ${op} ${b}`, a: answer });
    }
    setExercises(list);
  };
  const [showAnswers, setShowAnswers] = useState(false);
  return (
    <VStack spacing={4} maxW="md" mx="auto">
      <Button colorScheme="brand" onClick={() => { generate(); setShowAnswers(false); }} w="full" size="lg">Generate 10 Soal</Button>
      {exercises.length > 0 && (
        <>
          <SimpleGrid columns={2} spacing={3} w="full">
            {exercises.map((e, i) => (
              <Flex key={i} p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" justify="space-between">
                <Text fontFamily="monospace">{i + 1}. {e.q} = ?</Text>
                {showAnswers && <Badge colorScheme="green">{e.a}</Badge>}
              </Flex>
            ))}
          </SimpleGrid>
          <Button onClick={() => setShowAnswers(!showAnswers)} variant="outline">{showAnswers ? 'Sembunyikan Jawaban' : 'Tampilkan Jawaban'}</Button>
        </>
      )}
    </VStack>
  );
};

const Flashcard = () => {
  const [cards, setCards] = useState([{ front: '', back: '' }]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const addCard = () => setCards([...cards, { front: '', back: '' }]);
  const updateCard = (i, side, val) => { const n = [...cards]; n[i][side] = val; setCards(n); };
  const hasCards = cards.some(c => c.front && c.back);
  return (
    <VStack spacing={4} maxW="md" mx="auto">
      {!hasCards ? (
        <>
          {cards.map((c, i) => (
            <HStack key={i} w="full"><Input placeholder="Pertanyaan" value={c.front} onChange={e => updateCard(i, 'front', e.target.value)} /><Input placeholder="Jawaban" value={c.back} onChange={e => updateCard(i, 'back', e.target.value)} /></HStack>
          ))}
          <Button onClick={addCard} variant="outline" size="sm">+ Tambah Kartu</Button>
        </>
      ) : (
        <Box w="full" h="250px" bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="2xl" display="flex" alignItems="center" justifyContent="center" cursor="pointer" onClick={() => setFlipped(!flipped)} p={8}>
          <Text fontSize="2xl" fontWeight="bold" textAlign="center">{flipped ? cards[current]?.back : cards[current]?.front}</Text>
        </Box>
      )}
      {hasCards && (
        <HStack>
          <Button onClick={() => { setCurrent(Math.max(0, current - 1)); setFlipped(false); }} isDisabled={current === 0}>← Prev</Button>
          <Badge px={3} py={1}>{current + 1} / {cards.filter(c => c.front && c.back).length}</Badge>
          <Button onClick={() => { setCurrent(Math.min(cards.filter(c => c.front && c.back).length - 1, current + 1)); setFlipped(false); }} isDisabled={current >= cards.filter(c => c.front && c.back).length - 1}>Next →</Button>
        </HStack>
      )}
    </VStack>
  );
};

/* ═══════ DISPATCHER ═══════ */
const MathTools = ({ tool }) => {
  switch (tool.config) {
    case 'graph': return <GraphPlotter />;
    case 'solver': return <Solver />;
    case 'average': return <Average />;
    case 'median': return <Median />;
    case 'probability': return <Probability />;
    case 'geometry': return <Geometry />;
    case 'trigo': return <Trigo />;
    case 'physics': return <PhysicsConv />;
    case 'periodic': return <PeriodicTable />;
    case 'formulas': return <Formulas />;
    case 'exercise': return <ExerciseGen />;
    case 'flashcard': return <Flashcard />;
    default: return <Text>Tool tidak ditemukan.</Text>;
  }
};

export default MathTools;
