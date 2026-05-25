import React from 'react';
import { Box, Flex, Text, Icon, Badge, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../ToolsData';

const categoryStyling = {
  calculator: { bg: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', badge: 'orange' },
  converter: { bg: 'linear-gradient(135deg, #4E54C8 0%, #8F94FB 100%)', badge: 'blue' },
  text: { bg: 'linear-gradient(135deg, #11998E 0%, #38EF7D 100%)', badge: 'green' },
  datetime: { bg: 'linear-gradient(135deg, #F857A6 0%, #FF5858 100%)', badge: 'pink' },
  file: { bg: 'linear-gradient(135deg, #3CA55C 0%, #B5AC49 100%)', badge: 'teal' },
  image: { bg: 'linear-gradient(135deg, #FF4B2B 0%, #FF416C 100%)', badge: 'red' },
  web: { bg: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)', badge: 'cyan' },
  developer: { bg: 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)', badge: 'purple' },
  math: { bg: 'linear-gradient(135deg, #e65c00 0%, #F9D423 100%)', badge: 'yellow' },
  business: { bg: 'linear-gradient(135deg, #4568DC 0%, #B06AB8 100%)', badge: 'purple' },
  seo: { bg: 'linear-gradient(135deg, #0575E6 0%, #00F260 100%)', badge: 'teal' },
  security: { bg: 'linear-gradient(135deg, #3A3D40 0%, #181719 100%)', badge: 'gray' },
  random: { bg: 'linear-gradient(135deg, #FC466B 0%, #3F5EFB 100%)', badge: 'pink' },
};

const ToolCard = ({ tool }) => {
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const catStyle = categoryStyling[tool.category] || { bg: 'brand.500', badge: 'blue' };
  const cat = categories.find(c => c.id === tool.category);
  const CatIcon = cat ? cat.icon : null;

  return (
    <Box
      p={5}
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      cursor="pointer"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'lg', bg: hoverBg, borderColor: 'brand.400' }}
      onClick={() => navigate(`/tools/tool/${tool.id}`)}
      height="full"
      display="flex"
      flexDirection="column"
    >
      <Flex justify="space-between" align="start" mb={3}>
        <Flex
          w={10}
          h={10}
          borderRadius="lg"
          bg={catStyle.bg}
          color="white"
          align="center"
          justify="center"
          shrink={0}
          shadow="sm"
        >
          {CatIcon ? <Icon as={CatIcon} /> : <Icon as={require('react-icons/fa')['FaTools']} />}
        </Flex>
        <Badge colorScheme={catStyle.badge} variant="subtle" fontSize="0.75em" borderRadius="full" px={2} py={0.5}>
          {cat ? cat.name : tool.category}
        </Badge>
      </Flex>
      <Text fontWeight="bold" fontSize="lg" mb={1} noOfLines={1}>
        {tool.name}
      </Text>
      <Text fontSize="sm" color="gray.500" noOfLines={2}>
        {tool.desc}
      </Text>
    </Box>
  );
};

export default ToolCard;
