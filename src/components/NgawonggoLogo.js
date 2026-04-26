import React from 'react';
import { Flex, Image, Text, Box } from '@chakra-ui/react';

const NgawonggoLogo = ({ color = "accent.green", fontSize = "xl", iconSize = 8, showText = true, flexDirection = "row", bg = "brand.600" }) => {
  return (
    <Flex align="center" direction={flexDirection}>
      <Box
        p={flexDirection === "column" ? 4 : 2}
        borderRadius="2xl"
        boxShadow="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgImage="url('https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=2070&auto=format&fit=crop')"
        bgSize="cover"
        bgPosition="center"
        position="relative"
        overflow="hidden"
        borderColor="whiteAlpha.300"
        borderWidth="1px"
      >
        <Box
          position="absolute"
          top={0} left={0} right={0} bottom={0}
          bgGradient="linear(to-br, blackAlpha.700, blackAlpha.400)"
          backdropFilter="blur(3px)"
        />
        <Image
          src="/logo_desa.png"
          height={iconSize}
          width="auto"
          objectFit="contain"
          alt="Logo Desa Ngawonggo"
          position="relative"
          zIndex={1}
          style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.6))' }}
        />
      </Box>
      {showText && (
        <Text
          ml={flexDirection === "row" ? 3 : 0}
          mt={flexDirection === "column" ? 3 : 0}
          fontSize={fontSize}
          fontWeight="bold"
          fontFamily="heading"
          color={color}
          letterSpacing="tight"
        >
          Desa Ngawonggo
        </Text>
      )}
    </Flex>
  );
};

export default NgawonggoLogo;
