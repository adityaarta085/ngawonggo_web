import React from 'react';
import { screen } from '@testing-library/react';
import { render } from './test-utils';
import App from './App';

test('renders site name', () => {
  render(<App />);
  const linkElements = screen.getAllByText(/Desa Ngawonggo/i);
  expect(linkElements.length).toBeGreaterThan(0);
});
