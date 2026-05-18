const fs = require('fs');

const path = 'src/components/Preloader.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Update imports
content = content.replace(
    /import \{ Box, Spinner, Text, VStack \} from '@chakra-ui\/react';/,
    "import { Box, Spinner, Text, VStack, Progress, Badge, HStack, Icon } from '@chakra-ui/react';\nimport { useNetwork } from '../contexts/NetworkContext';\nimport { useMonetization } from '../contexts/MonetizationContext';\nimport { FaWifi, FaCrown } from 'react-icons/fa';"
);

// 2. Update component implementation
const newComponentCode = `
const Preloader = ({ onComplete, timeout = 3000 }) => {
  const { networkType } = useNetwork();
  const { isVIP } = useMonetization();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, timeout);

    return () => clearTimeout(timer);
  }, [onComplete, timeout]);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="white" _dark={{ bg: "gray.800" }}
      zIndex={10000}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={6}>
        <Spinner size="xl" thickness="4px" speed="0.65s" emptyColor="gray.200" color="brand.500" />

        <VStack spacing={2}>
            <Text fontSize="lg" fontWeight="bold" color="gray.600">
            Loading Assets & Checking Connection...
            </Text>
            <Box w="200px">
                 <Progress size="xs" isIndeterminate colorScheme="brand" borderRadius="full" />
            </Box>
        </VStack>

        <HStack spacing={4} mt={4}>
            <Badge colorScheme={networkType === '5G' || networkType === '4G+' ? 'green' : (networkType === '3G' ? 'yellow' : 'red')} p={2} borderRadius="md" display="flex" alignItems="center">
                <Icon as={FaWifi} mr={2} />
                Network: {networkType}
            </Badge>

            <Badge colorScheme={isVIP ? "yellow" : "gray"} p={2} borderRadius="md" display="flex" alignItems="center">
                <Icon as={FaCrown} mr={2} color={isVIP ? "yellow.500" : "gray.400"} />
                {isVIP ? "VIP Status: Active" : "Free Tier"}
            </Badge>
        </HStack>
      </VStack>
    </Box>
  );
};
`;

content = content.replace(
    /const Preloader = \(\{ onComplete, timeout = 3000 \}\) => \{[\s\S]*?return \([\s\S]*?\);\n\};/,
    newComponentCode.trim()
);

fs.writeFileSync(path, content);
console.log('Preloader patched');
