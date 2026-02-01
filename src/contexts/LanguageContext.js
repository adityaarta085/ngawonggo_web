
import React, { createContext, useState, useContext } from 'react';
import LanguageSwitchSplash from '../components/LanguageSwitchSplash';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(localStorage.getItem('language') || 'id');
  const [isSwitching, setIsSwitching] = useState(false);

  const setLanguage = (newLang) => {
    if (newLang === language) return;

    setIsSwitching(true);
    setTimeout(() => {
      setLanguageState(newLang);
      localStorage.setItem('language', newLang);
      setTimeout(() => {
        setIsSwitching(false);
      }, 1000);
    }, 1500);
  };

  const toggleLanguage = () => {
    const langs = ['id', 'en', 'jv'];
    const currentIndex = langs.indexOf(language);
    const nextIndex = (currentIndex + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      <LanguageSwitchSplash isVisible={isSwitching} language={language} />
      {children}
    </LanguageContext.Provider>
  );
};
