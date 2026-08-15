import React from 'react';
import { render, screen, waitFor } from '../../../test-utils';
import BMKGSection from './BMKGSection';
import axios from 'axios';

jest.mock('axios');

describe('BMKGSection Caching', () => {
  const mockWeatherData = {
    data: {
      data: [
        {
          cuaca: [
            [
              {
                t: '25',
                hu: '80',
                ws: '10',
                weather_desc: 'Clear Skies',
                weather_desc_en: 'Clear Skies'
              }
            ]
          ]
        }
      ]
    }
  };

  const mockEqData = {
    data: {
      Infogempa: {
        gempa: {
          Magnitude: '5.0',
          Wilayah: 'Test Region',
          Tanggal: '01 Jan 2024',
          Jam: '12:00:00 WIB',
          Potensi: 'Tidak berpotensi tsunami',
          Kedalaman: '10 km',
          Coordinates: '0, 0'
        }
      }
    }
  };

  const CACHE_KEY = 'bmkg_data_cache';

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('should fetch and cache data when localStorage is empty', async () => {
    axios.get.mockResolvedValueOnce(mockWeatherData)
             .mockResolvedValueOnce(mockEqData);

    render(<BMKGSection />);

    await waitFor(() => {
      expect(screen.getByText('25°')).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem(CACHE_KEY)).not.toBeNull();

    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    expect(cachedData.weatherData.temp).toBe('25');
  });

  test('should use cached data when it is still valid (within TTL)', async () => {
    const validCache = {
      weatherData: {
        temp: '22',
        hu: '70',
        ws: '5',
        desc: 'Cloudy',
        descText: 'Cloudy'
      },
      eqData: mockEqData.data.Infogempa.gempa,
      timestamp: Date.now() - 5 * 60 * 1000 // 5 minutes ago
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(validCache));

    render(<BMKGSection />);

    await waitFor(() => {
      expect(screen.getByText('22°')).toBeInTheDocument();
    });

    // axios.get should NOT be called
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('should fetch new data when cache is expired', async () => {
    const expiredCache = {
      weatherData: {
        temp: '20',
        hu: '60',
        ws: '2',
        desc: 'Rain',
        descText: 'Rain'
      },
      eqData: mockEqData.data.Infogempa.gempa,
      timestamp: Date.now() - 20 * 60 * 1000 // 20 minutes ago (TTL is 15)
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(expiredCache));

    axios.get.mockResolvedValueOnce(mockWeatherData)
             .mockResolvedValueOnce(mockEqData);

    render(<BMKGSection />);

    await waitFor(() => {
      expect(screen.getByText('25°')).toBeInTheDocument();
    });

    // axios.get should be called because cache was expired
    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});
