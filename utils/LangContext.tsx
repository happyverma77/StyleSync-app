// context/LangContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { translations, TranslationValue } from "../utils/translations";

const LANGUAGE_KEY = "APP_LANGUAGE";

const localeMap: Record<string, string> = {
  "zh-Hant": "zh-Hant",
  "zh-HK": "zh-Hant",
  "zh-TW": "zh-Hant",
  "pt-BR": "pt",
  "en-US": "en",
  "en-GB": "en",
  "es-ES": "es",
  "fr-FR": "fr",
  "de-DE": "de",
};

type LangContextType = {
  lang: string;
  t: (key: string) => string;
  switchLanguage: (lang: string) => Promise<void>;
};

const LangContext = createContext<LangContextType | undefined>(undefined);

const getNestedTranslation = (obj: TranslationValue, key: string): string => {
  return key.split(".").reduce((acc: any, part: string) => {
    return acc?.[part] ?? key.split(".")[key.split(".").length - 1];
  }, obj) as string;
};

export const LangProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<string>("en");

  useEffect(() => {
    (async () => {
      const storedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
      const deviceLang = Localization.locale;
      const fallback =
        localeMap[deviceLang] || deviceLang.split("-")[0] || "en";
      setLang(storedLang || fallback);
    })();
  }, []);

  const t = (key: string): string => {
    const langObj = translations[lang];
    return getNestedTranslation(langObj, key);
  };

  const switchLanguage = async (newLang: string) => {
    if (translations[newLang]) {
      await AsyncStorage.setItem(LANGUAGE_KEY, newLang);
      setLang(newLang);
    }
  };

  return (
    <LangContext.Provider value={{ lang, t, switchLanguage }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = (): LangContextType => {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used within a LangProvider");
  return context;
};
