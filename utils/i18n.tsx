import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";

// Import translation files statically
import en from "../locales/en.json";
import hi from "../locales/hi.json";
import fr from "../locales/fr.json";
import de from "../locales/de.json";
import ja from "../locales/ja.json";
import ko from "../locales/ko.json";
import es from "../locales/es.json";
import it from "../locales/it.json";
import pt from "../locales/pt.json";
import ru from "../locales/ru.json";
import zh from "../locales/zh.json";
import zhHant from "../locales/zh-Hant.json";
import el from "../locales/el.json";
import he from "../locales/he.json";
import sv from "../locales/sv.json";

const LANGUAGE_KEY = "APP_LANGUAGE";

// Optional: Map full locale codes to your defined keys
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

const languageDetector = {
  type: "languageDetector" as const,
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const storedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (storedLang) {
        callback(storedLang);
      } else {
        const deviceLocale = Localization.locale;
        const mappedLang =
          localeMap[deviceLocale] || deviceLocale.split("-")[0] || "en";
        callback(mappedLang);
      }
    } catch (err) {
      console.log("Language detection error:", err);
      callback("en");
    }
  },
  init: () => {},
  cacheUserLanguage: (lang: string) => {
    AsyncStorage.setItem(LANGUAGE_KEY, lang).catch((e) =>
      console.log("Failed to save language:", e)
    );
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      fr: { translation: fr },
      de: { translation: de },
      ja: { translation: ja },
      ko: { translation: ko },
      es: { translation: es },
      it: { translation: it },
      pt: { translation: pt },
      ru: { translation: ru },
      zh: { translation: zh },
      "zh-Hant": { translation: zhHant },
      el: { translation: el },
      he: { translation: he },
      sv: { translation: sv },
    },
    interpolation: {
      escapeValue: false,
    },
    debug: __DEV__, // Only show debug logs in development
  });

export default i18n;
