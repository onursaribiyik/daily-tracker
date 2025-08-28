import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import tr from "./tr.json";

const resources = {
  tr: {
    translation: tr.translation,
  },
  en: {
    translation: en.translation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "tr", // Varsayılan dil
  fallbackLng: "tr",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
