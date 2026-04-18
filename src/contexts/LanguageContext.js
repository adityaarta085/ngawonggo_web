import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return a fallback if provider is missing (useful for tests or early crashes)
    return { language: 'id', setLanguage: () => {}, toggleLanguage: () => {} };
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('language') || 'id';
    } catch (e) {
      return 'id';
    }
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (e) {}
  };

  const toggleLanguage = () => {
    const next = language === 'id' ? 'en' : 'id';
    changeLanguage(next);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
