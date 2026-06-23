import React, { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Icon, Spinner } from '@chakra-ui/react';
import { FaTv, FaChevronLeft } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

const LiveStreamView = () => {
  const [liveStreamUrl, setLiveStreamUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStream = async () => {
    try {
      setLoading(true);
      const { data: stream } = await supabase
        .from('display_livestreams')
        .select('url')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (stream) {
        setLiveStreamUrl(stream.url);
      } else {
        setLiveStreamUrl(null);
      }
    } catch (error) {
      console.error('Error fetching livestream:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStream();

    const displayChannel = supabase
      .channel('displays_realtime_media_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'display_livestreams' }, () => {
        fetchStream();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(displayChannel);
    };
  }, []);

  return (
    <Box w="100vw" h="100vh" bg="black" position="relative" overflow="hidden">
      {/* Back Button Overlay */}
      <Flex
        position="absolute"
        top={6}
        left={6}
        bg="rgba(0, 0, 0, 0.5)"
        backdropFilter="blur(8px)"
        px={4}
        py={2}
        borderRadius="full"
        align="center"
        gap={2}
        cursor="pointer"
        onClick={() => navigate('/media')}
        zIndex={20}
        _hover={{ bg: "rgba(0, 0, 0, 0.7)" }}
        transition="all 0.2s"
        color="white"
      >
        <Icon as={FaChevronLeft} />
        <Text fontWeight="bold">Kembali</Text>
      </Flex>

      {loading ? (
        <Flex w="full" h="full" justify="center" align="center" direction="column">
          <Spinner size="xl" color="brand.500" mb={4} />
          <Heading color="white" size="md">Memuat Siaran...</Heading>
        </Flex>
      ) : liveStreamUrl ? (
        <ReactPlayer
          url={liveStreamUrl}
          width="100%"
          height="100%"
          playing={true}
          controls={true}
          muted={false}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      ) : (
        <Flex w="full" h="full" align="center" justify="center" direction="column">
          <Icon as={FaTv} w={20} h={20} color="gray.600" mb={6} />
          <Heading size="lg" color="gray.500" mb={2}>Siaran Sedang Offline</Heading>
          <Text color="gray.600" fontSize="lg">Menunggu admin memulai siaran langsung Ngawonggo TV.</Text>
        </Flex>
      )}
    </Box>
  );
};

export default LiveStreamView;
