
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const Map3D = ({ center, color }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // Initialize only once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/liberty', // Free style from OpenFreeMap
      center: center || [110.1235, -7.4568], // Ngawonggo coords
      zoom: 16,
      pitch: 60, // 3D Tilt
      bearing: -17,
      antialias: true
    });

    map.current.on('load', () => {
      // Add 3D building layer
      map.current.addLayer({
        'id': '3d-buildings',
        'source': 'openmaptiles',
        'source-layer': 'building',
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate', ['linear'], ['zoom'],
            15, 0,
            15.05, ['get', 'render_height']
          ],
          'fill-extrusion-base': [
            'interpolate', ['linear'], ['zoom'],
            15, 0,
            15.05, ['get', 'render_min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      });

      // Add a marker for the center
      new maplibregl.Marker({ color: color || '#0056b3' })
        .setLngLat(center || [110.1235, -7.4568])
        .addTo(map.current);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, color]);

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
  );
};

export default Map3D;
