import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Input,
  InputGroup,
  InputLeftElement, Badge,
  SimpleGrid,
  Button,
  VStack,
  useColorModeValue,
  Icon,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { FaSearch, FaStar, FaHistory } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { categories, toolsData } from './ToolsData';
import ToolCard from './components/ToolCard';
import GenericTextTool from './tool-components/GenericTextTool';
import GenericConverterTool from './tool-components/GenericConverterTool';
import GenericGeneratorTool from './tool-components/GenericGeneratorTool';
import GenericCalculatorTool from './tool-components/GenericCalculatorTool';
import SpecificTools from './tool-components/SpecificTools';

const ToolsPage = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(category || 'all');
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);

  const bg = useColorModeValue('gray.50', 'gray.900');
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem('tool_favorites') || '[]');
    const savedHistory = JSON.parse(localStorage.getItem('tool_history') || '[]');
    setFavorites(savedFavs);
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    if (category && category !== 'tool') {
      setActiveCategory(category);
    }
  }, [category]);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setSearchQuery('');
    navigate(`/tools/${catId === 'all' ? '' : catId}`);
  };

  // If a specific tool is requested
  if (id) {
    const tool = toolsData.find((t) => t.id === id);
    if (!tool) return <Box p={10} textAlign="center">Tool not found</Box>;

    const renderTool = () => {
      switch (tool.type) {
        case 'GenericTextTool': return <GenericTextTool tool={tool} />;
        case 'GenericConverterTool': return <GenericConverterTool tool={tool} />;
        case 'GenericGeneratorTool': return <GenericGeneratorTool tool={tool} />;
        case 'GenericCalculatorTool': return <GenericCalculatorTool tool={tool} />;
        case 'SpecificTools': return <SpecificTools tool={tool} />;
        default: return <Box>Tool implementation pending</Box>;
      }
    };

    return (
      <Box pt={{ base: '88px', md: '104px' }} minH="100vh" bg={bg}>
        <Container maxW="container.xl" py={8}>
          <Button mb={6} onClick={() => navigate(-1)} variant="ghost">
            ← Kembali ke Daftar Tools
          </Button>
          {renderTool()}
        </Container>
      </Box>
    );
  }

  // Filter logic
  let filteredTools = toolsData;
  if (activeCategory === 'favorites') {
    filteredTools = toolsData.filter(t => favorites.includes(t.id));
  } else if (activeCategory === 'history') {
    filteredTools = history.map(hId => toolsData.find(t => t.id === hId)).filter(Boolean);
  } else if (activeCategory !== 'all') {
    filteredTools = toolsData.filter(t => t.category === activeCategory);
  }

  if (searchQuery) {
    filteredTools = toolsData.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <Box pt={{ base: '88px', md: '104px' }} minH="100vh" bg={bg}>
      <Container maxW="container.xl" py={8}>

        <Box textAlign="center" mb={10}>
          <Heading as="h1" size="2xl" mb={4} bgGradient="linear(to-r, brand.400, purple.500)" bgClip="text">
            Alat Universal
          </Heading>
          <Text fontSize="xl" color="gray.500">
            Kumpulan {toolsData.length}+ alat online gratis untuk berbagai kebutuhan.
          </Text>
        </Box>

        <Flex direction={{ base: 'column', md: 'row' }} gap={8}>
          {/* Sidebar */}
          <Box w={{ base: 'full', md: '250px' }} shrink={0}>
            <VStack
              align="stretch"
              spacing={2}
              bg={sidebarBg}
              p={4}
              borderRadius="xl"
              border="1px solid"
              borderColor={borderColor}
            >
              <InputGroup mb={4}>
                <InputLeftElement pointerEvents="none">
                  <FaSearch color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Cari tool..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderRadius="full"
                />
              </InputGroup>

              <Button
                justifyContent="flex-start"
                variant={activeCategory === 'favorites' ? 'solid' : 'ghost'}
                colorScheme={activeCategory === 'favorites' ? 'brand' : 'gray'}
                leftIcon={<FaStar />}
                onClick={() => handleCategoryClick('favorites')}
              >
                Favorit
              </Button>
              <Button
                justifyContent="flex-start"
                variant={activeCategory === 'history' ? 'solid' : 'ghost'}
                colorScheme={activeCategory === 'history' ? 'brand' : 'gray'}
                leftIcon={<FaHistory />}
                onClick={() => handleCategoryClick('history')}
              >
                Riwayat
              </Button>

              <Divider my={2} />

              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  justifyContent="flex-start"
                  variant={activeCategory === cat.id && !searchQuery ? 'solid' : 'ghost'}
                  colorScheme={activeCategory === cat.id && !searchQuery ? 'brand' : 'gray'}
                  leftIcon={<Icon as={cat.icon} />}
                  onClick={() => handleCategoryClick(cat.id)}
                  fontWeight="normal"
                >
                  {cat.name}
                </Button>
              ))}
            </VStack>
          </Box>

          {/* Main Content */}
          <Box flex={1}>
            <HStack justify="space-between" mb={6}>
              <Heading size="md">
                {searchQuery ? `Hasil pencarian untuk "${searchQuery}"` :
                  activeCategory === 'favorites' ? 'Tools Favorit' :
                  activeCategory === 'history' ? 'Riwayat Penggunaan' :
                  categories.find(c => c.id === activeCategory)?.name || 'Semua Tools'}
              </Heading>
              <Badge colorScheme="brand" borderRadius="full" px={3} py={1}>
                {filteredTools.length} Tools
              </Badge>
            </HStack>

            {filteredTools.length > 0 ? (
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </SimpleGrid>
            ) : (
              <Box textAlign="center" py={20} bg={sidebarBg} borderRadius="xl" border="1px solid" borderColor={borderColor}>
                <Icon as={FaSearch} w={12} h={12} color="gray.300" mb={4} />
                <Heading size="md" color="gray.500">Tidak ada tool yang ditemukan</Heading>
              </Box>
            )}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default ToolsPage;
