import React, { useEffect, useState, useCallback } from 'react';
import { Box, Text, Flex, Icon } from '@chakra-ui/react';
import { FaBullhorn } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const RunningText = () => {
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAnnouncements(data);
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  if (announcements.length === 0) return null;

  const combinedText = announcements.map(a => a.content).join('  •  ');

  return (
    <Box bg="brand.500" color="white" py={1} overflow="hidden" position="relative">
      <Flex align="center" maxW="container.xl" mx="auto" px={4}>
        <Icon as={FaBullhorn} mr={3} />
        <Box flex={1} overflow="hidden" whiteSpace="nowrap">
          <motion.div
            animate={{ x: ['100%', '-100%'] }}
            transition={{
              repeat: Infinity,
              duration: 30,
              ease: "linear"
            }}
            style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
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
