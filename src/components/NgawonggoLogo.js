import React from 'react';
import { Flex, Icon, Text } from '@chakra-ui/react';

const MountainIcon = (props) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z"
    />
  </Icon>
);

const NgawonggoLogo = ({ color = "ngawonggo.green", fontSize = "xl", iconSize = 8, showText = true, flexDirection = "row" }) => {
  return (
    <Flex align="center" direction={flexDirection}>
      <MountainIcon boxSize={iconSize} color={color} />
      {showText && (
        <Text
          ml={flexDirection === "row" ? 2 : 0}
          mt={flexDirection === "column" ? 4 : 0}
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
