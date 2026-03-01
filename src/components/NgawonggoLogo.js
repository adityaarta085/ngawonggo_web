import React from 'react';
import { Flex, Image, Text } from '@chakra-ui/react';

const NgawonggoLogo = ({ color = "ngawonggo.green", fontSize = "xl", iconSize = 8, showText = true, flexDirection = "row" }) => {
  return (
    <Flex align="center" direction={flexDirection}>
      <Image
        src="/logo_desa.png"
        boxSize={iconSize}
        objectFit="contain"
        alt="Logo Desa Ngawonggo"
      />
      {showText && (
        <Text
          ml={flexDirection === "row" ? 2 : 0}
          mt={flexDirection === "column" ? 2 : 0}
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
