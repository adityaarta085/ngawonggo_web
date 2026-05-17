import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box, Container, Heading, Text, Center, Flex, Button,
  IconButton, Tooltip, useToast, HStack, VStack
} from '@chakra-ui/react';
import { FaArrowLeft, FaShareAlt, } from 'react-icons/fa';
import { SEO } from '../../components';
import { dracinApi } from './api';

const DracinWatch = () => {
  const { id, episode } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const playerWrapperRef = useRef(null);

  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    useEffect(() => {
    let mounted = true;
    const loadEpisode = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await dracinApi.getEpisode(id, episode);
        if (mounted) {
            let foundUrl = null;
            if (res.main && res.main.indo_cdn_urls && res.main.indo_cdn_urls.length > 0) {
                foundUrl = res.main.indo_cdn_urls[0];
            } else if (res.main && res.main.indo_hd_cdn_urls && res.main.indo_hd_cdn_urls.length > 0) {
                foundUrl = res.main.indo_hd_cdn_urls[0];
            } else if (res.alt && res.alt.indo_cdn_urls && res.alt.indo_cdn_urls.length > 0) {
                foundUrl = res.alt.indo_cdn_urls[0];
            } else if (res.best_url) {
                foundUrl = res.best_url;
            } else if (res.videoList && res.videoList.length > 0) {
                const h264Video = res.videoList.find(v => v.encode === 'H264');
                foundUrl = h264Video ? h264Video.url : res.videoList[0].url;
            } else if (res.videoUrl) {
                foundUrl = res.videoUrl;
            }

            if (foundUrl) {
                setVideoUrl(foundUrl);
            } else {
                 setError("Video tidak tersedia untuk episode ini atau episode terkunci.");
            }
        }
      } catch (err) {
        if (mounted) setError("Gagal memuat video. Pastikan koneksi internet stabil.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadEpisode();

    return () => {
        mounted = false;
    };
  }, [id, episode]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Nonton Dracin Eps ${episode}`,
        text: `Tonton Episode ${episode} di Ngawonggo Portal!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Tautan disalin!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

    if (loading) return <Center h="100vh"><div className="custom-loader"></div></Center>;
  if (error) return <Center h="100vh"><VStack><Text color="red.500">{error}</Text><Button onClick={() => navigate(-1)}>Kembali</Button></VStack></Center>;

  return (
    <Box pt={24} pb={20}>
      <SEO title={`Episode ${episode} - Dracin`} />
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={6}>
            <Button as={RouterLink} to={`/dracin/detail/${id}`} leftIcon={<FaArrowLeft />} variant="ghost">
                Kembali ke Detail
            </Button>
            <HStack>
               <Tooltip label="Bagikan Link">
                   <IconButton icon={<FaShareAlt />} onClick={handleShare} aria-label="Share" />
               </Tooltip>
            </HStack>
        </Flex>

        <Heading size="lg" mb={6}>Episode {episode}</Heading>

        <Box ref={playerWrapperRef} w="100%" maxW="500px" mx="auto" bg="black" borderRadius="xl" overflow="hidden" position="relative" boxShadow="2xl">
            {videoUrl ? (
                <Box pt="177.78%" position="relative">
                    <video
                        src={videoUrl}
                        controls
                        autoPlay
                        width="100%"
                        height="100%"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                </Box>
            ) : (
                <Center h="400px" bg="gray.800" color="white">Video tidak ditemukan.</Center>
            )}

            </Box>

      </Container>
    </Box>
  );
};

export default DracinWatch;
