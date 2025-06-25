// utils/translations.ts
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import hi from "../locales/hi.json";
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

export interface TranslationValue {
  [key: string]: string | TranslationValue;
}

export const translations: Record<string, TranslationValue> = {
  en,
  fr,
  hi,
  de,
  ja,
  ko,
  es,
  it,
  pt,
  ru,
  zh,
  "zh-Hant": zhHant,
  el,
  he,
  sv,
};
