import React from 'react';
import { render } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { MonetizationProvider } from './contexts/MonetizationContext';
import { NetworkProvider } from './contexts/NetworkContext';
import { HelmetProvider } from 'react-helmet-async';

const AllProviders = ({ children }) => (
  <HelmetProvider>
    <ChakraProvider theme={theme}>
      <LanguageProvider>
        <MonetizationProvider>
        <NetworkProvider>
        <BrowserRouter>{children}</BrowserRouter>
        </NetworkProvider>
      </MonetizationProvider>
      </LanguageProvider>
    </ChakraProvider>
  </HelmetProvider>
);

const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options });

export { customRender as render };
