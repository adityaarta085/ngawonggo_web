import React, { useState } from 'react';
import { Box, Button, Flex, Text, VStack, useToast, Checkbox, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from '@chakra-ui/react';
import { FaCopy, FaSync } from 'react-icons/fa';
import AIPoweredTool from './AIPoweredTool';
import ToolLayout from '../components/ToolLayout';

const GenericGeneratorTool = ({ tool }) => {


  const [result, setResult] = useState('');
  const [length, setLength] = useState(12);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const toast = useToast();

  const supported = ['password', 'uuid', 'randomNumber'];
  if (!supported.includes(tool.config)) return <AIPoweredTool tool={tool} />;

  const generate = () => {
    let res = '';
    if (tool.config === 'password') {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const nums = "0123456789";
      const syms = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
      let charset = chars;
      if (useNumbers) charset += nums;
      if (useSymbols) charset += syms;

      for (let i = 0; i < length; i++) {
        res += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    } else if (tool.config === 'uuid') {
      res = crypto.randomUUID();
    } else if (tool.config === 'randomNumber') {
      res = Math.floor(Math.random() * 1000000).toString();
    } else {
      res = "Data dummy (Implementasi khusus " + tool.config + " dibutuhkan)";
    }
    setResult(res);
  };

  return (
    <ToolLayout tool={tool}>
      <VStack spacing={6} align="stretch" maxW="lg" mx="auto">

        {tool.config === 'password' && (
          <Box p={4} bg="gray.50" _dark={{ bg: 'gray.800' }} borderRadius="lg">
            <Text mb={4}>Panjang Karakter: {length}</Text>
            <Slider value={length} min={4} max={64} onChange={(v) => setLength(v)} mb={4}>
              <SliderTrack><SliderFilledTrack /></SliderTrack>
              <SliderThumb />
            </Slider>
            <Flex gap={4}>
              <Checkbox isChecked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)}>Angka</Checkbox>
              <Checkbox isChecked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)}>Simbol</Checkbox>
            </Flex>
          </Box>
        )}

        <Button colorScheme="brand" size="lg" leftIcon={<FaSync />} onClick={generate}>
          Generate
        </Button>

        {result && (
          <Box p={6} bg="gray.50" _dark={{ bg: 'gray.900' }} borderRadius="xl" textAlign="center" position="relative">
            <Text fontSize={result.length > 30 ? "md" : "2xl"} fontWeight="bold" fontFamily="monospace" wordBreak="break-all">
              {result}
            </Text>
            <Button
              size="sm"
              position="absolute"
              top={2}
              right={2}
              onClick={() => {
                navigator.clipboard.writeText(result);
                toast({ title: "Disalin", status: "success", duration: 2000 });
              }}
            >
              <FaCopy />
            </Button>
          </Box>
        )}
      </VStack>
    </ToolLayout>
  );
};

export default GenericGeneratorTool;
