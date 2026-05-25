import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ToolsPage from './index';
// specific tool components will be imported here later

const ToolsRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<ToolsPage />} />
      <Route path="/:category" element={<ToolsPage />} />
      <Route path="/tool/:id" element={<ToolsPage />} /> {/* Will map to individual tools later */}
    </Routes>
  );
};

export default ToolsRouter;
