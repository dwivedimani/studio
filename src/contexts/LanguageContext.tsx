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
  ar: 'العربية',
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
    const data = await response.json();
    if (typeof data !== 'object' || data === null) {
      console.error(`Translations for ${lang} are not a valid object:`, data);
      return {};
    }
    return data;
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
    // This effect runs only on the client side
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
        console.warn(`Translations for ${language} not found or empty, falling back to English.`);
        const englishTranslations = await fetchTranslations('en');
        if (Object.keys(englishTranslations).length) {
            primaryTranslations = englishTranslations;
        } else {
            console.error("Critical: English translations also failed to load or are empty.");
        }
      }
      
      if (active) {
        setTranslations(primaryTranslations);
        setIsLoading(false);
      }
    }

    loadAndSetTranslations();
    
    if (typeof document !== 'undefined') {
      if (language === 'ar') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
      document.documentElement.lang = language;
    }

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
        return key; 
    }

    if (params) {
      Object.keys(params).forEach(paramKey => {
        const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
        translation = translation.replace(regex, String(params[paramKey]));
      });
    }
    return translation;
  }, [translations, isLoading, language]);

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

