import React, { useState, useEffect } from 'react';
import { Box, Image, Tooltip, useToast } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import NgawonggoLogo from './NgawonggoLogo';

const MotionBox = motion(Box);
const MotionImage = motion(Image);

const DoodleLogo = ({ doodleData }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const controls = useAnimation();
  const toast = useToast();

  useEffect(() => {
    // Initial entrance animation based on type
    if (!doodleData) return;

    const baseTransition = { duration: 2, repeat: Infinity, ease: "easeInOut" };

    switch (doodleData.animation_type) {
      case 'float':
        controls.start({ y: [0, -15, 0], transition: baseTransition });
        break;
      case 'pulse':
        controls.start({ scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity } });
        break;
      case 'spin':
        controls.start({ rotate: [0, 360], transition: { duration: 10, repeat: Infinity, ease: "linear" } });
        break;
      case 'bounce':
        controls.start({ y: [0, -20, 0], transition: { duration: 0.8, repeat: Infinity, ease: "easeOut" } });
        break;
      case 'swing':
        controls.start({ rotate: [-5, 5, -5], transition: baseTransition });
        break;
      default:
        controls.start({ y: 0 }); // no animation
    }
  }, [doodleData, controls]);

  const handleClick = () => {
    if (!doodleData) return;

    switch (doodleData.easter_egg_action) {
      case 'confetti':
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Stop after 5s
        break;
      case 'spin_fast':
        controls.start({ rotate: 1080, transition: { duration: 1.5, ease: "easeInOut" } }).then(() => {
          // restore original animation
          if (doodleData.animation_type === 'float') controls.start({ y: [0, -15, 0], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } });
          else if (doodleData.animation_type === 'none') controls.start({ rotate: 0 });
        });
        break;
      case 'sound_yay':
        // Ideally we would play a sound file here
        toast({
            title: "Yaaay! 🎉",
            description: "Selamat merayakan hari spesial ini!",
            status: "success",
            position: "top",
            duration: 3000,
            isClosable: true,
        });
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
        break;
      case 'explode':
        controls.start({ scale: [1, 1.5, 0, 1], opacity: [1, 0, 0, 1], transition: { duration: 1 } });
        break;
      default:
        // just a little bounce
        controls.start({ scale: [1, 0.9, 1.1, 1], transition: { duration: 0.4 } });
    }
  };

  if (!doodleData) {
    // Fallback to normal logo
    return (
      <MotionBox
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 50 }}
        _hover={{ scale: 1.05 }}
        cursor="pointer"
      >
        <NgawonggoLogo fontSize={{ base: "4xl", md: "5xl" }} iconSize={{ base: 24, md: 32 }} flexDirection="column" color="white" />
      </MotionBox>
    );
  }

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0 }} recycle={false} numberOfPieces={500} />}

      <Tooltip label={doodleData.title} placement="bottom" hasArrow bg="brand.600" color="white" fontSize="md" py={2} px={4} borderRadius="xl">
        <MotionBox
          cursor="pointer"
          onClick={handleClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          position="relative"
        >
            {doodleData.show_default_logo && (
              <Box position="absolute" bottom="-15px" right="-15px" zIndex={2} transform="scale(0.6)">
                  <NgawonggoLogo fontSize="2xl" iconSize={12} flexDirection="row" color="white" />
              </Box>
            )}
            <MotionImage
              src={doodleData.image_url}
              alt={doodleData.title}
              maxH={{ base: "150px", md: "250px" }}
              objectFit="contain"
              animate={controls}
              filter="drop-shadow(0px 10px 15px rgba(0,0,0,0.5))"
            />
            {/* Soft glow behind the doodle */}
            <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w="120%"
                h="120%"
                bg="radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)"
                zIndex={-1}
                pointerEvents="none"
            />
        </MotionBox>
      </Tooltip>
    </>
  );
};

export default DoodleLogo;
