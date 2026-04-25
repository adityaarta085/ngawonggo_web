import React, { useState, useEffect } from 'react';
import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { GoogleMap, StreetViewPanorama, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { getRandomLocation, mapData } from './data';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const mapContainerStyle = {
  width: '320px',
  height: '240px',
  borderRadius: '8px',
  border: '2px solid white'
};

// Calculate distance between two coordinates in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const GameScreen = ({ mapId, difficulty, onFinishGame }) => {
  const [guess, setGuess] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [distance, setDistance] = useState(0);
  const [score, setScore] = useState(0);
  const [targetLocation, setTargetLocation] = useState(null);

  useEffect(() => {
    setTargetLocation(getRandomLocation(mapId));
  }, [mapId]);

  if (!targetLocation) return null;

  const handleMapClick = (e) => {
    if (!showResult) {
      setGuess({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const handleGuess = () => {
    if (!guess) return;
    const dist = getDistanceFromLatLonInKm(targetLocation.lat, targetLocation.lng, guess.lat, guess.lng);
    setDistance(dist);

    // Max 5000 per round. Adjust tolerance based on map.
    const maxDist = mapId === 'jateng' ? 500 : mapId === 'magelang' ? 50 : 5;
    let s = Math.max(0, Math.floor(5000 * (1 - (dist / maxDist))));
    if (dist < (maxDist * 0.05)) s = 5000; // Perfect score

    setScore(s);
    setShowResult(true);
  };

  const nextRound = () => {
    // End game after 1 round for now (Free trial logic or simple mode)
    onFinishGame({ score, maxScore: 5000, message: "Game Finished! You scored " + score + " points." });
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const streetViewOptions = {
    position: targetLocation,
    pov: { heading: 100, pitch: 0 },
    zoom: 1,
    disableDefaultUI: true,
    addressControl: false,
    showRoadLabels: false,
    clickToGo: difficulty === 'easy',
    disableDoubleClickZoom: difficulty !== 'easy',
    panControl: difficulty !== 'hardcore',
    zoomControl: difficulty !== 'hardcore',
    scrollwheel: difficulty !== 'hardcore',
    linksControl: difficulty === 'easy'
  };

  const center = mapData[mapId]?.center || mapData['ngawonggo'].center;

  return (
    <Box w="full" h="full" position="relative">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
        {/* Street View Background */}
        <Box w="full" h="full" position="absolute" top={0} left={0} zIndex={1}>
          <GoogleMap mapContainerStyle={containerStyle} center={targetLocation} zoom={14}>
            <StreetViewPanorama options={streetViewOptions} visible={true} />
          </GoogleMap>
        </Box>

        {/* Mini Map Overlay */}
        <Box position="absolute" bottom={8} right={8} zIndex={10} bg="rgba(0,0,0,0.5)" p={2} borderRadius="md" _hover={{ transform: showResult ? 'none' : 'scale(1.5)', transformOrigin: 'bottom right', transition: '0.3s' }}>
          <GoogleMap
            mapContainerStyle={showResult ? {width: '600px', height: '400px'} : mapContainerStyle}
            center={center}
            zoom={showResult ? 10 : 12}
            onClick={handleMapClick}
            options={mapOptions}
          >
            {guess && <Marker position={guess} />}
            {showResult && <Marker position={targetLocation} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }} />}
            {showResult && guess && <Polyline path={[guess, targetLocation]} options={{ strokeColor: '#FF0000', strokeWeight: 2 }} />}
          </GoogleMap>

          {!showResult ? (
            <Button mt={2} w="full" colorScheme="teal" onClick={handleGuess} isDisabled={!guess}>Tebak</Button>
          ) : (
            <VStack mt={2} bg="gray.800" p={4} borderRadius="md" color="white">
                <Text>Jarak: {distance.toFixed(2)} km</Text>
                <Text fontSize="2xl" fontWeight="bold">Skor: {score}</Text>
                <Button colorScheme="blue" onClick={nextRound} w="full">Selesai</Button>
            </VStack>
          )}
        </Box>
      </LoadScript>
    </Box>
  );
};

export default GameScreen;
