
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Define available languages and their display names
export const availableLanguages = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  hi: 'हिन्दी',
} as const;

export type LanguageCode = keyof typeof availableLanguages;

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: Record<string, string>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

async function fetchTranslations(lang: LanguageCode): Promise<Record<string, string>> {
  try {
    const response = await fetch(`/locales/${lang}.json`);
    if (!response.ok) {
      console.error(`Failed to load translations for ${lang}: ${response.statusText}`);
      return {};
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    return {};
  }
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedLang = localStorage.getItem('appLanguage') as LanguageCode | null;
    let initialLang: LanguageCode = 'en';
    if (storedLang && availableLanguages[storedLang]) {
      initialLang = storedLang;
    } else {
      const browserLang = navigator.language.split(/[-_]/)[0] as LanguageCode;
      if (availableLanguages[browserLang]) {
        initialLang = browserLang;
      }
    }
    setLanguageState(initialLang);
  }, []);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    async function loadAndSetTranslations() {
      let primaryTranslations = await fetchTranslations(language);
      if (!Object.keys(primaryTranslations).length && language !== 'en') {
        // Fallback to English if primary language file is empty/failed and it's not English
        console.warn(`Translations for ${language} not found or empty, falling back to English.`);
        primaryTranslations = await fetchTranslations('en');
      }
      
      if (active) {
        setTranslations(primaryTranslations);
        setIsLoading(false);
      }
    }

    loadAndSetTranslations();
    
    return () => {
      active = false;
    };
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    if (availableLanguages[lang]) {
      setLanguageState(lang);
      localStorage.setItem('appLanguage', lang);
    }
  };

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    if (isLoading && !Object.keys(translations).length) return '...'; 
    
    let translation = translations[key];
    
    if (translation === undefined) {
        // console.warn(`Translation key "${key}" not found for language "${language}".`);
        return key; // Fallback to key if not found
    }

    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    return translation;
  }, [translations, isLoading, language]);

  // Removed the problematic `if (isLoading && ... ) return null;` block.
  // The app will now render children, and the `t` function will handle displaying "..." or keys
  // during loading or if translations are missing.

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations, isLoading }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

