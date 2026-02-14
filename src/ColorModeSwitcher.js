import React from 'react';
import { useColorScheme, IconButton } from '@mui/material';
import { Brightness4 as MoonIcon, Brightness7 as SunIcon } from '@mui/icons-material';

export const ColorModeSwitcher = (props) => {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  return (
    <IconButton
      size="medium"
      aria-label="Toggle dark mode"
      color="inherit"
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light');
      }}
      {...props}
    >
      {mode === 'light' ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  );
};
