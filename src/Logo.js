import React from 'react';
import { Box, keyframes } from '@mui/material';
import logo from './logo.svg';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Logo = (props) => {
  return (
    <Box
      component="img"
      src={logo}
      sx={{
        animation: `${spin} infinite 20s linear`,
        pointerEvents: 'none',
        ...props.sx
      }}
      alt="logo"
    />
  );
};
