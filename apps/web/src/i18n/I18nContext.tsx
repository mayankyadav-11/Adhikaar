"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LocaleCode, DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./config";
import enMessages from "./locales/en.json";

interface I18nContextType {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (key: string) => string;
  supportedLocales: typeof SUPPORTED_LOCALES;
}

const I18nContext = createContext<I18nContextType>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: (key: string) => key,
  supportedLocales: SUPPORTED_LOCALES,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);

  useEffect(() => {
    const saved = localStorage.getItem("adhikaar-locale") as LocaleCode;
    if (saved && SUPPORTED_LOCALES.some((l) => l.code === saved)) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    localStorage.setItem("adhikaar-locale", newLocale);
  };

  /**
   * Safe nested key lookup (e.g. t("common.appName")) with fallback to key
   */
  const t = (key: string): string => {
    const segments = key.split(".");
    let current: unknown = enMessages;

    for (const segment of segments) {
      if (current && typeof current === "object" && segment in current) {
        current = (current as Record<string, unknown>)[segment];
      } else {
        return key;
      }
    }

    return typeof current === "string" ? current : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, supportedLocales: SUPPORTED_LOCALES }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
