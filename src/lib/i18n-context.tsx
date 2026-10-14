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
const COOKIE_KEY = "lang";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLang(): Lang | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (LANGUAGES as string[]).includes(stored)) return stored as Lang;
  } catch {
    // localStorage can throw in private mode — ignore.
  }
  return null;
}

function hasLangCookie(): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_KEY}=`));
}

function persistLang(lang: Lang): void {
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore persistence failures
  }
  // Cookie lets the server render the right language on the next request,
  // so returning visitors never see the PT→EN flash.
  try {
    document.cookie = `${COOKIE_KEY}=${lang}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
  } catch {
    // ignore
  }
}

export function I18nProvider({
  children,
  initialLang = "pt",
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  // One-time migration for visitors who picked a language before the cookie
  // existed (their choice lived only in localStorage).
  useEffect(() => {
    if (hasLangCookie()) return;
    const stored = readStoredLang();
    if (stored && stored !== initialLang) setLangState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    persistLang(lang);
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
