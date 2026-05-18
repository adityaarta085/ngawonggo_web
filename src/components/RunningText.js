import React, { useEffect, useState, useCallback } from 'react';
import { Box, Text, Flex, Icon } from '@chakra-ui/react';
import { FaBullhorn } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const RunningText = ({ isEmbedded = false }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error.message);
        setAnnouncements([]);
        return;
      }

      // Validasi data
      const safeData = Array.isArray(data)
        ? data.filter(item => item?.content)
        : [];

      setAnnouncements(safeData);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchAnnouncements();
      }
    };

    loadData();

    // Cleanup untuk mencegah memory leak
    return () => {
      isMounted = false;
    };
  }, [fetchAnnouncements]);

  // Saat loading atau tidak ada data
  if (loading || announcements.length === 0) return null;

  // Gabungkan text dengan fallback
  const combinedText =
    announcements
      .map(a => a?.content?.trim())
      .filter(Boolean)
      .join('  •  ') || 'Tidak ada pengumuman';

  if (isEmbedded) {
    return (
      <Flex align="center" overflow="hidden" whiteSpace="nowrap">
        <Icon as={FaBullhorn} mr={2} color="brand.500" />

        <Box flex={1} overflow="hidden">
          <motion.div
            animate={{ x: ['100%', '-100%'] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: 'linear',
            }}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            <Text
              fontWeight="600"
              fontSize="xs"
              color="gray.600"
            >
              {combinedText}
            </Text>
          </motion.div>
        </Box>
      </Flex>
    );
  }

  return (
    <Box
      bg="brand.500"
      color="white"
      py={1}
      overflow="hidden"
      position="relative"
    >
      <Flex
        align="center"
        maxW="container.xl"
        mx="auto"
        px={4}
      >
        <Icon as={FaBullhorn} mr={3} />

        <Box flex={1} overflow="hidden" whiteSpace="nowrap">
          <motion.div
            animate={{ x: ['100%', '-100%'] }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: 'linear',
            }}
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            <Text fontWeight="600" fontSize="sm">
              {combinedText}
            </Text>
          </motion.div>
        </Box>
      </Flex>
    </Box>
  );
};

export default RunningText;
