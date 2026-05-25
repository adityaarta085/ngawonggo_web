import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,

  IconButton,
  useColorModeValue,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tooltip,
} from '@chakra-ui/react';
import { FaStar, FaRegStar, FaShareAlt, FaChevronRight } from 'react-icons/fa';
import { Link as RouterLink } from 'react-router-dom';

const ToolLayout = ({ tool, children, onCopy, onDownload }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const toast = useToast();

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    // Record history
    const history = JSON.parse(localStorage.getItem('tool_history') || '[]');
    const newHistory = [tool.id, ...history.filter(id => id !== tool.id)].slice(0, 20);
    localStorage.setItem('tool_history', JSON.stringify(newHistory));

    // Check favorite
    const favs = JSON.parse(localStorage.getItem('tool_favorites') || '[]');
    setIsFavorite(favs.includes(tool.id));
  }, [tool.id]);

  const toggleFavorite = () => {
    const favs = JSON.parse(localStorage.getItem('tool_favorites') || '[]');
    let newFavs;
    if (isFavorite) {
      newFavs = favs.filter(id => id !== tool.id);
      toast({ title: "Dihapus dari favorit", status: "info", duration: 2000 });
    } else {
      newFavs = [...favs, tool.id];
      toast({ title: "Ditambahkan ke favorit", status: "success", duration: 2000 });
    }
    localStorage.setItem('tool_favorites', JSON.stringify(newFavs));
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tool.name} - Alat Universal`,
        text: tool.desc,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link disalin ke clipboard", status: "success", duration: 2000 });
    }
  };

  return (
    <Box bg={bg} borderRadius="2xl" border="1px solid" borderColor={borderColor} overflow="hidden" shadow="sm">
      {/* Header */}
      <Box p={6} borderBottom="1px solid" borderColor={borderColor} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Breadcrumb spacing="8px" separator={<FaChevronRight color="gray.400" size="10px" />} mb={4} fontSize="sm">
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/tools">Tools</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to={`/tools/${tool.category}`}>{tool.category}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink fontWeight="bold">{tool.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" mb={2}>{tool.name}</Heading>
            <Text color="gray.500">{tool.desc}</Text>
          </Box>
          <Flex gap={2}>
            <Tooltip label={isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}>
              <IconButton
                icon={isFavorite ? <FaStar color="gold" /> : <FaRegStar />}
                onClick={toggleFavorite}
                variant="outline"
                aria-label="Toggle Favorite"
                borderRadius="full"
              />
            </Tooltip>
            <Tooltip label="Bagikan">
              <IconButton
                icon={<FaShareAlt />}
                onClick={handleShare}
                variant="outline"
                aria-label="Share"
                borderRadius="full"
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Box>

      {/* Tool Content */}
      <Box p={6}>
        {children}
      </Box>
    </Box>
  );
};

export default ToolLayout;
