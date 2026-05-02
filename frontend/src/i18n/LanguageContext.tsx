import React, { createContext, useContext } from 'react';
import type { Language } from './translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export function LanguageProvider({ language, setLanguage, children }: React.PropsWithChildren<LanguageProviderProps>) {
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
