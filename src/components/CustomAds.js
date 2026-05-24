import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  Image,
  Link,
  useColorModeValue,
  CloseButton,
} from '@chakra-ui/react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const CustomAds = ({ placementType }) => {
  const [ads, setAds] = useState([]);
  const [visibleAds, setVisibleAds] = useState([]);
  const videoRefs = useRef({});
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const tagTextColor = useColorModeValue('gray.600', 'gray.300');
  const tagBorderColor = useColorModeValue('gray.300', 'gray.600');
  const titleColor = useColorModeValue('blue.600', 'blue.300');
  const mediaBg = useColorModeValue('gray.50', 'gray.900');
  const actionBorder = useColorModeValue('gray.100', 'gray.700');
  const actionBg = useColorModeValue('gray.50', 'gray.800');
  const actionText = useColorModeValue('gray.500', 'gray.400');

  useEffect(() => {
    const fetchAds = async () => {
      const { data, error } = await supabase
        .from('custom_ads')
        .select('*')
        .eq('placement_type', placementType)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setAds(data);
        setVisibleAds(data.map(ad => ad.id));
      }
    };

    fetchAds();
  }, [placementType]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target;
          if (entry.isIntersecting) {
            videoElement.play().catch(e => console.log('Autoplay prevented:', e));
          } else {
            videoElement.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    const currentRefs = videoRefs.current;
    Object.values(currentRefs).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      Object.values(currentRefs).forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [ads]);

  const handleClose = (adId) => {
    setVisibleAds(prev => prev.filter(id => id !== adId));
  };

  if (ads.length === 0) return null;

  const renderAdContent = (ad) => (
    <Box
      bg={bg}
      borderRadius="sm"
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
      boxShadow={placementType === 'inline' ? 'none' : 'md'}
      position="relative"
      w="full"
      maxW={placementType === 'inline' ? "full" : "360px"}
      _hover={{ boxShadow: 'sm' }}
      transition="all 0.2s"
    >
      {placementType !== 'inline' && (
        <CloseButton
          position="absolute"
          top={1}
          right={1}
          zIndex={2}
          bg="rgba(255,255,255,0.8)"
          color="gray.600"
          size="sm"
          _hover={{ bg: "white" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose(ad.id);
          }}
        />
      )}

      <Box p={3} pb={2}>
        <Flex align="center" gap={2} mb={2}>
          <Text
            fontSize="10px"
            fontWeight="bold"
            color={tagTextColor}
            border="1px solid"
            borderColor={tagBorderColor}
            px={1.5}
            py={0.5}
            borderRadius="sm"
          >
            Iklan
          </Text>
          <Text fontSize="xs" color="gray.500" noOfLines={1}>
            {ad.category}
          </Text>
        </Flex>

        <Text fontWeight="bold" fontSize="lg" color={titleColor} mb={1} lineHeight="tight" _hover={{ textDecoration: 'underline' }}>
          {ad.title}
        </Text>

        {ad.description && (
          <Text fontSize="sm" color={textColor} mb={3} lineHeight="tall">
            {ad.description}
          </Text>
        )}
      </Box>

      <Box position="relative" bg={mediaBg} display="flex" justifyContent="center" alignItems="center">
        {ad.media_type === 'image' ? (
          <Image
            src={ad.media_url}
            alt={ad.title}
            w="full"
            h="auto"
            maxH="400px"
            objectFit="contain"
            bg="transparent"
          />
        ) : (
          <video
            ref={el => videoRefs.current[ad.id] = el}
            src={ad.media_url}
            muted={!ad.has_audio}
            loop
            playsInline
            controls={ad.has_audio}
            style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', backgroundColor: 'transparent' }}
          />
        )}
      </Box>

      {ad.action_url && (
        <Box p={3} borderTopWidth="1px" borderColor={actionBorder} bg={actionBg}>
          <Flex justify="space-between" align="center">
            <Text color={actionText} fontSize="xs" noOfLines={1} maxW="70%">
               {(() => { try { return new URL(ad.action_url).hostname.replace('www.', ''); } catch(e) { return 'Kunjungi Situs'; } })()}
            </Text>
            <Text color="blue.500" fontSize="sm" fontWeight="600">Buka &rsaquo;</Text>
          </Flex>
        </Box>
      )}
    </Box>
  );

  if (placementType === 'inline') {
    return (
      <Flex direction="column" gap={4} my={4} w="full">
        {ads.filter(ad => visibleAds.includes(ad.id)).map(ad => (
          <Box key={ad.id} as={ad.action_url ? Link : Box} href={ad.action_url} isExternal={!!ad.action_url} display="block" _hover={{ textDecoration: 'none' }}>
             {renderAdContent(ad)}
          </Box>
        ))}
      </Flex>
    );
  }

  // Popup placements
  const popupStyles = {
    position: 'fixed',
    zIndex: 9999,
    pointerEvents: 'none',
  };

  if (placementType === 'popup_bottom') {
    Object.assign(popupStyles, { bottom: '20px', right: '20px' });
  } else if (placementType === 'popup_top') {
    Object.assign(popupStyles, { top: '80px', right: '20px' });
  } else if (placementType === 'popup_center') {
    Object.assign(popupStyles, { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
  }

  return (
    <Box style={popupStyles}>
      <AnimatePresence>
        {ads.filter(ad => visibleAds.includes(ad.id)).map((ad, index) => (
          <MotionBox
            key={ad.id}
            initial={{ opacity: 0, y: placementType === 'popup_bottom' ? 50 : (placementType === 'popup_top' ? -50 : 0), scale: placementType === 'popup_center' ? 0.9 : 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            mt={index > 0 ? 4 : 0}
            pointerEvents="auto"
          >
             <Box as={ad.action_url ? Link : Box} href={ad.action_url} isExternal={!!ad.action_url} display="block" _hover={{ textDecoration: 'none' }}>
                {renderAdContent(ad)}
             </Box>
          </MotionBox>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default CustomAds;
