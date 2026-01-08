import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const currentLang = i18n.language;

  return (
    <div className="language-switcher-modern">
      <button
        className={`lang-option ${currentLang === "tr" ? "active" : ""}`}
        onClick={() => changeLanguage("tr")}
      >
        <span className="flag">🇹🇷</span>
        <span className="lang-text">Türkçe</span>
        {currentLang === "tr" && <span className="check-icon">✓</span>}
      </button>
      <button
        className={`lang-option ${currentLang === "en" ? "active" : ""}`}
        onClick={() => changeLanguage("en")}
      >
        <span className="flag">🇬🇧</span>
        <span className="lang-text">English</span>
        {currentLang === "en" && <span className="check-icon">✓</span>}
      </button>
    </div>
  );
};
export default LanguageSwitcher;
