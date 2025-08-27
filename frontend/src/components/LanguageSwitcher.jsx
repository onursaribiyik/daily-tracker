import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${i18n.language === "tr" ? "active" : ""}`}
        onClick={() => changeLanguage("tr")}
      >
        TR
      </button>
      <button
        className={`lang-btn ${i18n.language === "en" ? "active" : ""}`}
        onClick={() => changeLanguage("en")}
      >
        EN
      </button>
    </div>
  );
}
