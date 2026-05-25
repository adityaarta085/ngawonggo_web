/* eslint-disable */
import React, { useState } from 'react';
import {
  Box, Input, Button, Text, VStack, HStack, Select, SimpleGrid,
  Flex, useColorModeValue, Stat, StatLabel, StatNumber, StatHelpText,
  FormControl, FormLabel, RadioGroup, Radio, Stack, Divider,
  useToast, Badge, Progress
} from '@chakra-ui/react';
import ToolLayout from '../components/ToolLayout';

/* ───────── helpers ───────── */
const fmt = (n) => {
  if (n === undefined || n === null || isNaN(n)) return '0';
  return Number(n).toLocaleString('id-ID', { maximumFractionDigits: 4 });
};
const fmtRp = (n) => `Rp ${fmt(n)}`;

/* ───────── CALCULATOR CONFIGS ───────── */

// ────── BASIC ──────
const BasicCalc = () => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [fresh, setFresh] = useState(true);
  const btnBg = useColorModeValue('gray.100', 'gray.700');

  const input = (v) => {
    if (fresh) { setDisplay(v); setFresh(false); }
    else setDisplay(display === '0' && v !== '.' ? v : display + v);
  };
  const operate = (nextOp) => {
    const cur = parseFloat(display);
    if (prev !== null && op) {
      let r = prev;
      if (op === '+') r = prev + cur;
      if (op === '-') r = prev - cur;
      if (op === '×') r = prev * cur;
      if (op === '÷') r = cur !== 0 ? prev / cur : 'Error';
      setDisplay(String(r));
      setPrev(r);
    } else { setPrev(cur); }
    setOp(nextOp);
    setFresh(true);
  };
  const equals = () => { operate(null); setOp(null); };
  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); setFresh(true); };

  const Btn = ({ v, color, wide, onClick }) => (
    <Button
      h="60px" fontSize="xl" bg={color || btnBg} gridColumn={wide ? 'span 2' : undefined}
      onClick={onClick || (() => input(v))} _hover={{ opacity: 0.8 }}
    >{v}</Button>
  );

  return (
    <Box maxW="320px" mx="auto">
      <Box bg={useColorModeValue('gray.50', 'gray.900')} p={4} borderRadius="xl" mb={4} textAlign="right">
        <Text fontSize="sm" color="gray.400" h="20px">{prev !== null ? `${prev} ${op || ''}` : ''}</Text>
        <Text fontSize="3xl" fontWeight="bold" fontFamily="monospace">{display}</Text>
      </Box>
      <SimpleGrid columns={4} spacing={2}>
        <Btn v="C" color="red.100" onClick={clear} />
        <Btn v="±" onClick={() => setDisplay(String(-parseFloat(display)))} />
        <Btn v="%" onClick={() => setDisplay(String(parseFloat(display) / 100))} />
        <Btn v="÷" color="brand.100" onClick={() => operate('÷')} />
        {['7','8','9'].map(n => <Btn key={n} v={n} />)}
        <Btn v="×" color="brand.100" onClick={() => operate('×')} />
        {['4','5','6'].map(n => <Btn key={n} v={n} />)}
        <Btn v="-" color="brand.100" onClick={() => operate('-')} />
        {['1','2','3'].map(n => <Btn key={n} v={n} />)}
        <Btn v="+" color="brand.100" onClick={() => operate('+')} />
        <Btn v="0" wide onClick={() => input('0')} />
        <Btn v="." onClick={() => input('.')} />
        <Btn v="=" color="brand.400" onClick={equals} />
      </SimpleGrid>
    </Box>
  );
};

// ────── SCIENTIFIC ──────
const ScientificCalc = () => {
  const [display, setDisplay] = useState('0');
  const [isDeg, setIsDeg] = useState(true);
  const btnBg = useColorModeValue('gray.100', 'gray.700');

  const input = (v) => setDisplay(display === '0' ? v : display + v);
  const clear = () => setDisplay('0');

  const evalExpr = () => {
    try {
      // eslint-disable-next-line no-eval
      const r = eval(display.replace(/×/g, '*').replace(/÷/g, '/'));
      setDisplay(String(r));
    } catch { setDisplay('Error'); }
  };

  const sciOp = (fn) => {
    const v = parseFloat(display);
    if (isNaN(v)) { setDisplay('Error'); return; }
    const angle = isDeg ? (v * Math.PI / 180) : v;
    let r;
    switch (fn) {
      case 'sin': r = Math.sin(angle); break;
      case 'cos': r = Math.cos(angle); break;
      case 'tan': r = Math.tan(angle); break;
      case 'ln': r = Math.log(v); break;
      case 'log': r = Math.log10(v); break;
      case '√': r = Math.sqrt(v); break;
      case 'x²': r = v * v; break;
      case 'x³': r = v * v * v; break;
      case '1/x': r = v !== 0 ? 1 / v : 'Error'; break;
      case 'n!': r = v < 0 || v > 170 ? 'Error' : factorial(Math.floor(v)); break;
      case 'π': r = Math.PI; break;
      case 'e': r = Math.E; break;
      default: r = v;
    }
    setDisplay(String(typeof r === 'number' ? parseFloat(r.toFixed(10)) : r));
  };

  const factorial = (n) => { if (n <= 1) return 1; let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };

  const SciBtn = ({ v, onClick, color }) => (
    <Button h="48px" fontSize="sm" bg={color || btnBg} onClick={onClick} _hover={{ opacity: 0.8 }}>{v}</Button>
  );

  return (
    <Box maxW="380px" mx="auto">
      <Box bg={useColorModeValue('gray.50', 'gray.900')} p={4} borderRadius="xl" mb={4} textAlign="right">
        <Text fontSize="3xl" fontWeight="bold" fontFamily="monospace" wordBreak="break-all">{display}</Text>
      </Box>
      <HStack mb={2}>
        <Badge colorScheme={isDeg ? 'brand' : 'gray'} cursor="pointer" onClick={() => setIsDeg(true)} px={3} py={1}>DEG</Badge>
        <Badge colorScheme={!isDeg ? 'brand' : 'gray'} cursor="pointer" onClick={() => setIsDeg(false)} px={3} py={1}>RAD</Badge>
      </HStack>
      <SimpleGrid columns={5} spacing={1}>
        <SciBtn v="sin" onClick={() => sciOp('sin')} color="purple.100" />
        <SciBtn v="cos" onClick={() => sciOp('cos')} color="purple.100" />
        <SciBtn v="tan" onClick={() => sciOp('tan')} color="purple.100" />
        <SciBtn v="ln" onClick={() => sciOp('ln')} color="purple.100" />
        <SciBtn v="log" onClick={() => sciOp('log')} color="purple.100" />
        <SciBtn v="√" onClick={() => sciOp('√')} color="teal.100" />
        <SciBtn v="x²" onClick={() => sciOp('x²')} color="teal.100" />
        <SciBtn v="x³" onClick={() => sciOp('x³')} color="teal.100" />
        <SciBtn v="1/x" onClick={() => sciOp('1/x')} color="teal.100" />
        <SciBtn v="n!" onClick={() => sciOp('n!')} color="teal.100" />
        <SciBtn v="π" onClick={() => sciOp('π')} color="orange.100" />
        <SciBtn v="e" onClick={() => sciOp('e')} color="orange.100" />
        <SciBtn v="(" onClick={() => input('(')} />
        <SciBtn v=")" onClick={() => input(')')} />
        <SciBtn v="C" onClick={clear} color="red.100" />
        {['7','8','9'].map(n => <SciBtn key={n} v={n} onClick={() => input(n)} />)}
        <SciBtn v="÷" onClick={() => input('÷')} color="brand.100" />
        <SciBtn v="⌫" onClick={() => setDisplay(display.length > 1 ? display.slice(0, -1) : '0')} color="red.100" />
        {['4','5','6'].map(n => <SciBtn key={n} v={n} onClick={() => input(n)} />)}
        <SciBtn v="×" onClick={() => input('×')} color="brand.100" />
        <SciBtn v="%" onClick={() => input('%')} />
        {['1','2','3'].map(n => <SciBtn key={n} v={n} onClick={() => input(n)} />)}
        <SciBtn v="-" onClick={() => input('-')} color="brand.100" />
        <SciBtn v="." onClick={() => input('.')} />
        <SciBtn v="0" onClick={() => input('0')} />
        <SciBtn v="00" onClick={() => input('00')} />
        <SciBtn v="+" onClick={() => input('+')} color="brand.100" />
        <SciBtn v="=" onClick={evalExpr} color="brand.400" />
      </SimpleGrid>
    </Box>
  );
};

// ────── PERCENT ──────
const PercentCalc = () => {
  const [val, setVal] = useState('');
  const [pct, setPct] = useState('');
  const [mode, setMode] = useState('of');
  const results = (() => {
    const v = parseFloat(val), p = parseFloat(pct);
    if (isNaN(v) || isNaN(p)) return null;
    if (mode === 'of') return { label: `${p}% dari ${fmt(v)}`, result: v * (p / 100) };
    if (mode === 'increase') return { label: `${fmt(v)} naik ${p}%`, result: v + v * (p / 100) };
    if (mode === 'decrease') return { label: `${fmt(v)} turun ${p}%`, result: v - v * (p / 100) };
    if (mode === 'whatpct') return { label: `${fmt(v)} adalah berapa % dari ${fmt(p)}`, result: (v / p) * 100, suffix: '%' };
    return null;
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <RadioGroup value={mode} onChange={setMode}>
        <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
          <Radio value="of">X% dari Y</Radio>
          <Radio value="increase">Naik X%</Radio>
          <Radio value="decrease">Turun X%</Radio>
          <Radio value="whatpct">Berapa % ?</Radio>
        </Stack>
      </RadioGroup>
      <FormControl><FormLabel>{mode === 'whatpct' ? 'Nilai' : 'Angka'}</FormLabel><Input type="number" value={val} onChange={e => setVal(e.target.value)} /></FormControl>
      <FormControl><FormLabel>{mode === 'whatpct' ? 'Dari Total' : 'Persen (%)'}</FormLabel><Input type="number" value={pct} onChange={e => setPct(e.target.value)} /></FormControl>
      {results && (
        <Stat p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center">
          <StatLabel>{results.label}</StatLabel>
          <StatNumber color="brand.500" fontSize="3xl">{fmt(results.result)}{results.suffix || ''}</StatNumber>
        </Stat>
      )}
    </VStack>
  );
};

// ────── DISCOUNT ──────
const DiscountCalc = () => {
  const [price, setPrice] = useState('');
  const [disc, setDisc] = useState('');
  const [disc2, setDisc2] = useState('');
  const r = (() => {
    const p = parseFloat(price), d = parseFloat(disc), d2 = parseFloat(disc2) || 0;
    if (isNaN(p) || isNaN(d)) return null;
    const afterFirst = p - (p * d / 100);
    const afterSecond = d2 > 0 ? afterFirst - (afterFirst * d2 / 100) : afterFirst;
    return { saved: p - afterSecond, final: afterSecond, totalDisc: ((p - afterSecond) / p * 100) };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Harga Awal</FormLabel><Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="100000" /></FormControl>
      <FormControl><FormLabel>Diskon Pertama (%)</FormLabel><Input type="number" value={disc} onChange={e => setDisc(e.target.value)} placeholder="20" /></FormControl>
      <FormControl><FormLabel>Diskon Kedua / Tambahan (%)</FormLabel><Input type="number" value={disc2} onChange={e => setDisc2(e.target.value)} placeholder="Opsional" /></FormControl>
      {r && (
        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4} w="full">
          <Stat p={4} bg="green.50" _dark={{ bg: 'green.900' }} borderRadius="xl" textAlign="center">
            <StatLabel>Harga Akhir</StatLabel><StatNumber color="green.500" fontSize="xl">{fmtRp(r.final)}</StatNumber>
          </Stat>
          <Stat p={4} bg="red.50" _dark={{ bg: 'red.900' }} borderRadius="xl" textAlign="center">
            <StatLabel>Hemat</StatLabel><StatNumber color="red.500" fontSize="xl">{fmtRp(r.saved)}</StatNumber>
          </Stat>
          <Stat p={4} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center">
            <StatLabel>Total Diskon</StatLabel><StatNumber color="brand.500" fontSize="xl">{r.totalDisc.toFixed(1)}%</StatNumber>
          </Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

// ────── TAX ──────
const TaxCalc = () => {
  const [amount, setAmount] = useState('');
  const [taxType, setTaxType] = useState('ppn');
  const [customRate, setCustomRate] = useState('11');
  const r = (() => {
    const a = parseFloat(amount);
    if (isNaN(a)) return null;
    let rate = taxType === 'ppn' ? 11 : taxType === 'pph21' ? 5 : parseFloat(customRate) || 0;
    const tax = a * rate / 100;
    return { base: a, rate, tax, total: a + tax };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Jenis Pajak</FormLabel>
        <Select value={taxType} onChange={e => setTaxType(e.target.value)}>
          <option value="ppn">PPN (11%)</option>
          <option value="pph21">PPh 21 (5%)</option>
          <option value="custom">Custom Rate</option>
        </Select>
      </FormControl>
      {taxType === 'custom' && <FormControl><FormLabel>Tarif (%)</FormLabel><Input type="number" value={customRate} onChange={e => setCustomRate(e.target.value)} /></FormControl>}
      <FormControl><FormLabel>Nilai Sebelum Pajak</FormLabel><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000000" /></FormControl>
      {r && (
        <Box w="full" p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl">
          <SimpleGrid columns={2} spacing={4}>
            <Stat><StatLabel>DPP</StatLabel><StatNumber fontSize="lg">{fmtRp(r.base)}</StatNumber></Stat>
            <Stat><StatLabel>Pajak ({r.rate}%)</StatLabel><StatNumber fontSize="lg" color="red.500">{fmtRp(r.tax)}</StatNumber></Stat>
            <Stat gridColumn="span 2"><StatLabel>Total</StatLabel><StatNumber fontSize="2xl" color="brand.500">{fmtRp(r.total)}</StatNumber></Stat>
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};

// ────── INTEREST ──────
const InterestCalc = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [type, setType] = useState('simple');
  const r = (() => {
    const p = parseFloat(principal), ra = parseFloat(rate) / 100, t = parseFloat(years);
    if (isNaN(p) || isNaN(ra) || isNaN(t)) return null;
    if (type === 'simple') {
      const interest = p * ra * t;
      return { interest, total: p + interest };
    }
    const total = p * Math.pow(1 + ra, t);
    return { interest: total - p, total };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <RadioGroup value={type} onChange={setType}><Stack direction="row"><Radio value="simple">Bunga Tunggal</Radio><Radio value="compound">Bunga Majemuk</Radio></Stack></RadioGroup>
      <FormControl><FormLabel>Modal Awal</FormLabel><Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} /></FormControl>
      <FormControl><FormLabel>Suku Bunga per Tahun (%)</FormLabel><Input type="number" value={rate} onChange={e => setRate(e.target.value)} /></FormControl>
      <FormControl><FormLabel>Jangka Waktu (Tahun)</FormLabel><Input type="number" value={years} onChange={e => setYears(e.target.value)} /></FormControl>
      {r && (
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full">
          <Stat p={4} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl"><StatLabel>Total Bunga</StatLabel><StatNumber color="orange.500">{fmtRp(r.interest)}</StatNumber></Stat>
          <Stat p={4} bg="green.50" _dark={{ bg: 'green.900' }} borderRadius="xl"><StatLabel>Total Akhir</StatLabel><StatNumber color="green.500">{fmtRp(r.total)}</StatNumber></Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

// ────── INSTALLMENT ──────
const InstallmentCalc = () => {
  const [loan, setLoan] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState('');
  const r = (() => {
    const p = parseFloat(loan), ra = parseFloat(rate) / 100 / 12, n = parseInt(months);
    if (isNaN(p) || isNaN(ra) || isNaN(n) || n <= 0) return null;
    if (ra === 0) return { monthly: p / n, totalPay: p, totalInterest: 0 };
    const monthly = p * (ra * Math.pow(1 + ra, n)) / (Math.pow(1 + ra, n) - 1);
    return { monthly, totalPay: monthly * n, totalInterest: (monthly * n) - p };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Jumlah Pinjaman</FormLabel><Input type="number" value={loan} onChange={e => setLoan(e.target.value)} placeholder="10000000" /></FormControl>
      <FormControl><FormLabel>Bunga per Tahun (%)</FormLabel><Input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="12" /></FormControl>
      <FormControl><FormLabel>Tenor (Bulan)</FormLabel><Input type="number" value={months} onChange={e => setMonths(e.target.value)} placeholder="12" /></FormControl>
      {r && (
        <Box w="full" p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl">
          <Stat textAlign="center" mb={4}><StatLabel>Cicilan per Bulan</StatLabel><StatNumber fontSize="3xl" color="brand.500">{fmtRp(r.monthly)}</StatNumber></Stat>
          <Divider my={4} />
          <SimpleGrid columns={2} spacing={4}>
            <Stat><StatLabel>Total Bayar</StatLabel><StatNumber fontSize="md">{fmtRp(r.totalPay)}</StatNumber></Stat>
            <Stat><StatLabel>Total Bunga</StatLabel><StatNumber fontSize="md" color="red.500">{fmtRp(r.totalInterest)}</StatNumber></Stat>
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};

// ────── BMI ──────
const BmiCalc = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const r = (() => {
    const w = parseFloat(weight), h = parseFloat(height) / 100;
    if (isNaN(w) || isNaN(h) || h <= 0) return null;
    const bmi = w / (h * h);
    let cat = 'Normal', color = 'green';
    if (bmi < 18.5) { cat = 'Kurus'; color = 'blue'; }
    else if (bmi < 25) { cat = 'Normal'; color = 'green'; }
    else if (bmi < 30) { cat = 'Gemuk'; color = 'orange'; }
    else { cat = 'Obesitas'; color = 'red'; }
    return { bmi: bmi.toFixed(1), cat, color, pct: Math.min((bmi / 40) * 100, 100) };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Berat Badan (kg)</FormLabel><Input type="number" value={weight} onChange={e => setWeight(e.target.value)} /></FormControl>
      <FormControl><FormLabel>Tinggi Badan (cm)</FormLabel><Input type="number" value={height} onChange={e => setHeight(e.target.value)} /></FormControl>
      {r && (
        <Box w="full" p={6} bg={`${r.color}.50`} _dark={{ bg: `${r.color}.900` }} borderRadius="xl" textAlign="center">
          <Text fontSize="5xl" fontWeight="bold" color={`${r.color}.500`}>{r.bmi}</Text>
          <Badge colorScheme={r.color} fontSize="lg" px={4} py={1} borderRadius="full">{r.cat}</Badge>
          <Progress value={r.pct} colorScheme={r.color} borderRadius="full" mt={4} />
          <HStack justify="space-between" mt={2} fontSize="xs" color="gray.500">
            <Text>Kurus</Text><Text>Normal</Text><Text>Gemuk</Text><Text>Obesitas</Text>
          </HStack>
        </Box>
      )}
    </VStack>
  );
};

// ────── CALORIE (BMR/TDEE) ──────
const CalorieCalc = () => {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activity, setActivity] = useState('1.55');
  const r = (() => {
    const a = parseInt(age), w = parseFloat(weight), h = parseFloat(height);
    if (isNaN(a) || isNaN(w) || isNaN(h)) return null;
    const bmr = gender === 'male'
      ? 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
      : 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    const tdee = bmr * parseFloat(activity);
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), deficit: Math.round(tdee - 500), surplus: Math.round(tdee + 500) };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <RadioGroup value={gender} onChange={setGender}><Stack direction="row"><Radio value="male">Laki-laki</Radio><Radio value="female">Perempuan</Radio></Stack></RadioGroup>
      <SimpleGrid columns={3} spacing={4} w="full">
        <FormControl><FormLabel>Usia</FormLabel><Input type="number" value={age} onChange={e => setAge(e.target.value)} /></FormControl>
        <FormControl><FormLabel>BB (kg)</FormLabel><Input type="number" value={weight} onChange={e => setWeight(e.target.value)} /></FormControl>
        <FormControl><FormLabel>TB (cm)</FormLabel><Input type="number" value={height} onChange={e => setHeight(e.target.value)} /></FormControl>
      </SimpleGrid>
      <FormControl><FormLabel>Aktivitas</FormLabel>
        <Select value={activity} onChange={e => setActivity(e.target.value)}>
          <option value="1.2">Sangat Jarang Olahraga</option>
          <option value="1.375">Olahraga Ringan (1-3x/minggu)</option>
          <option value="1.55">Olahraga Sedang (3-5x/minggu)</option>
          <option value="1.725">Olahraga Berat (6-7x/minggu)</option>
          <option value="1.9">Sangat Aktif / Atlet</option>
        </Select>
      </FormControl>
      {r && (
        <SimpleGrid columns={2} spacing={4} w="full">
          <Stat p={4} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center"><StatLabel>BMR</StatLabel><StatNumber>{fmt(r.bmr)}</StatNumber><StatHelpText>kkal/hari</StatHelpText></Stat>
          <Stat p={4} bg="green.50" _dark={{ bg: 'green.900' }} borderRadius="xl" textAlign="center"><StatLabel>TDEE</StatLabel><StatNumber color="green.500">{fmt(r.tdee)}</StatNumber><StatHelpText>kkal/hari</StatHelpText></Stat>
          <Stat p={4} bg="orange.50" _dark={{ bg: 'orange.900' }} borderRadius="xl" textAlign="center"><StatLabel>Defisit (-500)</StatLabel><StatNumber fontSize="md" color="orange.500">{fmt(r.deficit)}</StatNumber><StatHelpText>untuk turun BB</StatHelpText></Stat>
          <Stat p={4} bg="purple.50" _dark={{ bg: 'purple.900' }} borderRadius="xl" textAlign="center"><StatLabel>Surplus (+500)</StatLabel><StatNumber fontSize="md" color="purple.500">{fmt(r.surplus)}</StatNumber><StatHelpText>untuk naik BB</StatHelpText></Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

// ────── AGE ──────
const AgeCalc = () => {
  const [birth, setBirth] = useState('');
  const r = (() => {
    if (!birth) return null;
    const b = new Date(birth), now = new Date();
    if (b > now) return null;
    let y = now.getFullYear() - b.getFullYear(), m = now.getMonth() - b.getMonth(), d = now.getDate() - b.getDate();
    if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const totalDays = Math.floor((now - b) / (1000 * 60 * 60 * 24));
    const nextBday = new Date(now.getFullYear(), b.getMonth(), b.getDate());
    if (nextBday < now) nextBday.setFullYear(nextBday.getFullYear() + 1);
    const daysToNext = Math.ceil((nextBday - now) / (1000 * 60 * 60 * 24));
    return { y, m, d, totalDays, weeks: Math.floor(totalDays / 7), hours: totalDays * 24, daysToNext };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Tanggal Lahir</FormLabel><Input type="date" value={birth} onChange={e => setBirth(e.target.value)} /></FormControl>
      {r && (
        <>
          <Stat p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center">
            <StatLabel>Usia Kamu</StatLabel>
            <StatNumber fontSize="3xl" color="brand.500">{r.y} Tahun, {r.m} Bulan, {r.d} Hari</StatNumber>
          </Stat>
          <SimpleGrid columns={{ base: 2, sm: 4 }} spacing={3} w="full">
            <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Total Hari</StatLabel><StatNumber fontSize="md">{fmt(r.totalDays)}</StatNumber></Stat>
            <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Minggu</StatLabel><StatNumber fontSize="md">{fmt(r.weeks)}</StatNumber></Stat>
            <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>Jam</StatLabel><StatNumber fontSize="md">{fmt(r.hours)}</StatNumber></Stat>
            <Stat p={3} bg="green.50" _dark={{ bg: 'green.800' }} borderRadius="lg" textAlign="center"><StatLabel>Ulang Tahun</StatLabel><StatNumber fontSize="md" color="green.500">{r.daysToNext} hari</StatNumber></Stat>
          </SimpleGrid>
        </>
      )}
    </VStack>
  );
};

// ────── TRAVEL TIME ──────
const TravelTimeCalc = () => {
  const [dist, setDist] = useState('');
  const [speed, setSpeed] = useState('');
  const r = (() => {
    const d = parseFloat(dist), s = parseFloat(speed);
    if (isNaN(d) || isNaN(s) || s <= 0) return null;
    const hours = d / s;
    const h = Math.floor(hours), m = Math.floor((hours - h) * 60), sec = Math.round(((hours - h) * 60 - m) * 60);
    return { hours, h, m, sec };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Jarak (km)</FormLabel><Input type="number" value={dist} onChange={e => setDist(e.target.value)} /></FormControl>
      <FormControl><FormLabel>Kecepatan (km/jam)</FormLabel><Input type="number" value={speed} onChange={e => setSpeed(e.target.value)} /></FormControl>
      {r && <Stat p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center"><StatLabel>Waktu Tempuh</StatLabel><StatNumber fontSize="3xl" color="brand.500">{r.h} jam {r.m} menit {r.sec} detik</StatNumber></Stat>}
    </VStack>
  );
};

// ────── AREA & VOLUME ──────
const AreaVolumeCalc = () => {
  const [shape, setShape] = useState('circle');
  const [d1, setD1] = useState('');
  const [d2, setD2] = useState('');
  const [d3, setD3] = useState('');
  const r = (() => {
    const a = parseFloat(d1), b = parseFloat(d2), c = parseFloat(d3);
    if (isNaN(a)) return null;
    switch (shape) {
      case 'circle': return { area: Math.PI * a * a, label: 'Luas Lingkaran' };
      case 'rect': return isNaN(b) ? null : { area: a * b, label: 'Luas Persegi Panjang' };
      case 'triangle': return isNaN(b) ? null : { area: 0.5 * a * b, label: 'Luas Segitiga' };
      case 'cube': return { area: 6 * a * a, volume: a * a * a, label: 'Kubus' };
      case 'sphere': return { area: 4 * Math.PI * a * a, volume: (4 / 3) * Math.PI * a * a * a, label: 'Bola' };
      case 'cylinder': return isNaN(b) ? null : { area: 2 * Math.PI * a * (a + b), volume: Math.PI * a * a * b, label: 'Tabung' };
      case 'cone': return isNaN(b) ? null : { area: Math.PI * a * (a + Math.sqrt(a * a + b * b)), volume: (1 / 3) * Math.PI * a * a * b, label: 'Kerucut' };
      case 'box': return (isNaN(b) || isNaN(c)) ? null : { area: 2 * (a * b + b * c + a * c), volume: a * b * c, label: 'Balok' };
      default: return null;
    }
  })();
  const labels = { circle: ['Jari-jari'], rect: ['Panjang', 'Lebar'], triangle: ['Alas', 'Tinggi'], cube: ['Sisi'], sphere: ['Jari-jari'], cylinder: ['Jari-jari', 'Tinggi'], cone: ['Jari-jari', 'Tinggi'], box: ['Panjang', 'Lebar', 'Tinggi'] };
  const l = labels[shape] || ['Ukuran 1'];
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Pilih Bangun</FormLabel>
        <Select value={shape} onChange={e => { setShape(e.target.value); setD1(''); setD2(''); setD3(''); }}>
          <option value="circle">Lingkaran</option><option value="rect">Persegi Panjang</option>
          <option value="triangle">Segitiga</option><option value="cube">Kubus</option>
          <option value="sphere">Bola</option><option value="cylinder">Tabung</option>
          <option value="cone">Kerucut</option><option value="box">Balok</option>
        </Select>
      </FormControl>
      <FormControl><FormLabel>{l[0]}</FormLabel><Input type="number" value={d1} onChange={e => setD1(e.target.value)} /></FormControl>
      {l.length >= 2 && <FormControl><FormLabel>{l[1]}</FormLabel><Input type="number" value={d2} onChange={e => setD2(e.target.value)} /></FormControl>}
      {l.length >= 3 && <FormControl><FormLabel>{l[2]}</FormLabel><Input type="number" value={d3} onChange={e => setD3(e.target.value)} /></FormControl>}
      {r && (
        <Box w="full" p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center">
          <Text fontWeight="bold" mb={2}>{r.label}</Text>
          <Stat><StatLabel>Luas Permukaan</StatLabel><StatNumber color="brand.500">{r.area.toFixed(4)}</StatNumber></Stat>
          {r.volume !== undefined && <Stat mt={2}><StatLabel>Volume</StatLabel><StatNumber color="green.500">{r.volume.toFixed(4)}</StatNumber></Stat>}
        </Box>
      )}
    </VStack>
  );
};

// ────── SPEED ──────
const SpeedCalc = () => {
  const [mode, setMode] = useState('speed');
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const r = (() => {
    const a = parseFloat(v1), b = parseFloat(v2);
    if (isNaN(a) || isNaN(b) || b <= 0) return null;
    if (mode === 'speed') return { label: 'Kecepatan', value: `${(a / b).toFixed(2)} km/jam` };
    if (mode === 'distance') return { label: 'Jarak', value: `${(a * b).toFixed(2)} km` };
    if (mode === 'time') { const h = a / b; return { label: 'Waktu', value: `${Math.floor(h)} jam ${Math.round((h % 1) * 60)} menit` }; }
    return null;
  })();
  const modeLabels = { speed: ['Jarak (km)', 'Waktu (jam)'], distance: ['Kecepatan (km/jam)', 'Waktu (jam)'], time: ['Jarak (km)', 'Kecepatan (km/jam)'] };
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <RadioGroup value={mode} onChange={setMode}><Stack direction="row"><Radio value="speed">Cari Kecepatan</Radio><Radio value="distance">Cari Jarak</Radio><Radio value="time">Cari Waktu</Radio></Stack></RadioGroup>
      <FormControl><FormLabel>{modeLabels[mode][0]}</FormLabel><Input type="number" value={v1} onChange={e => setV1(e.target.value)} /></FormControl>
      <FormControl><FormLabel>{modeLabels[mode][1]}</FormLabel><Input type="number" value={v2} onChange={e => setV2(e.target.value)} /></FormControl>
      {r && <Stat p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center"><StatLabel>{r.label}</StatLabel><StatNumber fontSize="3xl" color="brand.500">{r.value}</StatNumber></Stat>}
    </VStack>
  );
};

// ────── FRACTION ──────
const FractionCalc = () => {
  const [n1, setN1] = useState(''); const [d1, setD1] = useState('');
  const [n2, setN2] = useState(''); const [d2, setD2] = useState('');
  const [op, setOp] = useState('+');
  const toast = useToast();
  const gcd = (a, b) => b === 0 ? Math.abs(a) : gcd(b, a % b);
  const r = (() => {
    const a = parseInt(n1), b = parseInt(d1), c = parseInt(n2), d = parseInt(d2);
    if ([a, b, c, d].some(isNaN) || b === 0 || d === 0) return null;
    let rn, rd;
    if (op === '+') { rn = a * d + c * b; rd = b * d; }
    else if (op === '-') { rn = a * d - c * b; rd = b * d; }
    else if (op === '×') { rn = a * c; rd = b * d; }
    else { if (c === 0) return null; rn = a * d; rd = b * c; }
    const g = gcd(rn, rd);
    return { num: rn / g, den: rd / g, decimal: (rn / rd).toFixed(6) };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <Flex align="center" gap={3} wrap="wrap" justify="center">
        <VStack spacing={0}><Input type="number" w="80px" textAlign="center" value={n1} onChange={e => setN1(e.target.value)} placeholder="1" /><Divider borderColor="gray.400" /><Input type="number" w="80px" textAlign="center" value={d1} onChange={e => setD1(e.target.value)} placeholder="2" /></VStack>
        <Select w="70px" value={op} onChange={e => setOp(e.target.value)} fontWeight="bold" textAlign="center"><option value="+">+</option><option value="-">-</option><option value="×">×</option><option value="÷">÷</option></Select>
        <VStack spacing={0}><Input type="number" w="80px" textAlign="center" value={n2} onChange={e => setN2(e.target.value)} placeholder="3" /><Divider borderColor="gray.400" /><Input type="number" w="80px" textAlign="center" value={d2} onChange={e => setD2(e.target.value)} placeholder="4" /></VStack>
      </Flex>
      {r && (
        <Box w="full" p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center" cursor="pointer" onClick={() => { navigator.clipboard.writeText(`${r.num}/${r.den}`); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>
          <Text fontSize="sm" color="gray.500">Hasil</Text>
          <HStack justify="center" spacing={4}>
            <VStack spacing={0}><Text fontSize="3xl" fontWeight="bold" color="brand.500">{r.num}</Text><Divider borderColor="brand.500" borderWidth="2px" /><Text fontSize="3xl" fontWeight="bold" color="brand.500">{r.den}</Text></VStack>
            <Text fontSize="xl" color="gray.400">= {r.decimal}</Text>
          </HStack>
        </Box>
      )}
    </VStack>
  );
};

// ────── ROOT, POWER, LOGARITHM ──────
const RootLogCalc = () => {
  const [val, setVal] = useState('');
  const v = parseFloat(val);
  const valid = !isNaN(v);
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Masukkan Angka</FormLabel><Input type="number" value={val} onChange={e => setVal(e.target.value)} size="lg" /></FormControl>
      {valid && (
        <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={3} w="full">
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>√x</StatLabel><StatNumber fontSize="md">{Math.sqrt(v).toFixed(6)}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>∛x</StatLabel><StatNumber fontSize="md">{Math.cbrt(v).toFixed(6)}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>x²</StatLabel><StatNumber fontSize="md">{fmt(v * v)}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>x³</StatLabel><StatNumber fontSize="md">{fmt(v * v * v)}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>log₁₀(x)</StatLabel><StatNumber fontSize="md">{v > 0 ? Math.log10(v).toFixed(6) : 'N/A'}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>ln(x)</StatLabel><StatNumber fontSize="md">{v > 0 ? Math.log(v).toFixed(6) : 'N/A'}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>log₂(x)</StatLabel><StatNumber fontSize="md">{v > 0 ? Math.log2(v).toFixed(6) : 'N/A'}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>eˣ</StatLabel><StatNumber fontSize="md">{fmt(Math.exp(v))}</StatNumber></Stat>
          <Stat p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" textAlign="center"><StatLabel>10ˣ</StatLabel><StatNumber fontSize="md">{fmt(Math.pow(10, v))}</StatNumber></Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

/* ───────── MAIN COMPONENT ───────── */
const GenericCalculatorTool = ({ tool }) => {
  const renderCalc = () => {
    switch (tool.config) {
      case 'basic': return <BasicCalc />;
      case 'scientific': return <ScientificCalc />;
      case 'percent': return <PercentCalc />;
      case 'discount': return <DiscountCalc />;
      case 'tax': return <TaxCalc />;
      case 'interest': return <InterestCalc />;
      case 'installment': return <InstallmentCalc />;
      case 'bmi': return <BmiCalc />;
      case 'calorie': return <CalorieCalc />;
      case 'age': return <AgeCalc />;
      case 'travelTime': return <TravelTimeCalc />;
      case 'areaVolume': return <AreaVolumeCalc />;
      case 'speed': return <SpeedCalc />;
      case 'fraction': return <FractionCalc />;
      case 'rootLog': return <RootLogCalc />;
      // Business calculators handled here too
      case 'salary': return <SalaryCalc />;
      case 'margin': return <MarginCalc />;
      case 'markup': return <MarkupCalc />;
      case 'roi': return <RoiCalc />;
      case 'bep': return <BepCalc />;
      default: return <Text color="gray.500">Kalkulator belum tersedia.</Text>;
    }
  };
  return <ToolLayout tool={tool}>{renderCalc()}</ToolLayout>;
};

/* ─── Business Calculators ─── */
const SalaryCalc = () => {
  const [gross, setGross] = useState('');
  const [bpjsKes, setBpjsKes] = useState('1');
  const [bpjsTK, setBpjsTK] = useState('2');
  const [pph, setPph] = useState('5');
  const r = (() => {
    const g = parseFloat(gross);
    if (isNaN(g)) return null;
    const kes = g * parseFloat(bpjsKes) / 100;
    const tk = g * parseFloat(bpjsTK) / 100;
    const tax = g * parseFloat(pph) / 100;
    const thp = g - kes - tk - tax;
    return { gross: g, kes, tk, tax, thp, totalDeduct: kes + tk + tax };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Gaji Kotor</FormLabel><Input type="number" value={gross} onChange={e => setGross(e.target.value)} placeholder="5000000" /></FormControl>
      <SimpleGrid columns={3} spacing={3} w="full">
        <FormControl><FormLabel>BPJS Kes (%)</FormLabel><Input type="number" value={bpjsKes} onChange={e => setBpjsKes(e.target.value)} /></FormControl>
        <FormControl><FormLabel>BPJS TK (%)</FormLabel><Input type="number" value={bpjsTK} onChange={e => setBpjsTK(e.target.value)} /></FormControl>
        <FormControl><FormLabel>PPh (%)</FormLabel><Input type="number" value={pph} onChange={e => setPph(e.target.value)} /></FormControl>
      </SimpleGrid>
      {r && (
        <Box w="full" p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl">
          <Stat textAlign="center" mb={4}><StatLabel>Take Home Pay</StatLabel><StatNumber fontSize="3xl" color="green.500">{fmtRp(r.thp)}</StatNumber></Stat>
          <Divider my={3} />
          <SimpleGrid columns={2} spacing={3}>
            <Stat><StatLabel>Gaji Kotor</StatLabel><StatNumber fontSize="sm">{fmtRp(r.gross)}</StatNumber></Stat>
            <Stat><StatLabel>Total Potongan</StatLabel><StatNumber fontSize="sm" color="red.500">{fmtRp(r.totalDeduct)}</StatNumber></Stat>
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};

const MarginCalc = () => {
  const [cost, setCost] = useState('');
  const [sell, setSell] = useState('');
  const r = (() => {
    const c = parseFloat(cost), s = parseFloat(sell);
    if (isNaN(c) || isNaN(s) || s === 0) return null;
    const profit = s - c;
    return { profit, margin: (profit / s * 100).toFixed(2), markup: (profit / c * 100).toFixed(2) };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Harga Modal</FormLabel><Input type="number" value={cost} onChange={e => setCost(e.target.value)} /></FormControl>
      <FormControl><FormLabel>Harga Jual</FormLabel><Input type="number" value={sell} onChange={e => setSell(e.target.value)} /></FormControl>
      {r && (
        <SimpleGrid columns={3} spacing={4} w="full">
          <Stat p={4} bg="green.50" _dark={{ bg: 'green.900' }} borderRadius="xl" textAlign="center"><StatLabel>Profit</StatLabel><StatNumber fontSize="md" color="green.500">{fmtRp(r.profit)}</StatNumber></Stat>
          <Stat p={4} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center"><StatLabel>Margin</StatLabel><StatNumber fontSize="md" color="brand.500">{r.margin}%</StatNumber></Stat>
          <Stat p={4} bg="purple.50" _dark={{ bg: 'purple.900' }} borderRadius="xl" textAlign="center"><StatLabel>Markup</StatLabel><StatNumber fontSize="md" color="purple.500">{r.markup}%</StatNumber></Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

const MarkupCalc = () => {
  const [cost, setCost] = useState('');
  const [markupPct, setMarkupPct] = useState('');
  const r = (() => {
    const c = parseFloat(cost), m = parseFloat(markupPct);
    if (isNaN(c) || isNaN(m)) return null;
    const sell = c + (c * m / 100);
    return { sell, profit: sell - c };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Harga Modal</FormLabel><Input type="number" value={cost} onChange={e => setCost(e.target.value)} /></FormControl>
      <FormControl><FormLabel>Markup (%)</FormLabel><Input type="number" value={markupPct} onChange={e => setMarkupPct(e.target.value)} /></FormControl>
      {r && (
        <SimpleGrid columns={2} spacing={4} w="full">
          <Stat p={4} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center"><StatLabel>Harga Jual</StatLabel><StatNumber color="brand.500">{fmtRp(r.sell)}</StatNumber></Stat>
          <Stat p={4} bg="green.50" _dark={{ bg: 'green.900' }} borderRadius="xl" textAlign="center"><StatLabel>Keuntungan</StatLabel><StatNumber color="green.500">{fmtRp(r.profit)}</StatNumber></Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

const RoiCalc = () => {
  const [invest, setInvest] = useState('');
  const [ret, setRet] = useState('');
  const r = (() => {
    const i = parseFloat(invest), re = parseFloat(ret);
    if (isNaN(i) || isNaN(re) || i === 0) return null;
    return { roi: ((re - i) / i * 100).toFixed(2), profit: re - i };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Investasi Awal</FormLabel><Input type="number" value={invest} onChange={e => setInvest(e.target.value)} /></FormControl>
      <FormControl><FormLabel>Nilai Akhir / Pengembalian</FormLabel><Input type="number" value={ret} onChange={e => setRet(e.target.value)} /></FormControl>
      {r && (
        <Stat p={6} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center">
          <StatLabel>Return on Investment</StatLabel>
          <StatNumber fontSize="3xl" color={parseFloat(r.roi) >= 0 ? 'green.500' : 'red.500'}>{r.roi}%</StatNumber>
          <StatHelpText>Profit: {fmtRp(r.profit)}</StatHelpText>
        </Stat>
      )}
    </VStack>
  );
};

const BepCalc = () => {
  const [fixedCost, setFixedCost] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [varCostPerUnit, setVarCostPerUnit] = useState('');
  const r = (() => {
    const fc = parseFloat(fixedCost), p = parseFloat(pricePerUnit), vc = parseFloat(varCostPerUnit);
    if (isNaN(fc) || isNaN(p) || isNaN(vc) || (p - vc) <= 0) return null;
    const units = Math.ceil(fc / (p - vc));
    return { units, revenue: units * p };
  })();
  return (
    <VStack spacing={6} maxW="md" mx="auto">
      <FormControl><FormLabel>Biaya Tetap Total</FormLabel><Input type="number" value={fixedCost} onChange={e => setFixedCost(e.target.value)} /></FormControl>
      <FormControl><FormLabel>Harga Jual per Unit</FormLabel><Input type="number" value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)} /></FormControl>
      <FormControl><FormLabel>Biaya Variabel per Unit</FormLabel><Input type="number" value={varCostPerUnit} onChange={e => setVarCostPerUnit(e.target.value)} /></FormControl>
      {r && (
        <SimpleGrid columns={2} spacing={4} w="full">
          <Stat p={4} bg="brand.50" _dark={{ bg: 'brand.900' }} borderRadius="xl" textAlign="center"><StatLabel>BEP (Unit)</StatLabel><StatNumber color="brand.500">{fmt(r.units)} unit</StatNumber></Stat>
          <Stat p={4} bg="green.50" _dark={{ bg: 'green.900' }} borderRadius="xl" textAlign="center"><StatLabel>BEP (Rupiah)</StatLabel><StatNumber color="green.500">{fmtRp(r.revenue)}</StatNumber></Stat>
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default GenericCalculatorTool;
