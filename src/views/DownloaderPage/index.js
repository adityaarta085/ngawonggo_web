import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Select,
  Image,
  Link,
  useToast,
  Flex,
  Badge,
  HStack
} from '@chakra-ui/react';
import { FaDownload, FaSearch, FaLink } from 'react-icons/fa';
import SEO from '../../components/SEO';
import '../../App.css'; // Make sure the loader CSS is available

const SERVICES = [
  { id: 'ytmp3', name: 'YouTube to MP3', endpoint: 'https://api.nexray.eu.cc/downloader/ytmp3', requires: 'url' },
  { id: 'ytmp4', name: 'YouTube to MP4', endpoint: 'https://api.nexray.eu.cc/downloader/v1/ytmp4', requires: 'url', options: ['360', '480', '720', '1080'] },
  { id: 'ytplay', name: 'YouTube Play MP3 (Search)', endpoint: 'https://api.nexray.eu.cc/downloader/ytplay', requires: 'query' },
  { id: 'ytplayvid', name: 'YouTube Play MP4 (Search)', endpoint: 'https://api.nexray.eu.cc/downloader/ytplayvid', requires: 'query' },
  { id: 'tiktok', name: 'TikTok', endpoint: 'https://api.nexray.eu.cc/downloader/tiktok', requires: 'url' },
  { id: 'spotify', name: 'Spotify', endpoint: 'https://api.nexray.eu.cc/downloader/spotify', requires: 'url' },
  { id: 'snackvideo', name: 'SnackVideo', endpoint: 'https://api.nexray.eu.cc/downloader/snackvideo', requires: 'url' },
  { id: 'twitter', name: 'Twitter/X', endpoint: 'https://api.nexray.eu.cc/downloader/twitter', requires: 'url' },
  { id: 'instagram', name: 'Instagram', endpoint: 'https://api.nexray.eu.cc/downloader/instagram', requires: 'url' },
  { id: 'facebook', name: 'Facebook', endpoint: 'https://api.nexray.eu.cc/downloader/facebook', requires: 'url' },
  { id: 'applemusic', name: 'Apple Music', endpoint: 'https://api.nexray.eu.cc/downloader/applemusic', requires: 'url' },
  { id: 'pinterest', name: 'Pinterest', endpoint: 'https://api.nexray.eu.cc/downloader/pinterest', requires: 'url' },
  { id: 'likee', name: 'Likee', endpoint: 'https://api.nexray.eu.cc/downloader/likee', requires: 'url' },
  { id: 'soundcloud', name: 'SoundCloud', endpoint: 'https://api.nexray.eu.cc/downloader/soundcloud', requires: 'url' },
  { id: 'threads', name: 'Threads', endpoint: 'https://api.nexray.eu.cc/downloader/threads', requires: 'url' },
  { id: 'scribd', name: 'Scribd', endpoint: 'https://api.nexray.eu.cc/downloader/scribd', requires: 'url' },
  { id: 'googledrive', name: 'Google Drive', endpoint: 'https://api.nexray.eu.cc/downloader/googledrive', requires: 'url' },
  { id: 'github', name: 'GitHub', endpoint: 'https://api.nexray.eu.cc/downloader/github', requires: 'url' },
];

const DownloaderPage = () => {
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [inputValue, setInputValue] = useState('');
  const [resolution, setResolution] = useState('1080');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const toast = useToast();

  const handleServiceChange = (e) => {
    const service = SERVICES.find((s) => s.id === e.target.value);
    setSelectedService(service);
    setResult(null);
  };

  const handleDownload = async () => {
    if (!inputValue.trim()) {
      toast({
        title: 'Input diperlukan',
        description: selectedService.requires === 'url' ? 'Masukkan URL yang valid.' : 'Masukkan kata kunci pencarian.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let urlStr = selectedService.endpoint;
      if (selectedService.requires === 'url') {
        urlStr += `?url=${encodeURIComponent(inputValue)}`;
        if (selectedService.id === 'ytmp4') {
          urlStr += `&resolusi=${resolution}`;
        }
      } else if (selectedService.requires === 'query') {
        urlStr += `?q=${encodeURIComponent(inputValue)}`;
      }

      const response = await fetch(urlStr);
      const data = await response.json();

      if (data.status) {
        setResult(data.result);
      } else {
        throw new Error('Gagal mengambil data atau respons tidak valid.');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Terjadi kesalahan saat memproses permintaan.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    // The API structure varies, try to extract common fields
    const title = result.title || result.desc || 'Hasil Download';
    const thumbnail = result.thumbnail || result.cover || result.thumb;
    const downloadUrl = result.url || result.download_url || result.media;
    const author = result.author || result.channel || result.creator;

    // TikTok might have an array of media or different structure
    const tiktokMediaUrl = result.media && Array.isArray(result.media)
        ? (result.media.find(m => !m.watermark)?.url || result.media[0]?.url)
        : null;
    const finalDownloadUrl = typeof downloadUrl === 'string' ? downloadUrl : tiktokMediaUrl;

    return (
      <Box p={6} mt={8} borderWidth="1px" borderRadius="xl" bg="whiteAlpha.100" backdropFilter="blur(10px)" borderColor="whiteAlpha.300" w="full">
        <VStack spacing={4} align="stretch">
          {thumbnail && (
            <Image src={thumbnail} alt={title} borderRadius="md" maxH="300px" objectFit="cover" fallbackSrc="https://via.placeholder.com/300x200?text=No+Thumbnail" />
          )}
          <Heading size="md" color="white">{title}</Heading>

          {author && (
             <Text color="gray.300" fontSize="sm">Oleh: {author}</Text>
          )}

          <HStack spacing={4} wrap="wrap">
            {result.quality && <Badge colorScheme="green">Quality: {result.quality}</Badge>}
            {result.format && <Badge colorScheme="blue">Format: {result.format}</Badge>}
            {result.duration && <Badge colorScheme="purple">Duration: {result.duration}s</Badge>}
            {result.views && <Badge colorScheme="orange">Views: {result.views}</Badge>}
          </HStack>

          {result.description && (
            <Text color="gray.400" fontSize="sm" noOfLines={3}>
              {result.description}
            </Text>
          )}

          <Flex mt={4} justify="center">
            {finalDownloadUrl ? (
                <Button
                    as={Link}
                    href={finalDownloadUrl}
                    isExternal
                    leftIcon={<FaDownload />}
                    colorScheme="brand"
                    size="lg"
                    w="full"
                    _hover={{ textDecoration: 'none' }}
                >
                    Download / Buka Tautan
                </Button>
            ) : (
                <VStack w="full" spacing={2}>
                    <Text color="yellow.300">Format respon mungkin berbeda. Data mentah:</Text>
                    <Box as="pre" w="full" overflowX="auto" fontSize="xs" bg="blackAlpha.500" p={2} borderRadius="md">
                        {JSON.stringify(result, null, 2)}
                    </Box>
                </VStack>
            )}
          </Flex>
        </VStack>
      </Box>
    );
  };

  return (
    <>
      <SEO title="Downloader | Desa Digital" description="Unduh media dari berbagai platform." />
      <Box minH="100vh" pt={{ base: '120px', md: '150px' }} pb={10} bgGradient="linear(to-br, #0F172A, #002952, #0F2F24)">
        <Container maxW="container.md">
          <VStack spacing={8}>
            <VStack spacing={2} textAlign="center">
              <Heading color="white" size="xl">Universal Downloader</Heading>
              <Text color="gray.300">Unduh video dan musik favorit Anda dari berbagai platform dengan mudah.</Text>
            </VStack>

            <Box w="full" p={6} bg="whiteAlpha.100" backdropFilter="blur(10px)" borderRadius="2xl" borderWidth="1px" borderColor="whiteAlpha.300">
              <VStack spacing={5}>
                <Select
                  value={selectedService.id}
                  onChange={handleServiceChange}
                  color="white"
                  bg="whiteAlpha.200"
                  borderColor="whiteAlpha.400"
                  _hover={{ borderColor: 'brand.400' }}
                  sx={{ '> option, > optgroup': { background: '#1A202C' } }}
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>

                {selectedService.id === 'ytmp4' && (
                  <Select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    color="white"
                    bg="whiteAlpha.200"
                    borderColor="whiteAlpha.400"
                    _hover={{ borderColor: 'brand.400' }}
                    sx={{ '> option': { background: '#1A202C' } }}
                  >
                    {selectedService.options.map((res) => (
                      <option key={res} value={res}>{res}p</option>
                    ))}
                  </Select>
                )}

                <Input
                  placeholder={selectedService.requires === 'url' ? "Masukkan URL..." : "Masukkan kata kunci pencarian..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  color="white"
                  bg="whiteAlpha.200"
                  borderColor="whiteAlpha.400"
                  _hover={{ borderColor: 'brand.400' }}
                  _focus={{ borderColor: 'brand.500', boxShadow: 'none' }}
                  size="lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleDownload()}
                />

                <Button
                  w="full"
                  size="lg"
                  colorScheme="brand"
                  onClick={handleDownload}
                  isDisabled={loading}
                  leftIcon={selectedService.requires === 'url' ? <FaLink /> : <FaSearch />}
                >
                  Proses
                </Button>
              </VStack>
            </Box>

            {loading ? (
              <Box py={10} display="flex" justifyContent="center">
                <div className="downloader-loader"></div>
              </Box>
            ) : (
              renderResult()
            )}
          </VStack>
        </Container>
      </Box>
    </>
  );
};

export default DownloaderPage;
