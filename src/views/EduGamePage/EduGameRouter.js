import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, useColorModeValue } from '@chakra-ui/react';
import GameList from './GameList';
import GameDetail from './GameDetail';
import Gameplay from './Gameplay';
import GameResult from './GameResult';
import GameDashboard from './GameDashboard';

const EduGameRouter = () => {
  const bg = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box minH="100vh" bg={bg}>
      <Routes>
        <Route path="/" element={<GameList />} />
        <Route path="/dashboard" element={<GameDashboard />} />
        <Route path="/:id" element={<GameDetail />} />
        <Route path="/play/:id" element={<Gameplay />} />
        <Route path="/result/:id" element={<GameResult />} />
        <Route path="*" element={<Navigate to="/game" replace />} />
      </Routes>
    </Box>
  );
};

export default EduGameRouter;
