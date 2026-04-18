import React, { useState, useEffect } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import CSLogin from './CSLogin';
import CSDashboard from './CSDashboard';

const CSApp = () => {
    const [csSession, setCsSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('csSession');
        if (stored) {
            setCsSession(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    if (loading) return null;

    return (
        <Routes>
            <Route path="login" element={<CSLogin setCsSession={setCsSession} />} />
            <Route path="*" element={csSession ? <CSDashboard csSession={csSession} setCsSession={setCsSession} /> : <Navigate to="/admin/cs/login" replace />} />
        </Routes>
    );
};

export default CSApp;
