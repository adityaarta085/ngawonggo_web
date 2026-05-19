import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Text,
  Box,
  Icon,
  HStack,
  VStack,
  useColorModeValue,
  Kbd
} from '@chakra-ui/react';
import { FaSearch, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SEARCH_DATA = [
  { title: 'Berita Desa', path: '/news', keywords: ['berita', 'news', 'informasi', 'desa'] },
  { title: 'Berita Nasional', path: '/news/nasional', keywords: ['berita', 'nasional', 'news'] },
  { title: 'Profil Desa', path: '/profil', keywords: ['profil', 'sejarah', 'visi', 'misi', 'wilayah'] },
  { title: 'Pemerintahan', path: '/pemerintahan', keywords: ['pemerintah', 'struktur', 'organisasi', 'desa'] },
  { title: 'Dokumen Publik', path: '/pemerintahan/dokumen', keywords: ['dokumen', 'publik', 'arsip', 'download', 'pdf'] },
  { title: 'Layanan Desa', path: '/layanan', keywords: ['layanan', 'surat', 'pengaduan', 'lapor'] },
  { title: 'Jelajahi', path: '/jelajahi', keywords: ['jelajah', 'explore', 'menu'] },
  { title: 'Kreativitas AI', path: '/kreativitas', keywords: ['ai', 'gambar', 'kreativitas', 'art', 'generator'] },
  { title: 'Downloader', path: '/downloader', keywords: ['download', 'unduh', 'video', 'tiktok', 'youtube', 'ig', 'mp3', 'mp4'] },
  { title: 'Cek Plagiasi', path: '/cekplagiat', keywords: ['plagiat', 'cek', 'dokumen', 'turnitin', 'skripsi', 'tugas'] },
  { title: 'Kontak', path: '/kontak', keywords: ['kontak', 'hubungi', 'lokasi', 'alamat', 'telepon'] },
  { title: 'Media Komunitas', path: '/media', keywords: ['media', 'komunitas', 'sosial', 'post', 'forum'] },
  { title: 'Drama China (Dracin)', path: '/dracin', keywords: ['drama', 'china', 'film', 'movie', 'dracin', 'nonton'] },
  { title: 'Al-Quran Digital', path: '/quran', keywords: ['quran', 'ngaji', 'islam', 'baca', 'ayat', 'surah'] },
  { title: 'Donasi', path: '/donasi', keywords: ['donasi', 'sumbangan', 'dana', 'bantuan'] },
  { title: 'Topup Games & Tagihan', path: '/topup', keywords: ['topup', 'game', 'diamond', 'pulsa', 'kuota', 'token', 'listrik'] },
  { title: 'Edu Game 3D', path: '/game', keywords: ['game', 'edukasi', 'main', '3d', 'kuis'] },
  { title: 'Portal Warga', path: '/portal', keywords: ['portal', 'warga', 'login', 'akun', 'profil'] },
];

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const bgHover = useColorModeValue('gray.100', 'gray.700');
  const bgSelected = useColorModeValue('brand.50', 'brand.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const modalBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const footerBg = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const searchLower = query.toLowerCase();
    const filtered = SEARCH_DATA.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(searchLower);
      const matchKeyword = item.keywords.some(k => k.toLowerCase().includes(searchLower));
      return matchTitle || matchKeyword;
    });

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        handleSelect(results[selectedIndex].path);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" motionPreset="slideInBottom">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent mt={{ base: "5vh", md: "15vh" }} bg={modalBg} borderRadius="xl" overflow="hidden" boxShadow="2xl">
        <InputGroup size="lg">
          <InputLeftElement pointerEvents="none" pt={2} pl={2}>
            <Icon as={FaSearch} color="brand.500" boxSize={5} />
          </InputLeftElement>
          <Input
            ref={inputRef}
            placeholder="Cari layanan, berita, atau fitur..."
            variant="unstyled"
            p={6}
            pl={12}
            fontSize="lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            _placeholder={{ color: mutedColor }}
          />
        </InputGroup>

        {results.length > 0 && (
          <Box maxH="50vh" overflowY="auto" borderTop="1px solid" borderColor={borderColor}>
            <List p={2}>
              {results.map((item, index) => (
                <ListItem
                  key={index}
                  p={3}
                  cursor="pointer"
                  borderRadius="md"
                  bg={index === selectedIndex ? bgSelected : 'transparent'}
                  _hover={{ bg: bgHover }}
                  onClick={() => handleSelect(item.path)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  transition="all 0.2s"
                >
                  <HStack justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold" color={textColor}>{item.title}</Text>
                      <Text fontSize="xs" color={mutedColor} noOfLines={1}>
                        {item.path}
                      </Text>
                    </VStack>
                    <Icon as={FaArrowRight} color="brand.500" opacity={index === selectedIndex ? 1 : 0.3} transition="opacity 0.2s" />
                  </HStack>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {query.trim() !== '' && results.length === 0 && (
          <Box p={8} textAlign="center">
            <Text color={mutedColor}>Tidak ditemukan hasil untuk "{query}"</Text>
          </Box>
        )}

        <Box p={3} borderTop="1px solid" borderColor={borderColor} bg={footerBg}>
          <HStack justify="center" spacing={4}>
            <HStack spacing={1}>
              <Kbd fontSize="xs">↑</Kbd>
              <Kbd fontSize="xs">↓</Kbd>
              <Text fontSize="xs" color={mutedColor}>Navigasi</Text>
            </HStack>
            <HStack spacing={1}>
              <Kbd fontSize="xs">Enter</Kbd>
              <Text fontSize="xs" color={mutedColor}>Pilih</Text>
            </HStack>
            <HStack spacing={1}>
              <Kbd fontSize="xs">Esc</Kbd>
              <Text fontSize="xs" color={mutedColor}>Tutup</Text>
            </HStack>
          </HStack>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default GlobalSearch;
