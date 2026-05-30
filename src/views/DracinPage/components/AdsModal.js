import React, { useState } from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
    Button, Box, Text, VStack, useToast, Progress
} from '@chakra-ui/react';
import { supabase } from '../../../lib/supabase';
import { getById } from '../../../lib/dataFetcher';
import { dracinTheme } from '../theme';
import Confetti from 'react-confetti';

export const AdsModal = ({ isOpen, onClose, userSession, onRewardSuccess }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const toast = useToast();

    const startAd = () => {
        setIsPlaying(true);
        let time = Math.floor(Math.random() * 11) + 5; // 5-15 seconds
        setTimeLeft(time);

        const timer = setInterval(() => {
            time -= 1;
            setTimeLeft(time);
            if (time <= 0) {
                clearInterval(timer);
                finishAd();
            }
        }, 1000);
    };

    const finishAd = async () => {
        setIsPlaying(false);
        if (!userSession) return;

        try {
            const reward = Math.floor(Math.random() * 56) + 20; // 20-75 coins

            // Assuming an RPC or direct update if permitted
            const { data: userCurr } = await getById('user_currencies', userSession.user.id);
            if (userCurr) {
                await supabase.from('user_currencies').update({ coins: userCurr.coins + reward }).eq('user_id', userSession.user.id);

                setShowConfetti(true);
                toast({ title: "Iklan Selesai!", description: `Kamu mendapatkan ${reward} Koin Desa.`, status: "success" });
                onRewardSuccess(reward);
                setTimeout(() => {
                    setShowConfetti(false);
                    onClose();
                }, 4000);
            }
        } catch (err) {
            toast({ title: "Gagal memproses hadiah", status: "error" });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={isPlaying ? undefined : onClose} isCentered closeOnOverlayClick={!isPlaying}>
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent bg={dracinTheme.bg} color={dracinTheme.textPrimary} border={`1px solid ${dracinTheme.accentRed}`}>
                {showConfetti && <Box position="fixed" top={0} left={0} w="100%" h="100%" zIndex={9999} pointerEvents="none"><Confetti recycle={false} numberOfPieces={200} /></Box>}
                <ModalHeader color={dracinTheme.accentRed} textAlign="center">Tonton Iklan</ModalHeader>
                {!isPlaying && <ModalCloseButton />}
                <ModalBody pb={6}>
                    <VStack spacing={6}>
                        {isPlaying ? (
                            <Box w="100%" textAlign="center">
                                <Box bg="black" h="200px" w="100%" borderRadius="md" display="flex" alignItems="center" justifyContent="center" mb={4}>
                                    <Text color="gray.500">Iklan sedang diputar...</Text>
                                </Box>
                                <Text fontWeight="bold" fontSize="xl" mb={2}>{timeLeft} detik</Text>
                                <Progress value={(15 - timeLeft) / 15 * 100} size="sm" colorScheme="red" />
                                <Text fontSize="xs" color="gray.400" mt={2}>Tolong jangan tutup jendela ini.</Text>
                            </Box>
                        ) : (
                            <>
                                <Text textAlign="center" color={dracinTheme.textSecondary}>
                                    Tonton iklan singkat (5-15 detik) untuk mendapatkan 20 hingga 75 Koin Desa secara acak!
                                </Text>
                                <Button
                                    colorScheme="red"
                                    bg={dracinTheme.accentRed}
                                    size="lg"
                                    w="full"
                                    onClick={startAd}
                                    _hover={{ bg: "red.700" }}
                                >
                                    Mulai Menonton
                                </Button>
                            </>
                        )}
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
