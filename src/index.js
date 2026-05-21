import { HelmetProvider } from "react-helmet-async";
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme';
import { LanguageProvider } from './contexts/LanguageContext';
import { MonetizationProvider } from './contexts/MonetizationContext';
import { NetworkProvider } from './contexts/NetworkContext';
import { ThemePreferenceProvider } from './contexts/ThemePreferenceContext';
import ErrorBoundary from './components/ErrorBoundary';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <StrictMode>
    <ColorModeScript initialColorMode={theme.config?.initialColorMode} />
    <ErrorBoundary>
      <HelmetProvider>
        <ChakraProvider theme={theme}>
          <LanguageProvider>
            <MonetizationProvider>
            <NetworkProvider>
            <ThemePreferenceProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
            </ThemePreferenceProvider>
            </NetworkProvider>
            </MonetizationProvider>
          </LanguageProvider>
        </ChakraProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);

// PWA Update handling
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

serviceWorker.register();
reportWebVitals();
