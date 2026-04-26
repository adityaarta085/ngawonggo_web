import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DonasiList from './DonasiList';
import DonasiDetail from './DonasiDetail';
import PageNotFound from '../PageNotFound'; // Ensure this matches existing file or use standard 404

const DonasiRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DonasiList />} />
      <Route path="/:id" element={<DonasiDetail />} />
      <Route path="/:id/:trx_id" element={<DonasiDetail />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default DonasiRouter;
