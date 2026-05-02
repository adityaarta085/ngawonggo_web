import React, { useState } from 'react';
import { Button, Icon, useToast, Tooltip } from '@chakra-ui/react';
import { FaVolumeUp, FaSpinner, FaStop } from 'react-icons/fa';
import axios from 'axios';
import { useMonetization } from '../contexts/MonetizationContext';

const TTSReader = ({ textToRead, isGlobal = false }) => {
    const { isVIP } = useMonetization();
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioElement, setAudioElement] = useState(null);
    const toast = useToast();

    if (!isVIP) return null;

    const handleReadText = async () => {
        if (isPlaying && audioElement) {
            audioElement.pause();
            setIsPlaying(false);
            return;
        }

        let text = textToRead;
        if (isGlobal) {
            text = window.getSelection().toString();
            if (!text) {
                toast({
                    title: 'Pilih teks terlebih dahulu',
                    description: 'Sorot teks yang ingin dibacakan.',
                    status: 'info',
                    duration: 3000,
                });
                return;
            }
        }

        if (!text) return;

        setIsLoading(true);
        try {
            const res = await axios.get(`https://api.nexray.eu.cc/ai/gemini-tts?text=${encodeURIComponent(text)}`);
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
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Tooltip label={isPlaying ? "Berhentikan Audio" : "Bacakan Teks (Khusus VIP)"}>
            <Button
                size={isGlobal ? "sm" : "md"}
                colorScheme="yellow"
                variant={isGlobal ? "solid" : "outline"}
                leftIcon={isLoading ? <Icon as={FaSpinner} className="fa-spin" /> : (isPlaying ? <Icon as={FaStop} /> : <Icon as={FaVolumeUp} />)}
                onClick={handleReadText}
                isLoading={isLoading}
                position={isGlobal ? "fixed" : "static"}
                bottom={isGlobal ? "20px" : "auto"}
                right={isGlobal ? "20px" : "auto"}
                zIndex={isGlobal ? 999 : "auto"}
                borderRadius={isGlobal ? "full" : "md"}
                boxShadow={isGlobal ? "lg" : "none"}
            >
                {isGlobal ? "Bacakan Teks Terpilih" : "Bacakan"}
            </Button>
        </Tooltip>
    );
};

export default TTSReader;
