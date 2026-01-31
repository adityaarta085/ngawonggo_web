import React from 'react';
import { render } from '@testing-library/react';
import { ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';

const AllProviders = ({ children }) => (
  <ChakraProvider theme={theme}>
    <LanguageProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </LanguageProvider>
  </ChakraProvider>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
