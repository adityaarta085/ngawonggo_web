const fs = require('fs');
const path = require('path');

const csDir = path.join(__dirname, 'src', 'views', 'AdminPage', 'cs');
const indexPath = path.join(csDir, 'index.js');

const indexCode = `import React, { useState, useEffect } from 'react';
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
`;
fs.writeFileSync(indexPath, indexCode, 'utf8');

const appPath = path.join(__dirname, 'src', 'App.js');
let appContent = fs.readFileSync(appPath, 'utf8');

// Add import
if (!appContent.includes("import CSApp from './views/AdminPage/cs';")) {
    appContent = appContent.replace(
        "import Login from './views/AdminPage/Login.js';",
        "import Login from './views/AdminPage/Login.js';\nimport CSApp from './views/AdminPage/cs';"
    );
}

// Add route
if (!appContent.includes('<Route path="/admin/cs/*" element={<CSApp />} />')) {
    appContent = appContent.replace(
        '<Route path="/admin/login" element={<Login setSession={setAdminSession} />} />',
        '<Route path="/admin/login" element={<Login setSession={setAdminSession} />} />\n              <Route path="/admin/cs/*" element={<CSApp />} />'
    );
}

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('App.js routed to CS Dashboard');
