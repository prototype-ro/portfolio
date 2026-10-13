"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  dict,
  LANGUAGES,
  type DictKey,
  type Lang,
  type Localized,
} from "@/data/i18n";

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (key: DictKey) => string;
  pick: (value: Localized) => string;
};

const STORAGE_KEY = "portfolio.lang";

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLang(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (LANGUAGES as string[]).includes(stored)) {
      return stored as Lang;
    }
  } catch {
    // localStorage can throw in private mode — ignore and use default.
  }
  return "pt";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    setLangState(readStoredLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore persistence failures
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const toggle = useCallback(
    () => setLangState((cur) => (cur === "pt" ? "en" : "pt")),
    [],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      toggle,
      t: (key) => dict[lang][key] ?? dict.pt[key] ?? key,
      pick: (localized) => localized[lang],
    }),
    [lang, setLang, toggle],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
