import React, { useState } from 'react';
import { Box, Input, Button, Flex, Text, VStack,  Select, useToast } from '@chakra-ui/react';
import { FaCopy, FaExchangeAlt } from 'react-icons/fa';
import AIPoweredTool from './AIPoweredTool';
import ToolLayout from '../components/ToolLayout';

const conversionRates = {
  length: { m: 1, cm: 100, km: 0.001, inch: 39.3701, feet: 3.28084, mile: 0.000621371 },
  weight: { kg: 1, gram: 1000, ton: 0.001, pound: 2.20462 },
  time: { jam: 1, menit: 60, detik: 3600, hari: 1/24 },
  data: { MB: 1, KB: 1024, GB: 1/1024, TB: 1/1048576 }
};

const GenericConverterTool = ({ tool }) => {


  const [amount, setAmount] = useState(1);
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState(null);
  const toast = useToast();

  const rates = conversionRates[tool.config] || {};
  const units = Object.keys(rates);

  // Initialize units
  if (units.length > 0 && !fromUnit) setFromUnit(units[0]);
  if (units.length > 1 && !toUnit) setToUnit(units[1]);

  const supported = ['length', 'weight', 'time', 'data'];
  if (!supported.includes(tool.config)) return <AIPoweredTool tool={tool} />;

  const handleConvert = () => {
    if (!rates[fromUnit] || !rates[toUnit]) {
       setResult("Fitur konversi ini sedang dalam pengembangan.");
       return;
    }
    const inBase = amount / rates[fromUnit];
    const converted = inBase * rates[toUnit];
    setResult(converted.toFixed(4));
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <ToolLayout tool={tool}>
      <VStack spacing={6} align="stretch" maxW="lg" mx="auto">
        <Box>
          <Text mb={2} fontWeight="bold">Nilai</Text>
          <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} size="lg" />
        </Box>

        {units.length > 0 ? (
          <Flex align="center" gap={4}>
            <Box flex={1}>
              <Text mb={2} fontWeight="bold">Dari</Text>
              <Select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} size="lg">
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </Select>
            </Box>

            <Button mt={8} onClick={handleSwap} borderRadius="full" px={0} w={12}>
              <FaExchangeAlt />
            </Button>

            <Box flex={1}>
              <Text mb={2} fontWeight="bold">Ke</Text>
              <Select value={toUnit} onChange={(e) => setToUnit(e.target.value)} size="lg">
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </Select>
            </Box>
          </Flex>
        ) : (
           <Text color="gray.500">Kategori konversi ini belum didukung penuh di versi preview.</Text>
        )}

        <Button colorScheme="brand" size="lg" onClick={handleConvert}>
          Konversi
        </Button>

        {result !== null && (
          <Box p={6} bg="gray.50" _dark={{ bg: 'gray.900' }} borderRadius="xl" textAlign="center">
            <Text color="gray.500" mb={2}>{amount} {fromUnit} = </Text>
            <Flex justify="center" align="center" gap={3}>
              <Text fontSize="3xl" fontWeight="bold" color="brand.500">
                {result} {toUnit}
              </Text>
              <Button size="sm" variant="ghost" onClick={() => {
                navigator.clipboard.writeText(result);
                toast({ title: "Disalin", status: "success", duration: 2000 });
              }}>
                <FaCopy />
              </Button>
            </Flex>
          </Box>
        )}
      </VStack>
    </ToolLayout>
  );
};

export default GenericConverterTool;
