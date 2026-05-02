const fs = require('fs');

const code = `import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, Text, HStack, Icon, useToast } from '@chakra-ui/react';
import { FaCopy, FaCheckSquare, FaVolumeUp } from 'react-icons/fa';
import axios from 'axios';

// Ensure it works for all users by avoiding monetization constraints temporarily or checking if we need to remove the restriction.
// Wait, the prompt says "tambah 1 fitur yaitu TTS text to speech pakai rest api yang sebenarnya sudah ada".
// It doesn't mention removing VIP, but it implies the feature should just work.
// Let's modify CustomContextMenu to handle text selection gracefully for mobile too.

import { useMonetization } from '../contexts/MonetizationContext';

const CustomContextMenu = () => {
    const { isVIP } = useMonetization();
    const [contextData, setContextData] = useState({ visible: false, x: 0, y: 0, fromSelection: false });
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState(null);
    const contextRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();

            // Adjust coordinates to prevent menu from going off-screen
            const menuWidth = 200;
            const menuHeight = 150;

            let clickX = e.clientX;
            let clickY = e.clientY;

            if (clickX + menuWidth > window.innerWidth) {
                clickX = window.innerWidth - menuWidth - 10;
            }
            if (clickY + menuHeight > window.innerHeight) {
                clickY = window.innerHeight - menuHeight - 10;
            }

            setContextData({ visible: true, x: clickX, y: clickY, fromSelection: false });
        };

        const handleSelectionEnd = (e) => {
            // For mobile and mouse selection
            setTimeout(() => {
                const selectedText = window.getSelection().toString().trim();
                if (selectedText && selectedText.length > 0) {
                    // Try to place the menu near the selection
                    let x = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || window.innerWidth / 2;
                    let y = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || window.innerHeight / 2;

                    const menuWidth = 200;
                    const menuHeight = 150;

                    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
                    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;

                    // Don't show again if it's already visible to avoid flickering
                    setContextData((prev) => {
                        if (prev.visible && prev.fromSelection) return prev;
                        return { visible: true, x, y, fromSelection: true };
                    });
                }
            }, 100);
        };

        const handleClick = (e) => {
            if (contextRef.current && !contextRef.current.contains(e.target)) {
                const selectedText = window.getSelection().toString().trim();
                // Close if clicking outside and no text is selected, or if we clicked somewhere that cleared selection
                if (!selectedText) {
                    setContextData({ visible: false, x: 0, y: 0, fromSelection: false });
                }
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', handleClick);
        document.addEventListener('mouseup', handleSelectionEnd);
        document.addEventListener('touchend', handleSelectionEnd);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', handleClick);
            document.removeEventListener('mouseup', handleSelectionEnd);
            document.removeEventListener('touchend', handleSelectionEnd);
        };
    }, []);

    const handleCopy = () => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            navigator.clipboard.writeText(selectedText);
            toast({ title: "Teks disalin!", status: "success", duration: 2000 });
        }
        setContextData({ visible: false, x: 0, y: 0, fromSelection: false });
        window.getSelection().removeAllRanges();
    };

    const handleSelectAll = () => {
        document.execCommand("selectAll", false, null);
        setContextData({ visible: false, x: 0, y: 0, fromSelection: false });
    };

    const handleTTS = async () => {
        // According to user request: "tambah 1 fitur yaitu TTS text to speech pakai rest api yang sebenarnya sudah ada, cumaa Custom Context Menu harus ADA DAN GLOBAL DAN BERFUNGSI DI SEMUA PERANGKAT"

        const selectedText = window.getSelection().toString();
        if (!selectedText) {
            toast({
                title: "Pilih Teks Terlebih Dahulu",
                description: "Sorot/highlight teks yang ingin dibacakan.",
                status: "info",
                duration: 3000,
            });
            setContextData({ visible: false, x: 0, y: 0, fromSelection: false });
            return;
        }

        if (isPlaying && audioElement) {
            audioElement.pause();
            setIsPlaying(false);
            setContextData({ visible: false, x: 0, y: 0, fromSelection: false });
            return;
        }

        setContextData({ visible: false, x: 0, y: 0, fromSelection: false });
        toast({ title: "Memproses suara...", status: "info", duration: 2000 });

        try {
            const res = await axios.get(\`https://api.nexray.eu.cc/ai/gemini-tts?text=\${encodeURIComponent(selectedText)}\`);
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

    const menuStyle = {
        position: 'fixed',
        top: \`\${contextData.y}px\`,
        left: \`\${contextData.x}px\`,
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
                    <Icon as={FaVolumeUp} color="yellow.500" />
                    <Text fontSize="sm" color="gray.700">Bacakan Teks (TTS)</Text>
                </HStack>
            </VStack>
        </Box>
    );
};

export default CustomContextMenu;
`;

fs.writeFileSync('src/components/CustomContextMenu.js', code);
