import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './theme';
import { HelmetProvider } from 'react-helmet-async';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { MonetizationProvider } from './contexts/MonetizationContext';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <LanguageProvider>
            <BrowserRouter>
              <AuthProvider>
                <MonetizationProvider>
                  <App />
                </MonetizationProvider>
              </AuthProvider>
            </BrowserRouter>
          </LanguageProvider>
        </ChakraProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
reportWebVitals();
