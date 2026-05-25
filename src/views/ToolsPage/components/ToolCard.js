import React from 'react';
import { Box, Flex, Text, Icon, Badge, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const ToolCard = ({ tool }) => {
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box
      p={5}
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      cursor="pointer"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'md', bg: hoverBg }}
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
          bg="brand.500"
          color="white"
          align="center"
          justify="center"
          shrink={0}
        >
          {/* We'll just use a generic icon here for now, or you can import icons dynamically */}
          <Icon as={require('react-icons/fa')['FaTools']} />
        </Flex>
        <Badge colorScheme="blue" variant="subtle" fontSize="0.7em" borderRadius="full" px={2}>
          {tool.category}
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
