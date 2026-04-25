import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Button, Text, VStack, Spinner, Center, HStack, Heading } from '@chakra-ui/react';
import { GoogleMap, StreetViewPanorama, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { getRandomLocationInBounds, mapData } from './data';

const MAX_ROUNDS = 5;

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
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);

  const [guess, setGuess] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [distance, setDistance] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [targetLocation, setTargetLocation] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const svService = useRef(null);

  const findValidPanorama = useCallback((bounds, attempts = 0) => {
    if (!svService.current) {
        svService.current = new window.google.maps.StreetViewService();
    }

    if (attempts > 20) {
        // Fallback to center if can't find one
        setTargetLocation(mapData[mapId].center);
        setLoadingLoc(false);
        return;
    }

    const randomLoc = getRandomLocationInBounds(bounds);
    const radius = mapId === 'jateng' ? 10000 : 5000;

    svService.current.getPanorama({ location: randomLoc, radius, preference: window.google.maps.StreetViewPreference.NEAREST }, (data, status) => {
        if (status === 'OK') {
            setTargetLocation({ lat: data.location.latLng.lat(), lng: data.location.latLng.lng() });
            setLoadingLoc(false);
        } else {
            findValidPanorama(bounds, attempts + 1);
        }
    });
  }, [mapId]);

  useEffect(() => {
    // Only search if maps API is loaded. Handled by child component mounting or LoadScript onLoad.
  }, [round, mapId]);

  const handleMapsLoaded = useCallback(() => {
    setLoadingLoc(true);
    setGuess(null);
    setShowResult(false);
    findValidPanorama(mapData[mapId].bounds);
  }, [mapId, findValidPanorama]);


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
    const maxDist = mapData[mapId].maxDistance;
    let s = Math.max(0, Math.floor(5000 * (1 - (dist / maxDist))));
    if (dist < (maxDist * 0.05)) s = 5000; // Perfect score

    setRoundScore(s);
    setTotalScore(prev => prev + s);
    setShowResult(true);
  };

  const nextRound = () => {
    if (round >= MAX_ROUNDS) {
        onFinishGame({ score: totalScore, maxScore: MAX_ROUNDS * 5000, message: "Game Selesai! Skor Total: " + totalScore });
    } else {
        setRound(r => r + 1);
        handleMapsLoaded(); // Find next loc
    }
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
    <Box w="full" h="full" position="relative" bg="gray.900">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''} onLoad={handleMapsLoaded}>
        {loadingLoc ? (
            <Center h="full" w="full" position="absolute" zIndex={20} bg="rgba(0,0,0,0.8)" color="white" flexDir="column">
                <Spinner size="xl" color="teal.500" mb={4} />
                <Text>Mencari lokasi panorama...</Text>
            </Center>
        ) : null}

        {/* HUD */}
        <HStack position="absolute" top={4} left={4} zIndex={10} bg="rgba(0,0,0,0.6)" color="white" p={3} borderRadius="md" spacing={6}>
            <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.400">Round</Text>
                <Heading size="md">{round} / {MAX_ROUNDS}</Heading>
            </VStack>
            <VStack align="start" spacing={0}>
                <Text fontSize="xs" color="gray.400">Total Score</Text>
                <Heading size="md" color="teal.300">{totalScore}</Heading>
            </VStack>
        </HStack>

        {/* Street View Background */}
        <Box w="full" h="full" position="absolute" top={0} left={0} zIndex={1}>
          {targetLocation && (
              <GoogleMap mapContainerStyle={{width: '100%', height: '100%'}} center={targetLocation} zoom={14}>
                <StreetViewPanorama options={streetViewOptions} visible={true} />
              </GoogleMap>
          )}
        </Box>

        {/* Mini Map Overlay */}
        {targetLocation && (
            <Box
                position="absolute"
                bottom={{base: 4, md: 8}}
                right={{base: 4, md: 8}}
                zIndex={10}
                bg="rgba(0,0,0,0.5)"
                p={2}
                borderRadius="md"
                transition="all 0.3s"
                _hover={!showResult ? { transform: {md: 'scale(1.5)'}, transformOrigin: 'bottom right' } : {}}
            >
            <GoogleMap
                mapContainerStyle={{
                    width: showResult ? (window.innerWidth < 768 ? '300px' : '600px') : '250px',
                    height: showResult ? (window.innerWidth < 768 ? '250px' : '400px') : '200px',
                    borderRadius: '8px',
                    border: '2px solid white'
                }}
                center={showResult ? center : (guess || center)}
                zoom={showResult ? (mapId === 'jateng' ? 7 : 10) : 11}
                onClick={handleMapClick}
                options={mapOptions}
            >
                {guess && <Marker position={guess} />}
                {showResult && <Marker position={targetLocation} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }} />}
                {showResult && guess && <Polyline path={[guess, targetLocation]} options={{ strokeColor: '#FF0000', strokeWeight: 2 }} />}
            </GoogleMap>

            {!showResult ? (
                <Button mt={2} w="full" colorScheme="teal" onClick={handleGuess} isDisabled={!guess || loadingLoc}>Tebak Lokasi</Button>
            ) : (
                <VStack mt={2} bg="gray.800" p={4} borderRadius="md" color="white">
                    <Text>Jarak: {distance.toFixed(2)} km</Text>
                    <Text fontSize="2xl" fontWeight="bold" color="teal.300">Skor: +{roundScore}</Text>
                    <Button colorScheme="blue" onClick={nextRound} w="full">
                        {round >= MAX_ROUNDS ? 'Lihat Hasil Akhir' : 'Lanjut Ronde Berikutnya'}
                    </Button>
                </VStack>
            )}
            </Box>
        )}
      </LoadScript>
    </Box>
  );
};

export default GameScreen;
