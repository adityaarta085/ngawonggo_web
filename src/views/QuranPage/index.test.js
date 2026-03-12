import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { HelmetProvider } from 'react-helmet-async';
import QuranPage from './index';

// Even more primitive mock
jest.mock('../../lib/supabase', () => {
  return {
    supabase: {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              single: () => Promise.resolve({ data: null })
            }),
            single: () => Promise.resolve({ data: null })
          }),
          single: () => Promise.resolve({ data: null })
        }),
        upsert: () => Promise.resolve({ data: null })
      }),
    },
  };
});

test('renders Al-Quran heading', async () => {
  render(
    <HelmetProvider>
      <ChakraProvider>
        <BrowserRouter>
          <QuranPage />
        </BrowserRouter>
      </ChakraProvider>
    </HelmetProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(/Al-Qur'anul Karim/i)).toBeInTheDocument();
  });
});
