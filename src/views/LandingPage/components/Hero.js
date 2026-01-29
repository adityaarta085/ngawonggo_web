import { Flex, Text, Box, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const Hero = () => {
  const bgImage =
    'https://images.unsplash.com/photo-1591189863430-ab87e120f312?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
  const badgeColorScheme = 'green';
  const badgeFontSize = '0.8em';

  return (
    <Flex
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPosition="center"
      height={{ base: '200px', md: '300px', lg: '800px' }}
      justifyContent="center"
      alignItems="center"
      mb="30px"
    >
      <Box
        flexDirection="column"
        boxSize={{ base: 'fit-content', md: 'fit-content', lg: 'max-content' }}
        textAlign="center"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            ease: 'easeInOut',
            duration: 2,
          }}
        >
          <Text
            fontSize={{ base: '30px', md: '70px', lg: '80px' }}
            fontFamily="heading"
            fontWeight="900"
            color="gray.50"
            mb={{ base: '10px', md: '20px' }}
            textShadow="2px 2px 4px rgba(0,0,0,0.4)"
          >
            NGAWONGGO: PESONA LERENG SUMBING
          </Text>
        </motion.div>

        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          ease: 'easeInOut',
          duration: 5,
        }}
        >

        <Text
          fontFamily="heading"
          color="gray.50"
          fontSize={{ base: 'sm', md: 'md', lg: 'xl' }}
          fontWeight="semibold"
          textShadow="1px 1px 2px rgba(0,0,0,0.4)"
        >
          "Mewujudkan Desa Ngawonggo yang
          <Badge
            variant="subtle"
            colorScheme={badgeColorScheme}
            fontSize={badgeFontSize}
            m={'0px 2px'}
          >
            Asri
          </Badge>
          ,
          <Badge
            variant="subtle"
            colorScheme={badgeColorScheme}
            fontSize={badgeFontSize}
            m={'0px 2px'}
          >
            Mandiri
          </Badge>
          , dan
          <Badge
            variant="subtle"
            colorScheme={badgeColorScheme}
            fontSize={badgeFontSize}
            m={'0px 2px'}
          >
            Berbudaya
          </Badge>
          Berbasis Potensi Pertanian dan Keindahan Alam."
        </Text>
        </motion.div>

      </Box>
    </Flex>
  );
};

export default Hero;
