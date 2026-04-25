import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box } from '@chakra-ui/react';

const MiniMap = ({ isExpanded, center, zoom, onGuess, showResult, targetLocation, guess, otherPlayers }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const otherMarkers = useRef({});
  const resultMarker = useRef(null);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [center.lng, center.lat],
      zoom: zoom,
      attributionControl: false
    });

    map.current.on('click', (e) => {
      if (!showResult) {
        onGuess({ lat: e.lngLat.lat, lng: e.lngLat.lng });
      }
    });
  }, [center, zoom, showResult, onGuess]);

  // Update own guess marker
  useEffect(() => {
    if (!map.current) return;

    if (guess) {
      if (!marker.current) {
        marker.current = new maplibregl.Marker({ color: "#e53e3e" })
          .setLngLat([guess.lng, guess.lat])
          .addTo(map.current);
      } else {
        marker.current.setLngLat([guess.lng, guess.lat]);
      }
    }
  }, [guess]);

  // Update other players' markers (Multiplayer Realtime)
  useEffect(() => {
    if (!map.current || !otherPlayers) return;

    otherPlayers.forEach(p => {
      if (p.guess_lat && p.guess_lng) {
        if (!otherMarkers.current[p.user_id]) {
            // Create a small dot for others
            const el = document.createElement('div');
            el.className = 'other-player-marker';
            el.style.width = '12px';
            el.style.height = '12px';
            el.style.backgroundColor = '#3182ce';
            el.style.borderRadius = '50%';
            el.style.border = '2px solid white';

            otherMarkers.current[p.user_id] = new maplibregl.Marker({ element: el })
                .setLngLat([p.guess_lng, p.guess_lat])
                .addTo(map.current);
        } else {
            otherMarkers.current[p.user_id].setLngLat([p.guess_lng, p.guess_lat]);
        }
      }
    });
  }, [otherPlayers]);

  // Show result
  useEffect(() => {
    if (!map.current) return;

    if (showResult && targetLocation) {
        if (!resultMarker.current) {
            resultMarker.current = new maplibregl.Marker({ color: "#38a169" })
              .setLngLat([targetLocation.lng, targetLocation.lat])
              .addTo(map.current);
        }

        // Draw line
        if (guess) {
            if (map.current.getSource('route')) {
                map.current.getSource('route').setData({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: [[guess.lng, guess.lat], [targetLocation.lng, targetLocation.lat]]
                    }
                });
            } else {
                map.current.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: [[guess.lng, guess.lat], [targetLocation.lng, targetLocation.lat]]
                        }
                    }
                });
                map.current.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': '#e53e3e', 'line-width': 2, 'line-dasharray': [2, 2] }
                });
            }
        }

        // Fit bounds
        if (guess && targetLocation) {
            const bounds = new maplibregl.LngLatBounds()
                .extend([guess.lng, guess.lat])
                .extend([targetLocation.lng, targetLocation.lat]);
            map.current.fitBounds(bounds, { padding: 50 });
        }
    }
  }, [showResult, targetLocation, guess]);

  return (
    <Box
        ref={mapContainer}
        w={isExpanded ? {base: '300px', md: '600px'} : '250px'}
        h={isExpanded ? {base: '250px', md: '400px'} : '200px'}
        borderRadius="8px"
        border="2px solid white"
        overflow="hidden"
        transition="all 0.3s"
    />
  );
};

export default MiniMap;
