import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { dishCopy, DishCopy, DishId, Lang, StringKey, translations } from "./translations";
import { apiFetch } from "@/lib/api";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: StringKey) => string;
  dish: (id: DishId) => DishCopy;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "nha.lang.v2";
const isLang = (v: string | null): v is Lang =>
  v === "en" || v === "vi" || v === "pl" || v === "de";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "de";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) return stored;
    
    if (navigator.language) {
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      if (isLang(browserLang)) return browserLang;
    }
    
    return "de";
  });
  
  const [dbTranslations, setDbTranslations] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  useEffect(() => {
    const fetchTrans = async () => {
      const settings = await apiFetch("/settings");
      if (settings.site_translations) {
        setDbTranslations(settings.site_translations as Record<string, Record<string, string>>);
      }
    };
    fetchTrans();
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const baseDict = translations[lang] || translations.en;
    const dbDict = dbTranslations[lang] || {};
    const mergedDict = { ...baseDict, ...dbDict };
    
    const enDict = { ...translations.en, ...(dbTranslations.en || {}) };
    
    const dishDict = dishCopy[lang];
    return {
      lang,
      setLang: setLangState,
      t: (key) => mergedDict[key as string] ?? enDict[key as string] ?? key,
      dish: (id) => dishDict[id] ?? dishCopy.en[id],
    };
  }, [lang, dbTranslations]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useT = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useT must be used within a LanguageProvider");
  return ctx;
};
