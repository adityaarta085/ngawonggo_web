import { Flex, Box, Text, Heading } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const VideoPromo = () => {
  return (
    <Box py={24} bg="neo.midnight" className="bg-dot-grid" position="relative" overflow="hidden" borderY="4px solid black">
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        position="relative"
        zIndex={2}
        px={{ base: 4, md: 8 }}
      >
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          mb={8}
          textAlign="center"
        >
          <Heading fontFamily="heading" color="neo.yellow" fontSize={{ base: "3xl", md: "5xl" }} fontWeight="900" textTransform="uppercase" letterSpacing="wide">
            Tonton Video Profil Desa
          </Heading>
          <Text fontFamily="accent" color="white" mt={2} letterSpacing="widest">
            SIARAN DARI NGAWONGGO
          </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          position="relative"
        >
          {/* Decorative Corners */}
          <Box position="absolute" top="-15px" left="-15px" w="30px" h="30px" bg="neo.coral" border="3px solid black" zIndex={2} />
          <Box position="absolute" top="-15px" right="-15px" w="30px" h="30px" bg="neo.teal" border="3px solid black" zIndex={2} borderRadius="full" />
          <Box position="absolute" bottom="-15px" left="-15px" w="30px" h="30px" bg="white" border="3px solid black" zIndex={2} clipPath="polygon(50% 0%, 0% 100%, 100% 100%)" />
          <Box position="absolute" bottom="-15px" right="-15px" w="30px" h="30px" bg="neo.yellow" border="3px solid black" zIndex={2} />

          <Box
            as="iframe"
            src="https://www.youtube.com/embed/Wc7lxuRx0LI"
            width={{ base: '100%', md: "700px", lg: '1000px' }}
            sx={{
              aspectRatio: '16/9',
              border: '4px solid #FFE156',
              boxShadow: '8px 8px 0px #000',
              borderRadius: 'xl',
              backgroundColor: 'black',
            }}
            allowFullScreen
          />
        </MotionBox>
      </Flex>
    </Box>
  );
};

export default VideoPromo;
