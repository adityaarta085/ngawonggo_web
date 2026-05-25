/* eslint-disable */
import React, { useState, useCallback } from 'react';
import { Box, Input, Button, Flex, Text, VStack, Select, useToast, SimpleGrid, FormControl, FormLabel, HStack } from '@chakra-ui/react';
import { FaCopy, FaExchangeAlt } from 'react-icons/fa';
import ToolLayout from '../components/ToolLayout';

/* ═══════ CONVERSION DATA ═══════ */
const conversionRates = {
  length: { m: 1, cm: 100, mm: 1000, km: 0.001, inch: 39.3701, feet: 3.28084, yard: 1.09361, mile: 0.000621371 },
  weight: { kg: 1, gram: 1000, mg: 1000000, ton: 0.001, pound: 2.20462, ounce: 35.274, kwintal: 0.01 },
  time: { jam: 1, menit: 60, detik: 3600, hari: 1 / 24, minggu: 1 / 168, bulan: 1 / 720, tahun: 1 / 8760 },
  volume: { liter: 1, ml: 1000, 'cm³': 1000, 'm³': 0.001, galon: 0.264172, 'fl oz': 33.814, pint: 2.11338 },
  area: { 'm²': 1, 'cm²': 10000, 'km²': 0.000001, hektar: 0.0001, acre: 0.000247105, 'ft²': 10.7639 },
  speed: { 'km/h': 1, 'm/s': 0.277778, mph: 0.621371, knot: 0.539957 },
  data: { byte: 1, KB: 1 / 1024, MB: 1 / 1048576, GB: 1 / 1073741824, TB: 1 / 1099511627776, bit: 8 },
};

/* ═══════ TEMPERATURE (special formula) ═══════ */
const TempConverter = () => {
  const [val, setVal] = useState('');
  const [from, setFrom] = useState('celsius');
  const [to, setTo] = useState('fahrenheit');
  const toast = useToast();

  const convert = useCallback(() => {
    const v = parseFloat(val);
    if (isNaN(v)) return null;
    // Convert to Celsius first
    let c;
    if (from === 'celsius') c = v;
    else if (from === 'fahrenheit') c = (v - 32) * 5 / 9;
    else if (from === 'kelvin') c = v - 273.15;
    else if (from === 'reamur') c = v * 5 / 4;
    else c = v;
    // Convert from Celsius to target
    if (to === 'celsius') return c.toFixed(4);
    if (to === 'fahrenheit') return ((c * 9 / 5) + 32).toFixed(4);
    if (to === 'kelvin') return (c + 273.15).toFixed(4);
    if (to === 'reamur') return (c * 4 / 5).toFixed(4);
    return c.toFixed(4);
  }, [val, from, to]);

  const result = convert();
  const units = ['celsius', 'fahrenheit', 'kelvin', 'reamur'];
  const labels = { celsius: '°C', fahrenheit: '°F', kelvin: 'K', reamur: '°R' };

  return (
    <VStack spacing={6} align="stretch" maxW="lg" mx="auto">
      <FormControl><FormLabel fontWeight="bold">Nilai</FormLabel><Input type="number" value={val} onChange={e => setVal(e.target.value)} size="lg" /></FormControl>
      <Flex align="center" gap={4}>
        <Box flex={1}><FormLabel fontWeight="bold">Dari</FormLabel><Select value={from} onChange={e => setFrom(e.target.value)} size="lg">{units.map(u => <option key={u} value={u}>{labels[u]} ({u})</option>)}</Select></Box>
        <Button mt={8} onClick={() => { setFrom(to); setTo(from); }} borderRadius="full" px={0} w={12}><FaExchangeAlt /></Button>
        <Box flex={1}><FormLabel fontWeight="bold">Ke</FormLabel><Select value={to} onChange={e => setTo(e.target.value)} size="lg">{units.map(u => <option key={u} value={u}>{labels[u]} ({u})</option>)}</Select></Box>
      </Flex>
      {result !== null && val && (
        <Box p={6} bg="gray.50" _dark={{ bg: 'gray.900' }} borderRadius="xl" textAlign="center">
          <Text color="gray.500" mb={2}>{val} {labels[from]} =</Text>
          <Flex justify="center" align="center" gap={3}>
            <Text fontSize="3xl" fontWeight="bold" color="brand.500">{result} {labels[to]}</Text>
            <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(result); toast({ title: 'Disalin', status: 'success', duration: 2000 }); }}><FaCopy /></Button>
          </Flex>
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ CURRENCY ═══════ */
const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('IDR');
  const [to, setTo] = useState('USD');
  const toast = useToast();

  // Static rates (relative to USD)
  const rates = { USD: 1, IDR: 16450, EUR: 0.92, GBP: 0.79, JPY: 157.5, SGD: 1.35, MYR: 4.72, AUD: 1.53, CNY: 7.24, KRW: 1380, THB: 36.2, PHP: 58.5, INR: 83.4, SAR: 3.75 };
  const currencies = Object.keys(rates);

  const result = (() => {
    const v = parseFloat(amount);
    if (isNaN(v)) return null;
    const inUsd = v / rates[from];
    return (inUsd * rates[to]).toFixed(4);
  })();

  return (
    <VStack spacing={6} align="stretch" maxW="lg" mx="auto">
      <Text fontSize="sm" color="orange.500" bg="orange.50" _dark={{ bg: 'orange.900' }} p={3} borderRadius="md">Kurs statis untuk referensi. Data tidak realtime.</Text>
      <FormControl><FormLabel fontWeight="bold">Jumlah</FormLabel><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} size="lg" /></FormControl>
      <Flex align="center" gap={4}>
        <Box flex={1}><FormLabel fontWeight="bold">Dari</FormLabel><Select value={from} onChange={e => setFrom(e.target.value)} size="lg">{currencies.map(c => <option key={c} value={c}>{c}</option>)}</Select></Box>
        <Button mt={8} onClick={() => { setFrom(to); setTo(from); }} borderRadius="full" px={0} w={12}><FaExchangeAlt /></Button>
        <Box flex={1}><FormLabel fontWeight="bold">Ke</FormLabel><Select value={to} onChange={e => setTo(e.target.value)} size="lg">{currencies.map(c => <option key={c} value={c}>{c}</option>)}</Select></Box>
      </Flex>
      {result !== null && amount && (
        <Box p={6} bg="gray.50" _dark={{ bg: 'gray.900' }} borderRadius="xl" textAlign="center">
          <Text color="gray.500" mb={2}>{Number(amount).toLocaleString()} {from} =</Text>
          <Flex justify="center" align="center" gap={3}>
            <Text fontSize="3xl" fontWeight="bold" color="brand.500">{Number(result).toLocaleString('id-ID', { maximumFractionDigits: 4 })} {to}</Text>
            <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(result); toast({ title: 'Disalin', status: 'success', duration: 2000 }); }}><FaCopy /></Button>
          </Flex>
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ ROMAN NUMERAL ═══════ */
const RomanConverter = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('toRoman');
  const toast = useToast();

  const toRoman = (num) => {
    if (num < 1 || num > 3999) return 'Masukkan angka 1-3999';
    const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    let result = '';
    for (let i = 0; i < vals.length; i++) {
      while (num >= vals[i]) { result += syms[i]; num -= vals[i]; }
    }
    return result;
  };

  const fromRoman = (str) => {
    const map = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    let result = 0;
    const s = str.toUpperCase();
    for (let i = 0; i < s.length; i++) {
      if (!map[s[i]]) return 'Karakter tidak valid';
      if (i + 1 < s.length && map[s[i]] < map[s[i + 1]]) { result -= map[s[i]]; }
      else { result += map[s[i]]; }
    }
    return result;
  };

  const result = (() => {
    if (!input) return null;
    if (mode === 'toRoman') {
      const n = parseInt(input);
      if (isNaN(n)) return 'Masukkan angka valid';
      return toRoman(n);
    }
    return String(fromRoman(input));
  })();

  return (
    <VStack spacing={6} align="stretch" maxW="lg" mx="auto">
      <HStack>
        <Button flex={1} colorScheme={mode === 'toRoman' ? 'brand' : 'gray'} variant={mode === 'toRoman' ? 'solid' : 'outline'} onClick={() => { setMode('toRoman'); setInput(''); }}>Desimal → Romawi</Button>
        <Button flex={1} colorScheme={mode === 'fromRoman' ? 'brand' : 'gray'} variant={mode === 'fromRoman' ? 'solid' : 'outline'} onClick={() => { setMode('fromRoman'); setInput(''); }}>Romawi → Desimal</Button>
      </HStack>
      <FormControl>
        <FormLabel fontWeight="bold">{mode === 'toRoman' ? 'Angka Desimal' : 'Angka Romawi'}</FormLabel>
        <Input value={input} onChange={e => setInput(e.target.value)} size="lg" placeholder={mode === 'toRoman' ? '2024' : 'MMXXIV'} />
      </FormControl>
      {result !== null && (
        <Box p={6} bg="gray.50" _dark={{ bg: 'gray.900' }} borderRadius="xl" textAlign="center" cursor="pointer" onClick={() => { navigator.clipboard.writeText(String(result)); toast({ title: 'Disalin', status: 'success', duration: 2000 }); }}>
          <Text color="gray.500" mb={2}>Hasil</Text>
          <Text fontSize="3xl" fontWeight="bold" color="brand.500" letterSpacing="wider">{result}</Text>
        </Box>
      )}
    </VStack>
  );
};

/* ═══════ NUMBER BASE ═══════ */
const BaseConverter = () => {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState('10');
  const toast = useToast();

  const results = (() => {
    if (!input) return null;
    try {
      const dec = parseInt(input, parseInt(fromBase));
      if (isNaN(dec)) return null;
      return {
        bin: dec.toString(2),
        oct: dec.toString(8),
        dec: dec.toString(10),
        hex: dec.toString(16).toUpperCase(),
      };
    } catch { return null; }
  })();

  return (
    <VStack spacing={6} align="stretch" maxW="lg" mx="auto">
      <FormControl>
        <FormLabel fontWeight="bold">Basis Input</FormLabel>
        <Select value={fromBase} onChange={e => setFromBase(e.target.value)} size="lg">
          <option value="2">Biner (2)</option>
          <option value="8">Oktal (8)</option>
          <option value="10">Desimal (10)</option>
          <option value="16">Heksadesimal (16)</option>
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel fontWeight="bold">Nilai</FormLabel>
        <Input value={input} onChange={e => setInput(e.target.value)} size="lg" fontFamily="monospace" placeholder={fromBase === '2' ? '1010' : fromBase === '16' ? 'FF' : '42'} />
      </FormControl>
      {results && (
        <SimpleGrid columns={2} spacing={3}>
          {[
            { label: 'Biner (2)', value: results.bin },
            { label: 'Oktal (8)', value: results.oct },
            { label: 'Desimal (10)', value: results.dec },
            { label: 'Hex (16)', value: results.hex },
          ].map(r => (
            <Box key={r.label} p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl" cursor="pointer"
              onClick={() => { navigator.clipboard.writeText(r.value); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>
              <Text fontSize="sm" color="gray.500" mb={1}>{r.label}</Text>
              <Text fontWeight="bold" fontFamily="monospace" fontSize="lg" wordBreak="break-all" color="brand.500">{r.value}</Text>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

/* ═══════ COLOR CONVERTER ═══════ */
const ColorConverter = () => {
  const [hex, setHex] = useState('#3498db');
  const toast = useToast();

  const hexToRgb = (h) => {
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    return { r, g, b };
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
        default: break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(hex);

  return (
    <VStack spacing={6} align="stretch" maxW="lg" mx="auto">
      <HStack spacing={4}>
        <FormControl flex={1}>
          <FormLabel fontWeight="bold">Kode HEX</FormLabel>
          <Input value={hex} onChange={e => setHex(e.target.value)} size="lg" fontFamily="monospace" maxLength={7} />
        </FormControl>
        <Box w="60px" h="60px" borderRadius="xl" mt={8} border="2px solid" borderColor="gray.200" bg={isValidHex ? hex : '#ccc'} />
      </HStack>

      <Input type="color" value={isValidHex ? hex : '#000000'} onChange={e => setHex(e.target.value)} h="50px" p={1} cursor="pointer" borderRadius="xl" />

      {isValidHex && (
        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
          <Box p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl" cursor="pointer"
            onClick={() => { navigator.clipboard.writeText(hex.toUpperCase()); toast({ title: 'HEX disalin', status: 'success', duration: 1500 }); }}>
            <Text fontSize="sm" color="gray.500" mb={1}>HEX</Text>
            <Text fontWeight="bold" fontFamily="monospace" color="brand.500">{hex.toUpperCase()}</Text>
          </Box>
          <Box p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl" cursor="pointer"
            onClick={() => { navigator.clipboard.writeText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`); toast({ title: 'RGB disalin', status: 'success', duration: 1500 }); }}>
            <Text fontSize="sm" color="gray.500" mb={1}>RGB</Text>
            <Text fontWeight="bold" fontFamily="monospace" color="brand.500">rgb({rgb.r}, {rgb.g}, {rgb.b})</Text>
          </Box>
          <Box p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="xl" cursor="pointer"
            onClick={() => { navigator.clipboard.writeText(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`); toast({ title: 'HSL disalin', status: 'success', duration: 1500 }); }}>
            <Text fontSize="sm" color="gray.500" mb={1}>HSL</Text>
            <Text fontWeight="bold" fontFamily="monospace" color="brand.500">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</Text>
          </Box>
        </SimpleGrid>
      )}
    </VStack>
  );
};

/* ═══════ GENERIC UNIT CONVERTER ═══════ */
const UnitConverter = ({ tool }) => {
  const [amount, setAmount] = useState(1);
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const toast = useToast();

  const rates = conversionRates[tool.config] || {};
  const units = Object.keys(rates);

  // Initialize
  if (units.length > 0 && !fromUnit) {
    return <UnitConverterInit tool={tool} />;
  }

  const result = (() => {
    if (!rates[fromUnit] || !rates[toUnit]) return null;
    const inBase = amount / rates[fromUnit];
    return (inBase * rates[toUnit]).toFixed(6).replace(/\.?0+$/, '');
  })();

  return (
    <VStack spacing={6} align="stretch" maxW="lg" mx="auto">
      <FormControl><FormLabel fontWeight="bold">Nilai</FormLabel><Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} size="lg" /></FormControl>
      <Flex align="center" gap={4}>
        <Box flex={1}><FormLabel fontWeight="bold">Dari</FormLabel><Select value={fromUnit} onChange={e => setFromUnit(e.target.value)} size="lg">{units.map(u => <option key={u} value={u}>{u}</option>)}</Select></Box>
        <Button mt={8} onClick={() => { const t = fromUnit; setFromUnit(toUnit); setToUnit(t); }} borderRadius="full" px={0} w={12}><FaExchangeAlt /></Button>
        <Box flex={1}><FormLabel fontWeight="bold">Ke</FormLabel><Select value={toUnit} onChange={e => setToUnit(e.target.value)} size="lg">{units.map(u => <option key={u} value={u}>{u}</option>)}</Select></Box>
      </Flex>
      {result !== null && (
        <Box p={6} bg="gray.50" _dark={{ bg: 'gray.900' }} borderRadius="xl" textAlign="center">
          <Text color="gray.500" mb={2}>{amount} {fromUnit} =</Text>
          <Flex justify="center" align="center" gap={3}>
            <Text fontSize="3xl" fontWeight="bold" color="brand.500">{result} {toUnit}</Text>
            <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(result); toast({ title: 'Disalin', status: 'success', duration: 2000 }); }}><FaCopy /></Button>
          </Flex>
        </Box>
      )}
      {/* Show all conversions at once */}
      <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={2}>
        {units.filter(u => u !== fromUnit).map(u => {
          const val = (amount / rates[fromUnit]) * rates[u];
          return (
            <Box key={u} p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" cursor="pointer"
              onClick={() => { navigator.clipboard.writeText(val.toFixed(6).replace(/\.?0+$/, '')); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>
              <Text fontSize="xs" color="gray.500">{u}</Text>
              <Text fontWeight="bold" fontSize="sm" noOfLines={1}>{val.toFixed(6).replace(/\.?0+$/, '')}</Text>
            </Box>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
};

// Helper component to handle init state to avoid setState during render
const UnitConverterInit = ({ tool }) => {
  const rates = conversionRates[tool.config] || {};
  const units = Object.keys(rates);
  const [fromUnit, setFromUnit] = useState(units[0] || '');
  const [toUnit, setToUnit] = useState(units[1] || units[0] || '');
  const [amount, setAmount] = useState(1);
  const toast = useToast();

  const result = (() => {
    if (!rates[fromUnit] || !rates[toUnit]) return null;
    const inBase = amount / rates[fromUnit];
    return (inBase * rates[toUnit]).toFixed(6).replace(/\.?0+$/, '');
  })();

  return (
    <VStack spacing={6} align="stretch" maxW="lg" mx="auto">
      <FormControl><FormLabel fontWeight="bold">Nilai</FormLabel><Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} size="lg" /></FormControl>
      <Flex align="center" gap={4}>
        <Box flex={1}><FormLabel fontWeight="bold">Dari</FormLabel><Select value={fromUnit} onChange={e => setFromUnit(e.target.value)} size="lg">{units.map(u => <option key={u} value={u}>{u}</option>)}</Select></Box>
        <Button mt={8} onClick={() => { const t = fromUnit; setFromUnit(toUnit); setToUnit(t); }} borderRadius="full" px={0} w={12}><FaExchangeAlt /></Button>
        <Box flex={1}><FormLabel fontWeight="bold">Ke</FormLabel><Select value={toUnit} onChange={e => setToUnit(e.target.value)} size="lg">{units.map(u => <option key={u} value={u}>{u}</option>)}</Select></Box>
      </Flex>
      {result !== null && (
        <Box p={6} bg="gray.50" _dark={{ bg: 'gray.900' }} borderRadius="xl" textAlign="center">
          <Text color="gray.500" mb={2}>{amount} {fromUnit} =</Text>
          <Flex justify="center" align="center" gap={3}>
            <Text fontSize="3xl" fontWeight="bold" color="brand.500">{result} {toUnit}</Text>
            <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(result); toast({ title: 'Disalin', status: 'success', duration: 2000 }); }}><FaCopy /></Button>
          </Flex>
        </Box>
      )}
      <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={2}>
        {units.filter(u => u !== fromUnit).map(u => {
          const val = (amount / rates[fromUnit]) * rates[u];
          return (
            <Box key={u} p={3} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg" cursor="pointer"
              onClick={() => { navigator.clipboard.writeText(val.toFixed(6).replace(/\.?0+$/, '')); toast({ title: 'Disalin', status: 'success', duration: 1500 }); }}>
              <Text fontSize="xs" color="gray.500">{u}</Text>
              <Text fontWeight="bold" fontSize="sm" noOfLines={1}>{val.toFixed(6).replace(/\.?0+$/, '')}</Text>
            </Box>
          );
        })}
      </SimpleGrid>
    </VStack>
  );
};

/* ═══════ MAIN COMPONENT ═══════ */
const GenericConverterTool = ({ tool }) => {
  const renderConverter = () => {
    switch (tool.config) {
      case 'temp': return <TempConverter />;
      case 'currency': return <CurrencyConverter />;
      case 'roman': return <RomanConverter />;
      case 'base': return <BaseConverter />;
      case 'color': return <ColorConverter />;
      default: return <UnitConverterInit tool={tool} />;
    }
  };

  return (
    <ToolLayout tool={tool}>
      {renderConverter()}
    </ToolLayout>
  );
};

export default GenericConverterTool;
