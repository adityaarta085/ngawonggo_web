import React, { useRef } from 'react';
import {
  Box,
  VStack,
  Textarea,
  Button,
  Text,
  HStack,
  Icon,
  Flex,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaUpload, FaFileAlt, FaTimes } from 'react-icons/fa';

const TextInputForm = ({ text, setText, file, setFile, charCount }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(selected.type)) {
      alert('Format file tidak didukung. Gunakan .txt, .pdf, atau .docx');
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      alert('Ukuran file maks 5MB.');
      return;
    }

    setFile(selected);

    // Read text content from .txt files
    if (selected.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setText(ev.target.result);
      };
      reader.readAsText(selected);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const glassCard = useColorModeValue(
    'rgba(255,255,255,0.08)',
    'rgba(255,255,255,0.08)'
  );

  return (
    <Box
      w="full"
      p={{ base: 5, md: 8 }}
      bg={glassCard}
      backdropFilter="blur(16px)"
      borderRadius="2xl"
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      boxShadow="0 8px 32px rgba(0,0,0,0.3)"
    >
      <VStack spacing={5} align="stretch">
        {/* Textarea */}
        <Box position="relative">
          <Textarea
            id="plagiat-text-input"
            placeholder="Tempel atau ketik teks yang ingin dicek plagiarisme di sini..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            color="white"
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.300"
            _hover={{ borderColor: 'brand.400' }}
            _focus={{
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            }}
            minH="200px"
            resize="vertical"
            fontSize={{ base: 'sm', md: 'md' }}
            lineHeight="1.8"
            _placeholder={{ color: 'whiteAlpha.500' }}
          />
          <Flex justify="flex-end" mt={1}>
            <Badge
              colorScheme={charCount > 10000 ? 'red' : charCount > 5000 ? 'yellow' : 'green'}
              variant="subtle"
              fontSize="xs"
              px={2}
              py={0.5}
              borderRadius="full"
            >
              {charCount.toLocaleString()} karakter
            </Badge>
          </Flex>
        </Box>

        {/* File Upload */}
        <Box>
          <input
            type="file"
            ref={fileInputRef}
            accept=".txt,.pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {file ? (
            <HStack
              p={3}
              bg="whiteAlpha.100"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="brand.500"
              spacing={3}
            >
              <Icon as={FaFileAlt} color="brand.400" boxSize={5} />
              <VStack align="start" spacing={0} flex={1}>
                <Text color="white" fontSize="sm" fontWeight="600" noOfLines={1}>
                  {file.name}
                </Text>
                <Text color="whiteAlpha.600" fontSize="xs">
                  {(file.size / 1024).toFixed(1)} KB
                </Text>
              </VStack>
              <Button
                size="xs"
                variant="ghost"
                colorScheme="red"
                onClick={removeFile}
                aria-label="Hapus file"
              >
                <Icon as={FaTimes} />
              </Button>
            </HStack>
          ) : (
            <Button
              w="full"
              variant="outline"
              colorScheme="brand"
              leftIcon={<FaUpload />}
              onClick={() => fileInputRef.current?.click()}
              borderStyle="dashed"
              borderWidth="2px"
              py={6}
              color="whiteAlpha.700"
              _hover={{
                bg: 'whiteAlpha.100',
                color: 'white',
                borderColor: 'brand.400',
              }}
            >
              Upload File (.txt, .pdf, .docx — maks 5MB)
            </Button>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default TextInputForm;
