import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import SpecialEventPoster from './SpecialEventPoster';
import { ChakraProvider } from '@chakra-ui/react';

// Mocking session storage
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

const renderWithChakra = (ui) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('SpecialEventPoster Date Logic', () => {
  const originalDate = Date;

  const mockDate = (year, month, day) => {
    global.Date = class extends originalDate {
      constructor() {
        super();
        return new originalDate(year, month, day);
      }
      static now() {
        return new originalDate(year, month, day).getTime();
      }
    };
  };

  afterEach(() => {
    global.Date = originalDate;
    mockSessionStorage.clear();
    cleanup();
  });

  test('should not show before March 19, 2026', () => {
    mockDate(2026, 2, 18); // March 18
    renderWithChakra(<SpecialEventPoster />);
    expect(screen.queryByAltText(/Idul Fitri 1447H/i)).not.toBeInTheDocument();
  });

  test('should show on March 19, 2026', () => {
    mockDate(2026, 2, 19);
    renderWithChakra(<SpecialEventPoster />);
    expect(screen.getByAltText(/Idul Fitri 1447H/i)).toBeInTheDocument();
  });

  test('should show on March 23, 2026', () => {
    mockDate(2026, 2, 23);
    renderWithChakra(<SpecialEventPoster />);
    expect(screen.getByAltText(/Idul Fitri 1447H/i)).toBeInTheDocument();
  });

  test('should not show after March 23, 2026', () => {
    mockDate(2026, 2, 24);
    renderWithChakra(<SpecialEventPoster />);
    expect(screen.queryByAltText(/Idul Fitri 1447H/i)).not.toBeInTheDocument();
  });

  test('should not show if already shown in session', () => {
    mockDate(2026, 2, 20);
    mockSessionStorage.setItem('eid_poster_shown', 'true');
    renderWithChakra(<SpecialEventPoster />);
    expect(screen.queryByAltText(/Idul Fitri 1447H/i)).not.toBeInTheDocument();
  });
});
