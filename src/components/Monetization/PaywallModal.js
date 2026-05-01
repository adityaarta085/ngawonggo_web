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
} from '@chakra-ui/react';
import { FaCoins, FaCrown, FaTicketAlt, FaPlay } from 'react-icons/fa';
import { useMonetization } from '../../contexts/MonetizationContext';
import { useNavigate } from 'react-router-dom';

const PaywallModal = ({ isOpen, onClose, title, message, price, currencyType, onPay, isAdAvailable = false }) => {
  const { currency, deductCurrency } = useMonetization();
  const navigate = useNavigate();
  const balance = currency[currencyType];
  const canAfford = balance >= price;

  const handlePay = async () => {
    if (canAfford) {
        const success = await deductCurrency(price, currencyType, title);
        if (success) {
            onPay();
            onClose();
        }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl">
        <ModalHeader textAlign="center">{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} textAlign="center" py={4}>
            <Icon
              as={currencyType === 'coins' ? FaCoins : FaTicketAlt}
              boxSize={12}
              color={currencyType === 'coins' ? 'yellow.400' : 'blue.400'}
            />
            <Text color="gray.600">{message}</Text>

            <HStack bg="gray.50" p={4} borderRadius="xl" w="full" justify="space-between">
                <Text fontWeight="bold" color="gray.600">Saldo Anda:</Text>
                <HStack>
                    <Icon as={currencyType === 'coins' ? FaCoins : FaTicketAlt} color={currencyType === 'coins' ? 'yellow.400' : 'blue.400'} />
                    <Text fontWeight="bold" fontSize="lg">{balance}</Text>
                </HStack>
            </HStack>

            {!canAfford && (
                <Text fontSize="sm" color="red.500">
                    Saldo {currencyType} tidak cukup. Silakan Topup / Isi Ulang (QRIS).
                </Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter flexDirection="column" gap={3}>
          <Button
            w="full"
            colorScheme={currencyType === 'coins' ? 'yellow' : 'blue'}
            size="lg"
            onClick={handlePay}
            isDisabled={!canAfford}
            leftIcon={<Icon as={currencyType === 'coins' ? FaCoins : FaTicketAlt} />}
          >
            Bayar {price} {currencyType === 'coins' ? 'Koin' : 'Tiket'}
          </Button>

          {isAdAvailable && (
              <Button
                w="full"
                variant="outline"
                colorScheme="gray"
                leftIcon={<Icon as={FaPlay} color="gray.500" />}
                isDisabled={true} // "SAAT INI BELUM ADA JADI HARUS BAYAR"
              >
                Nonton Iklan (Belum Tersedia)
              </Button>
          )}

          <Button w="full" variant="ghost" colorScheme="brand" leftIcon={<FaCrown />} onClick={() => {
            onClose();
            navigate('/donasi'); // Redirecting to Topup/Donasi route as per existing QRIS flow
          }}>
            Upgrade Premium / VIP
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaywallModal;
