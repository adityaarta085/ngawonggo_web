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
      borderRadius="md"
      overflow="hidden"
      boxShadow="lg"
      position="relative"
      w="full"
      maxW={placementType === 'inline' ? "full" : "400px"}
    >
      {placementType !== 'inline' && (
        <CloseButton
          position="absolute"
          top={2}
          right={2}
          zIndex={2}
          bg="rgba(0,0,0,0.5)"
          color="white"
          size="sm"
          borderRadius="full"
          _hover={{ bg: "rgba(0,0,0,0.7)" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClose(ad.id);
          }}
        />
      )}

      <Box position="relative">
        {ad.media_type === 'image' ? (
          <Image src={ad.media_url} alt={ad.title} w="full" objectFit="cover" maxH="300px" />
        ) : (
          <video
            ref={el => videoRefs.current[ad.id] = el}
            src={ad.media_url}
            muted={!ad.has_audio}
            loop
            playsInline
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
          />
        )}
      </Box>

      <Box p={3}>
        <Text fontSize="xs" color="gray.500" mb={1} fontWeight="600" fontStyle="italic">
          *Ini Adalah Iklan {ad.category}*
        </Text>
        <Text fontWeight="bold" fontSize="md" noOfLines={1} mb={1}>
          {ad.title}
        </Text>
        {ad.description && (
          <Text fontSize="sm" color={textColor} noOfLines={2} mb={2}>
            {ad.description}
          </Text>
        )}
        {ad.action_url && (
          <Link href={ad.action_url} isExternal _hover={{ textDecoration: 'none' }}>
             <Text color="brand.500" fontSize="sm" fontWeight="bold">Info Selengkapnya &rarr;</Text>
          </Link>
        )}
      </Box>
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
