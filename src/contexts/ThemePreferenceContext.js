import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemePreferenceContext = createContext();

export const useThemePreference = () => {
    return useContext(ThemePreferenceContext);
};

export const ThemePreferenceProvider = ({ children }) => {
    const [landingTheme, setLandingTheme] = useState('vibrant'); // default

    useEffect(() => {
        try {
            const saved = localStorage.getItem('landingTheme');
            if (saved === 'minimalist' || saved === 'vibrant') {
                setLandingTheme(saved);
            }
        } catch (e) {
            console.error('Failed to read landingTheme from localStorage', e);
        }
    }, []);

    const updateTheme = (newTheme) => {
        setLandingTheme(newTheme);
        try {
            localStorage.setItem('landingTheme', newTheme);
        } catch (e) {
            console.error('Failed to save landingTheme to localStorage', e);
        }
    };

    return (
        <ThemePreferenceContext.Provider value={{ landingTheme, setLandingTheme: updateTheme }}>
            {children}
        </ThemePreferenceContext.Provider>
    );
};
