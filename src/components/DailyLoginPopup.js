import React, { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  useToast,
  Icon,
  HStack
} from '@chakra-ui/react';
import { FaCalendarCheck, FaCoins, FaStar } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useMonetization } from '../contexts/MonetizationContext';

const DailyLoginPopup = () => {
  const { user } = useAuth();
  const { gamification, refreshData } = useMonetization();
  const [isOpen, setIsOpen] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!user || !gamification) return;

    const checkLoginStatus = () => {
      const lastLogin = gamification.last_login_date;
      const today = new Date().toISOString().split('T')[0];

      // If no last login or last login is not today, show popup
      if (!lastLogin || lastLogin !== today) {
        // Adding a slight delay so it doesn't jarringly pop up immediately on mount
        setTimeout(() => setIsOpen(true), 1500);
      }
    };

    checkLoginStatus();
  }, [user, gamification]);

  const handleClaim = async () => {
    if (!user) return;
    setClaiming(true);
    try {
      const { data, error } = await supabase.rpc('update_daily_login', {
        target_user_id: user.id
      });

      if (error) throw error;

      if (data && data.success) {
        toast({
          title: "Berhasil Check-in!",
          description: `Kamu dapat ${data.points_rewarded} Poin${data.coins_rewarded > 0 ? ` & ${data.coins_rewarded} Koin` : ''}. Streak: ${data.new_streak} hari.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        refreshData(); // Refresh global monetization state
        setIsOpen(false);
      } else {
        toast({
          title: "Sudah Check-in",
          description: data?.message || "Kamu sudah mengambil hadiah hari ini.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        setIsOpen(false);
      }
    } catch (err) {
      console.error('Error claiming daily login:', err);
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat check-in.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} isCentered motionPreset="scale">
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent layerStyle="glassCard" m={4}>
        <ModalHeader textAlign="center" color="brand.500">
          <HStack justify="center">
            <Icon as={FaCalendarCheck} />
            <Text>Hadiah Harian</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={6}>
            <Text textAlign="center">
              Login setiap hari untuk mendapatkan hadiah! Semakin lama streak-mu, semakin bagus hadiahnya.
            </Text>

            <HStack spacing={4} justify="center" p={4} bg="whiteAlpha.100" borderRadius="xl" w="full">
              <VStack>
                <Icon as={FaStar} color="purple.400" boxSize={8} />
                <Text fontWeight="bold">+10 Poin</Text>
              </VStack>
              {gamification?.daily_login_streak % 7 === 6 && ( // Highlight if tomorrow is day 7
                <>
                  <Text fontWeight="bold" color="gray.400">+</Text>
                  <VStack>
                    <Icon as={FaCoins} color="yellow.400" boxSize={8} />
                    <Text fontWeight="bold">Bonus Koin besok!</Text>
                  </VStack>
                </>
              )}
            </HStack>

            <Text fontSize="sm" color="gray.400">
              Streak saat ini: {gamification?.daily_login_streak || 0} hari
            </Text>

            <Button
              colorScheme="brand"
              w="full"
              size="lg"
              isLoading={claiming}
              onClick={handleClaim}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            >
              Ambil Hadiah
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DailyLoginPopup;
