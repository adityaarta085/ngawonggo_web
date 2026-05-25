import React, { useState } from 'react';
import { Box, Textarea, Button, Flex, Text, useToast, VStack, HStack, Select } from '@chakra-ui/react';
import { FaCopy, FaTrash, } from 'react-icons/fa';
import ToolLayout from '../components/ToolLayout';

const GenericTextTool = ({ tool }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [extraConfig, setExtraConfig] = useState('lowercase');
  const toast = useToast();

  const handleProcess = () => {
    let result = '';
    switch (tool.config) {
      case 'count':
        result = `Karakter: ${input.length}\nKata: ${input.trim() === '' ? 0 : input.trim().split(/\s+/).length}\nBaris: ${input.split(/\r\n|\r|\n/).length}`;
        break;
      case 'case':
        if (extraConfig === 'lowercase') result = input.toLowerCase();
        if (extraConfig === 'uppercase') result = input.toUpperCase();
        if (extraConfig === 'titlecase') result = input.toLowerCase().replace(/(?:^|\s|-)\S/g, x => x.toUpperCase());
        break;
      case 'slug':
        result = input.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
        break;
      case 'space':
        result = input.replace(/\s+/g, ' ').trim();
        break;
      case 'emptyLine':
        result = input.replace(/^\s*[\r\n]/gm, '');
        break;
      case 'sort':
        result = input.split('\n').sort().join('\n');
        break;
      case 'reverse':
        result = input.split('').reverse().join('');
        break;
      case 'lorem':
        result = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        break;
      default:
        result = "Fungsi belum diimplementasikan sepenuhnya.";
    }
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({ title: "Disalin", status: "success", duration: 2000 });
  };

  return (
    <ToolLayout tool={tool}>
      <VStack spacing={4} align="stretch">
        <Box>
          <Flex justify="space-between" mb={2}>
            <Text fontWeight="bold">Input Teks</Text>
            <Button size="xs" variant="ghost" colorScheme="red" leftIcon={<FaTrash />} onClick={() => {setInput(''); setOutput('');}}>Bersihkan</Button>
          </Flex>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik atau paste teks di sini..."
            minH="200px"
            resize="vertical"
          />
        </Box>

        {tool.config === 'case' && (
          <Select value={extraConfig} onChange={(e) => setExtraConfig(e.target.value)}>
            <option value="lowercase">huruf kecil</option>
            <option value="uppercase">HURUF BESAR</option>
            <option value="titlecase">Huruf Kapital Tiap Kata</option>
          </Select>
        )}

        <Button colorScheme="brand" size="lg" onClick={handleProcess}>
          Proses Teks
        </Button>

        {output && (
          <Box>
            <Flex justify="space-between" mb={2}>
              <Text fontWeight="bold">Hasil</Text>
              <HStack>
                <Button size="xs" leftIcon={<FaCopy />} onClick={handleCopy}>Copy</Button>
              </HStack>
            </Flex>
            <Textarea
              value={output}
              isReadOnly
              minH="200px"
              bg="gray.50"
              _dark={{ bg: 'gray.900' }}
            />
          </Box>
        )}
      </VStack>
    </ToolLayout>
  );
};

export default GenericTextTool;
