import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useTranslation as useI18nTranslation } from 'react-i18next';

import ru from '../locales/ru.json';
import en from '../locales/en.json';

export enum Langs {
  en = 'en',
  ru = 'ru',
}

export const Languages = {
  [Langs.en]: 'English',
  [Langs.ru]: 'Русский',
};

const DEFAULT_LANG = Langs.ru;
const LS_KEY = 'lang';

export async function initI18n(): Promise<typeof i18n> {
  await i18n.use(initReactI18next).init({
    lng: localStorage.getItem(LS_KEY) || DEFAULT_LANG,
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    fallbackLng: DEFAULT_LANG,
    supportedLngs: Object.values(Langs),
    interpolation: {
      escapeValue: false,
    },
  });
  return i18n;
}

export function getCurrentLang(): Langs {
  return (i18n.resolvedLanguage as Langs) || Langs.ru;
}

export function setLang(lang: Langs): void {
  localStorage.setItem(LS_KEY, lang);
  i18n.changeLanguage(lang);
}

export function useTranslation() {
  return useI18nTranslation();
}

export { i18n };
