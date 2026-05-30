import React, { useState, useEffect } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
    Button, SimpleGrid, Box, Text, VStack, Icon, useToast
} from '@chakra-ui/react';
import { FaCoins, FaCheckCircle } from 'react-icons/fa';
import { supabase } from '../../../lib/supabase';
import { getByColumn } from '../../../lib/dataFetcher';
import { dracinTheme } from '../theme';
import Confetti from 'react-confetti';

export const CheckInModal = ({ isOpen, onClose, userSession, onCheckInSuccess }) => {
    const [streak, setStreak] = useState(0);
    const [lastCheckin, setLastCheckin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (isOpen && userSession) {
            fetchCheckinData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, userSession]);

    const fetchCheckinData = async () => {
        const { data } = await getByColumn('dracin_checkins', 'user_id', userSession.user.id);
        if (data) {
            setStreak(data.streak);
            setLastCheckin(data.last_checkin_date);
        }
    };

    const handleCheckIn = async () => {
        if (!userSession) return;
        setLoading(true);
        try {
            // Check if already checked in today
            const today = new Date().toISOString().split('T')[0];
            if (lastCheckin === today) {
                toast({ title: "Sudah Check-In", description: "Kamu sudah check-in hari ini.", status: "info" });
                setLoading(false);
                return;
            }

            // Determine reward (e.g., higher probability of good reward for new users, but we'll use random 25-200)
            const isNewUser = streak === 0;
            const min = isNewUser ? 100 : 25;
            const max = 200;
            const reward = Math.floor(Math.random() * (max - min + 1)) + min;

            const { data, error } = await supabase.rpc('dracin_daily_checkin', { p_reward: reward });

            if (error) throw error;

            if (data === 0) {
                toast({ title: "Sudah Check-In", status: "info" });
            } else {
                setShowConfetti(true);
                toast({ title: "Check-In Berhasil!", description: `Mendapatkan ${data} Koin Desa`, status: "success" });
                onCheckInSuccess(data);
                fetchCheckinData();
                setTimeout(() => setShowConfetti(false), 5000);
            }
        } catch (err) {
            toast({ title: "Gagal", description: "Terjadi kesalahan sistem.", status: "error" });
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];
    const canCheckIn = lastCheckin !== today;

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent bg={dracinTheme.bg} color={dracinTheme.textPrimary} border={`1px solid ${dracinTheme.accentGold}`}>
                {showConfetti && <Box position="fixed" top={0} left={0} w="100%" h="100%" zIndex={9999} pointerEvents="none"><Confetti recycle={false} numberOfPieces={200} /></Box>}
                <ModalHeader color={dracinTheme.accentGold} textAlign="center">Check-In Harian</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={6}>
                        <Text color={dracinTheme.textSecondary} textAlign="center">
                            Lakukan check-in setiap hari untuk mendapatkan Koin Desa gratis (25 - 200 Koin).
                        </Text>

                        <SimpleGrid columns={4} spacing={3} w="100%">
                            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                                const isClaimed = day <= streak % 7 || (streak > 0 && streak % 7 === 0);
                                return (
                                    <Box
                                        key={day}
                                        bg={isClaimed ? dracinTheme.accentGold : dracinTheme.cardBg}
                                        color={isClaimed ? "black" : "white"}
                                        p={3}
                                        borderRadius="lg"
                                        textAlign="center"
                                        border={`1px solid ${isClaimed ? dracinTheme.accentGold : dracinTheme.glassBorder}`}
                                    >
                                        <Text fontSize="xs" fontWeight="bold">Hari {day}</Text>
                                        <Icon as={isClaimed ? FaCheckCircle : FaCoins} mt={2} boxSize={5} />
                                    </Box>
                                );
                            })}
                        </SimpleGrid>

                        <Text fontSize="sm" color="gray.400">Streak saat ini: {streak} Hari</Text>
                    </VStack>
                </ModalBody>
                <ModalFooter justifyContent="center">
                    <Button
                        colorScheme="yellow"
                        bg={dracinTheme.accentGold}
                        color="black"
                        size="lg"
                        w="full"
                        onClick={handleCheckIn}
                        isLoading={loading}
                        isDisabled={!canCheckIn}
                        _hover={{ bg: "yellow.500" }}
                    >
                        {canCheckIn ? "Check-In Sekarang" : "Sudah Claim Hari Ini"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
