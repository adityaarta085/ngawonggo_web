import { Flex, Box } from '@chakra-ui/react';

const VideoPromo = () => {
  return (
    <Flex
      flexDirection="column"
      fontFamily="heading"
      alignItems="center"
      justifyContent="center"
      m={{ base: 10, md: 20 }}
    >
      <Box
        layerStyle="glassCard"
        p={4}
      >
        <Box
          as="iframe"
          src="https://www.youtube.com/embed/Wc7lxuRx0LI"
          width={{ base: '100%', md: "700px", lg: '1000px' }}
          sx={{
            aspectRatio: '16/9',
            borderRadius: 'xl',
            boxShadow: '2xl',
          }}
          allowFullScreen
        />
      </Box>
    </Flex>
  );
};

export default VideoPromo;
