import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  HStack,
  Icon,
  Badge,
} from '@chakra-ui/react';
import { FaCoins, FaCrown, FaTicketAlt, FaCreditCard } from 'react-icons/fa';
import { useMonetization } from '../../contexts/MonetizationContext';
import { useNavigate } from 'react-router-dom';

const PaywallModal = ({
  isOpen,
  onClose,
  title = 'Akses Fitur Terbatas',
  message = 'Kuota gratis harian Anda untuk fitur ini telah tercapai.',
  price = 5,
  currencyType = 'coins',
  onPay,
  quotaInfo = null,
}) => {
  const { currency, deductCurrency } = useMonetization();
  const navigate = useNavigate();
  const balance = currency ? (currency[currencyType] || 0) : 0;
  const canAfford = balance >= price;

  const handlePay = async () => {
    if (canAfford) {
      const success = await deductCurrency(price, currencyType, title);
      if (success) {
        if (onPay) onPay();
        onClose();
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(6px)" bg="blackAlpha.600" />
      <ModalContent borderRadius="2xl" overflow="hidden" boxShadow="2xl">
        <ModalHeader textAlign="center" pt={6} pb={2} bg="purple.50" _dark={{ bg: "purple.950" }}>
          <VStack spacing={1}>
            <Icon
              as={currencyType === 'coins' ? FaCoins : FaTicketAlt}
              boxSize={10}
              color={currencyType === 'coins' ? 'yellow.500' : 'blue.500'}
            />
            <Text fontSize="lg" fontWeight="bold" color="purple.800" _dark={{ color: "purple.200" }}>
              {title}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={5}>
          <VStack spacing={4} textAlign="center">
            {quotaInfo && (
              <Badge colorScheme="orange" px={3} py={1} borderRadius="full" fontSize="xs">
                {quotaInfo}
              </Badge>
            )}
            <Text color="gray.600" _dark={{ color: "gray.300" }} fontSize="sm">
              {message}
            </Text>

            <HStack bg="gray.50" _dark={{ bg: "gray.800" }} p={4} borderRadius="xl" w="full" justify="space-between" borderWidth="1px" borderColor="gray.200">
              <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.500">Saldo {currencyType === 'coins' ? 'Koin Desa' : 'Tiket'}:</Text>
                <HStack>
                  <Icon as={currencyType === 'coins' ? FaCoins : FaTicketAlt} color={currencyType === 'coins' ? 'yellow.500' : 'blue.500'} />
                  <Text fontWeight="bold" fontSize="lg">{balance}</Text>
                </HStack>
              </VStack>

              <VStack align="end" spacing={0}>
                <Text fontSize="xs" color="gray.500">Biaya Akses:</Text>
                <Badge colorScheme="purple" fontSize="md" px={2} py={0.5} borderRadius="md">
                  {price} {currencyType === 'coins' ? 'Koin' : 'Tiket'}
                </Badge>
              </VStack>
            </HStack>

            {!canAfford && (
              <Text fontSize="xs" color="red.500" fontWeight="medium">
                Saldo Koin Anda belum mencukupi. Silakan isi ulang melalui Kios Koin Desa (QRIS Instan) atau gunakan tiket VIP.
              </Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter flexDirection="column" gap={2} bg="gray.50" _dark={{ bg: "gray.900" }} pt={3} pb={5}>
          <Button
            w="full"
            colorScheme="yellow"
            size="lg"
            onClick={handlePay}
            isDisabled={!canAfford}
            leftIcon={<Icon as={FaCoins} />}
            shadow="md"
          >
            Buka Sekarang ({price} Koin)
          </Button>

          <HStack w="full" spacing={2}>
            <Button
              flex={1}
              size="sm"
              variant="outline"
              colorScheme="yellow"
              leftIcon={<FaCreditCard />}
              onClick={() => {
                onClose();
                navigate('/topup');
              }}
            >
              Topup Koin
            </Button>
            <Button
              flex={1}
              size="sm"
              variant="outline"
              colorScheme="purple"
              leftIcon={<FaCrown />}
              onClick={() => {
                onClose();
                navigate('/portal/toko');
              }}
            >
              Member VIP
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaywallModal;
