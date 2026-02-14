import React from 'react';
import { Box, Typography, SvgIcon } from '@mui/material';

const MountainIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z"
    />
  </SvgIcon>
);

const NgawonggoLogo = ({ color = "primary.main", fontSize = "1.25rem", iconSize = 32, showText = true, flexDirection = "row" }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection }}>
      <MountainIcon sx={{ fontSize: iconSize, color: color }} />
      {showText && (
        <Typography
          variant="h6"
          sx={{
            ml: flexDirection === "row" ? 1 : 0,
            mt: flexDirection === "column" ? 2 : 0,
            fontSize: fontSize,
            fontWeight: 700,
            color: color,
            letterSpacing: '-0.02em',
          }}
        >
          Desa Ngawonggo
        </Typography>
      )}
    </Box>
  );
};

export default NgawonggoLogo;
