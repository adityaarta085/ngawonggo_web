import React, { useState } from 'react';
import { Box, Input, Button, Text, VStack,  } from '@chakra-ui/react';
import AIPoweredTool from './AIPoweredTool';
import ToolLayout from '../components/ToolLayout';

const GenericCalculatorTool = ({ tool }) => {


  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');
  const [result, setResult] = useState('');

  const supported = ['bmi', 'discount'];
  if (!supported.includes(tool.config)) return <AIPoweredTool tool={tool} />;

  const calculate = () => {
    const v1 = parseFloat(val1);
    const v2 = parseFloat(val2);

    if (isNaN(v1)) {
        setResult("Masukkan angka valid");
        return;
    }

    if (tool.config === 'bmi') {
      if (isNaN(v2) || v2 === 0) return;
      const h = v2 / 100; // cm to m
      const bmi = (v1 / (h * h)).toFixed(1);
      let cat = "Normal";
      if (bmi < 18.5) cat = "Kurus";
      if (bmi >= 25) cat = "Gemuk";
      setResult(`BMI: ${bmi} (${cat})`);
    } else if (tool.config === 'discount') {
      if (isNaN(v2)) return;
      const final = v1 - (v1 * (v2 / 100));
      setResult(`Harga Akhir: ${final}`);
    } else {
      setResult("Fitur spesifik kalkulator ini masih dalam simulasi.");
    }
  };

  return (
    <ToolLayout tool={tool}>
      <VStack spacing={6} align="stretch" maxW="md" mx="auto">

        {tool.config === 'bmi' ? (
          <>
            <Box>
              <Text mb={2}>Berat (kg)</Text>
              <Input type="number" value={val1} onChange={e => setVal1(e.target.value)} />
            </Box>
            <Box>
              <Text mb={2}>Tinggi (cm)</Text>
              <Input type="number" value={val2} onChange={e => setVal2(e.target.value)} />
            </Box>
          </>
        ) : tool.config === 'discount' ? (
           <>
            <Box>
              <Text mb={2}>Harga Awal</Text>
              <Input type="number" value={val1} onChange={e => setVal1(e.target.value)} />
            </Box>
            <Box>
              <Text mb={2}>Diskon (%)</Text>
              <Input type="number" value={val2} onChange={e => setVal2(e.target.value)} />
            </Box>
          </>
        ) : (
          <Box p={4} bg="orange.100" color="orange.800" borderRadius="md">
            UI spesifik untuk kalkulator "{tool.name}" akan dirender di sini berdasarkan konfigurasi.
          </Box>
        )}

        <Button colorScheme="brand" onClick={calculate}>Hitung</Button>

        {result && (
          <Box p={4} bg="brand.50" color="brand.700" borderRadius="md" textAlign="center" fontWeight="bold">
            {result}
          </Box>
        )}
      </VStack>
    </ToolLayout>
  );
};

export default GenericCalculatorTool;
