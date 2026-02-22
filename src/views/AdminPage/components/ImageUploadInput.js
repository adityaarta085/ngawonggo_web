import React, { useState } from 'react';
import {
  HStack,
  Input,
  Button,
  useToast,
  IconButton,
  Image,
  Box,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { FaUpload, FaTimes } from 'react-icons/fa';
import { uploadToSupabase } from '../../../lib/uploader';

const ImageUploadInput = ({ value, onChange, placeholder = "URL Gambar" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate if it's an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "File tidak valid",
        description: "Mohon pilih file gambar.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setIsUploading(true);
    try {
      const publicUrl = await uploadToSupabase(file);
      onChange(publicUrl);
      toast({
        title: "Berhasil diunggah",
        description: "Gambar berhasil diunggah ke Supabase.",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Gagal mengunggah",
        description: error.message || "Terjadi kesalahan saat mengunggah gambar.",
        status: "error",
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearInput = () => {
    onChange("");
  };

  return (
    <VStack align="stretch" spacing={2} w="full">
      <HStack spacing={2}>
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <Tooltip label="Hapus URL">
            <IconButton
              icon={<FaTimes />}
              onClick={clearInput}
              size="md"
              aria-label="Clear input"
            />
          </Tooltip>
        )}
        <Box position="relative">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            opacity={0}
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            cursor="pointer"
            zIndex={2}
          />
          <Button
            leftIcon={<FaUpload />}
            isLoading={isUploading}
            loadingText="Uploading..."
            colorScheme="blue"
            variant="outline"
          >
            Upload
          </Button>
        </Box>
      </HStack>
      {value && (
        <Box borderRadius="md" overflow="hidden" border="1px solid" borderColor="gray.200" maxW="200px">
          <Image src={value} alt="Preview" maxH="120px" fallbackSrc="https://via.placeholder.com/150?text=Invalid+URL" />
        </Box>
      )}
    </VStack>
  );
};

export default ImageUploadInput;
