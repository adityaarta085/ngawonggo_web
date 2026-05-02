const fs = require('fs');

const code = `import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, Text, HStack, Icon, useToast } from '@chakra-ui/react';
import { FaCopy, FaCheckSquare, FaVolumeUp } from 'react-icons/fa';
import axios from 'axios';
import { useMonetization } from '../contexts/MonetizationContext';

const CustomContextMenu = () => {
    const { isVIP } = useMonetization();
    const [contextData, setContextData] = useState({ visible: false, x: 0, y: 0, fromSelection: false, selectedText: "" });
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState(null);
    const contextRef = useRef(null);
    const toast = useToast();

    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();

            const text = window.getSelection().toString().trim();

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

            setContextData({ visible: true, x: clickX, y: clickY, fromSelection: false, selectedText: text });
        };

        const handleSelectionEnd = (e) => {
            // For mobile and mouse selection
            setTimeout(() => {
                const text = window.getSelection().toString().trim();
                if (text && text.length > 0) {
                    // Try to place the menu near the selection
                    let x = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || window.innerWidth / 2;
                    let y = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || window.innerHeight / 2;

                    const menuWidth = 200;
                    const menuHeight = 150;

                    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
                    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;

                    // Don't show again if it's already visible to avoid flickering
                    setContextData((prev) => {
                        if (prev.visible && prev.fromSelection) return { ...prev, selectedText: text };
                        return { visible: true, x, y, fromSelection: true, selectedText: text };
                    });
                }
            }, 100);
        };

        const handleClick = (e) => {
            if (contextRef.current && !contextRef.current.contains(e.target)) {
                const text = window.getSelection().toString().trim();
                // Close if clicking outside and no text is selected, or if we clicked somewhere that cleared selection
                if (!text) {
                    setContextData({ visible: false, x: 0, y: 0, fromSelection: false, selectedText: "" });
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
        const textToCopy = contextData.selectedText || window.getSelection().toString();
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
            toast({ title: "Teks disalin!", status: "success", duration: 2000 });
        }
        setContextData({ visible: false, x: 0, y: 0, fromSelection: false, selectedText: "" });
        window.getSelection().removeAllRanges();
    };

    const handleSelectAll = () => {
        document.execCommand("selectAll", false, null);
        setContextData({ visible: false, x: 0, y: 0, fromSelection: false, selectedText: "" });
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
            setContextData({ visible: false, x: 0, y: 0, fromSelection: false, selectedText: "" });
            return;
        }

        const textToRead = contextData.selectedText || window.getSelection().toString();

        if (!textToRead) {
            toast({
                title: "Pilih Teks Terlebih Dahulu",
                description: "Sorot/highlight teks yang ingin dibacakan.",
                status: "info",
                duration: 3000,
            });
            setContextData({ visible: false, x: 0, y: 0, fromSelection: false, selectedText: "" });
            return;
        }

        if (isPlaying && audioElement) {
            audioElement.pause();
            setIsPlaying(false);
            setContextData({ visible: false, x: 0, y: 0, fromSelection: false, selectedText: "" });
            return;
        }

        setContextData({ visible: false, x: 0, y: 0, fromSelection: false, selectedText: "" });
        toast({ title: "Memproses suara...", status: "info", duration: 2000 });

        try {
            const res = await axios.get(\`https://api.nexray.eu.cc/ai/gemini-tts?text=\${encodeURIComponent(textToRead)}\`);
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
                    <Icon as={FaVolumeUp} color={isVIP ? "yellow.500" : "gray.400"} />
                    <Text fontSize="sm" color={isVIP ? "gray.700" : "gray.500"}>Bacakan Teks (TTS) {!isVIP && " - VIP"}</Text>
                </HStack>
            </VStack>
        </Box>
    );
};

export default CustomContextMenu;
`;

fs.writeFileSync('src/components/CustomContextMenu.js', code);
