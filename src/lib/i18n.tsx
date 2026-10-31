'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import bhoLocale from '../locales/bho.json';
import bnLocale from '../locales/bn.json';
import enLocale from '../locales/en.json';
import hiLocale from '../locales/hi.json';
import mrLocale from '../locales/mr.json';

export type SupportedLanguage = 'hi' | 'en' | 'mr' | 'bn' | 'bho';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN' },
  { code: 'en', name: 'English', nativeName: 'English', speechCode: 'en-IN' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN' },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', speechCode: 'hi-IN' },
];

const dictionaries: Record<SupportedLanguage, Record<string, unknown>> = {
  hi: hiLocale,
  en: enLocale,
  mr: mrLocale,
  bn: bnLocale,
  bho: bhoLocale,
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, defaultVal?: string) => string;
  speechCode: string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'hi',
  setLanguage: () => {},
  t: (key) => key,
  speechCode: 'hi-IN',
});

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('hi');

  useEffect(() => {
    // Read persisted language
    try {
      const saved = localStorage.getItem('aarogya_lang') as SupportedLanguage;
      if (saved && ['hi', 'en', 'mr', 'bn', 'bho'].includes(saved)) {
        queueMicrotask(() => {
          setLanguageState(saved);
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('aarogya_lang', lang);
      document.cookie = `aarogya_lang=${lang}; path=/; max-age=31536000`;
    } catch {
      // ignore in restricted contexts
    }
  };

  const t = (key: string, defaultVal?: string): string => {
    // 1. Try current language
    const currentDict = dictionaries[language];
    let val = getNestedValue(currentDict, key);
    if (val !== undefined) return val;

    // 2. Fall back to Hindi
    if (language !== 'hi') {
      val = getNestedValue(dictionaries.hi, key);
      if (val !== undefined) return val;
    }

    // 3. Fall back to English
    if (language !== 'en') {
      val = getNestedValue(dictionaries.en, key);
      if (val !== undefined) return val;
    }

    return defaultVal || key;
  };

  const meta = SUPPORTED_LANGUAGES.find((l) => l.code === language);
  const speechCode = meta?.speechCode || 'hi-IN';

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, speechCode }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
