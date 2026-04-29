import React from 'react';
import { HStack, Text, Icon, Tooltip } from '@chakra-ui/react';
import { FaCoins, FaTicketAlt, FaStar } from 'react-icons/fa';
import { useMonetization } from '../contexts/MonetizationContext';

const CurrencyDisplay = ({ size = "sm" }) => {
  const { currencies, loading } = useMonetization();

  if (loading) return null;

  const iconProps = {
    sm: { boxSize: 4 },
    md: { boxSize: 5 },
    lg: { boxSize: 6 }
  };

  const textProps = {
    sm: { fontSize: "sm", fontWeight: "bold" },
    md: { fontSize: "md", fontWeight: "bold" },
    lg: { fontSize: "lg", fontWeight: "bold" }
  };

  return (
    <HStack spacing={4} layerStyle="glassCard" px={4} py={2} borderRadius="full">
      <Tooltip label="Koin (Premium Currency)" placement="bottom">
        <HStack color="yellow.400" cursor="pointer">
          <Icon as={FaCoins} {...iconProps[size]} />
          <Text {...textProps[size]}>{currencies?.coins || 0}</Text>
        </HStack>
      </Tooltip>

      <Tooltip label="Tiket (Akses Fitur)" placement="bottom">
        <HStack color="blue.400" cursor="pointer">
          <Icon as={FaTicketAlt} {...iconProps[size]} />
          <Text {...textProps[size]}>{currencies?.tickets || 0}</Text>
        </HStack>
      </Tooltip>

      <Tooltip label="Poin (Aktivitas)" placement="bottom">
        <HStack color="purple.400" cursor="pointer">
          <Icon as={FaStar} {...iconProps[size]} />
          <Text {...textProps[size]}>{currencies?.points || 0}</Text>
        </HStack>
      </Tooltip>
    </HStack>
  );
};

export default CurrencyDisplay;
