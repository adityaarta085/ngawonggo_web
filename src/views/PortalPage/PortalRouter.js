import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PortalPage from './index.js';
import TokoPage from './TokoPage/index.js';
import GachaPage from './GachaPage/index.js';
import LuckyWheelPage from './LuckyWheelPage.js';
import NotifikasiPage from './NotifikasiPage/index.js';

const PortalRouter = () => {
    return (
        <Routes>
            <Route index element={<PortalPage />} />
            <Route path="toko" element={<TokoPage />} />
            <Route path="toko/gacha" element={<GachaPage />} />
            <Route path="toko/lucky-wheel" element={<LuckyWheelPage />} />
            <Route path="notifikasi" element={<NotifikasiPage />} />
        </Routes>
    );
};

export default PortalRouter;
