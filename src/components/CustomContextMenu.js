import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, Text, HStack, Icon, useToast } from '@chakra-ui/react';
import { FaCopy, FaCheckSquare, FaVolumeUp } from 'react-icons/fa';
import axios from 'axios';
import { useMonetization } from '../contexts/MonetizationContext';

const CustomContextMenu = () => {
    const { isVIP } = useMonetization();
    const [contextData, setContextData] = useState({ visible: false, x: 0, y: 0 });
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState(null);
    const contextRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
            const clickX = e.clientX;
            const clickY = e.clientY;
            setContextData({ visible: true, x: clickX, y: clickY });
        };

        const handleClick = (e) => {
            if (contextRef.current && !contextRef.current.contains(e.target)) {
                setContextData({ visible: false, x: 0, y: 0 });
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', handleClick);
        };
    }, []);

    const handleCopy = () => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            navigator.clipboard.writeText(selectedText);
            toast({ title: "Teks disalin!", status: "success", duration: 2000 });
        }
        setContextData({ visible: false, x: 0, y: 0 });
    };

    const handleSelectAll = () => {
        document.execCommand("selectAll", false, null);
        setContextData({ visible: false, x: 0, y: 0 });
    };

    const handleTTS = async () => {
        if (!isVIP) {
            toast({
                title: "Fitur Khusus VIP",
                description: "Upgrade ke VIP untuk dapat mendengarkan pembacaan teks otomatis.",
                status: "warning",
                duration: 4000,
                isClosable: true,
            });
            setContextData({ visible: false, x: 0, y: 0 });
            return;
        }

        const selectedText = window.getSelection().toString();
        if (!selectedText) {
            toast({
                title: "Pilih Teks Terlebih Dahulu",
                description: "Sorot/highlight teks yang ingin dibacakan.",
                status: "info",
                duration: 3000,
            });
            setContextData({ visible: false, x: 0, y: 0 });
            return;
        }

        if (isPlaying && audioElement) {
            audioElement.pause();
            setIsPlaying(false);
            setContextData({ visible: false, x: 0, y: 0 });
            return;
        }

        setContextData({ visible: false, x: 0, y: 0 });
        toast({ title: "Memproses suara...", status: "info", duration: 2000 });

        try {
            const res = await axios.get(`https://api.nexray.eu.cc/ai/gemini-tts?text=${encodeURIComponent(selectedText)}`);
            if (res.data && res.data.status && res.data.result) {
                const audio = new Audio(res.data.result);
                audio.onended = () => setIsPlaying(false);
                audio.play();
                setAudioElement(audio);
                setIsPlaying(true);
            } else {
                 throw new Error("Gagal mengambil audio TTS.");
            }
        } catch (error) {
            console.error("TTS Error:", error);
            toast({
                title: 'Gagal Membacakan Teks',
                description: 'Terjadi kesalahan saat memproses permintaan.',
                status: 'error',
                duration: 3000,
            });
        }
    };

    if (!contextData.visible) return null;

    // Adjust position if it overflows the window
    const menuStyle = {
        position: 'fixed',
        top: `${contextData.y}px`,
        left: `${contextData.x}px`,
        zIndex: 9999,
    };

    return (
        <Box
            ref={contextRef}
            style={menuStyle}
            bg="white"
            boxShadow="xl"
            borderRadius="md"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.200"
            minW="200px"
            py={2}
        >
            <VStack align="stretch" spacing={0}>
                <HStack
                    px={4} py={2}
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onClick={handleCopy}
                >
                    <Icon as={FaCopy} color="gray.500" />
                    <Text fontSize="sm" color="gray.700">Salin</Text>
                </HStack>
                <HStack
                    px={4} py={2}
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onClick={handleSelectAll}
                >
                    <Icon as={FaCheckSquare} color="gray.500" />
                    <Text fontSize="sm" color="gray.700">Pilih Semua</Text>
                </HStack>
                <HStack
                    px={4} py={2}
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    onClick={handleTTS}
                >
                    <Icon as={FaVolumeUp} color={isVIP ? "yellow.500" : "gray.400"} />
                    <Text fontSize="sm" color={isVIP ? "gray.700" : "gray.500"}>Bacakan Teks (TTS) {!isVIP && " - VIP"}</Text>
                </HStack>
            </VStack>
        </Box>
    );
};

export default CustomContextMenu;
