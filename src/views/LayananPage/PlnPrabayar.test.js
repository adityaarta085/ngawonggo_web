import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../test-utils';
import PlnPrabayar from './PlnPrabayar';

test('renders PLN Prabayar page and handles nominal selection', () => {
  render(<PlnPrabayar />);

  // Check if header is present
  expect(screen.getByText(/PLN Prabayar/i)).toBeInTheDocument();

  // Check if customer ID is present
  expect(screen.getByText(/1401 2345 6789/i)).toBeInTheDocument();

  // Check if initial total is correct (50k + 2500 admin)
  expect(screen.getByText(/Rp 52.500/i)).toBeInTheDocument();

  // Select 100k
  const button100k = screen.getByText(/100rb/i);
  fireEvent.click(button100k);

  // Check if total updated to 102.500
  expect(screen.getByText(/Rp 102.500/i)).toBeInTheDocument();
});
