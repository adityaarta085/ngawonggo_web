import { Flex, Text, Box } from '@chakra-ui/react';

const VideoPromo = () => {
  return (
    <Flex
      flexDirection="column"
      fontFamily="heading"
      alignItems="center"
      justifyContent="center"
      m={20}
      // minHeight="100vh"
    >
      <Box
        as="iframe"
        // src="https://www.youtube.com/embed/wI2vqXsjsIo"
        src="https://youtube.com/embed/nxGOfXS_qkM"
        width={{ base: '300px',md: "500px" ,lg: '900px' }}
        sx={{
          aspectRatio: '16/9',
        }}
      />
      <Text
        // paddingX="250px"
        m="30px" 
        textAlign={'center'}
        fontSize={{ base: 'sm', lg: 'lg' }}
      >
        Dalam keindahan dan keberagaman yang kami cintai, kami mempersembahkan
        "Video Daerah Kami" – jendela yang membawa Anda ke dalam pesona tiap
        sudut tanah ini.
      </Text>
    </Flex>
  );
};

export default VideoPromo;
