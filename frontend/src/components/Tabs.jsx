import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Tabs = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tabs = [
    { key: "today", label: t("today"), path: "/today", icon: "📅" },
    { key: "all", label: t("allDays"), path: "/allDay", icon: "📋" },
    { key: "calories", label: t("caloriesInfo"), path: "/calories", icon: "🔥" },
    { key: "recipes", label: t("recipes"), path: "/recipes", icon: "📖" },
    { key: "user", label: t("user"), path: "/user", icon: "👤" },
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const tab = tabs.find((t) => t.path === currentPath);
    return tab ? tab.key : "today";
  };

  const handleTabClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const activeTab = tabs.find((t) => t.key === getActiveTab());

  return (
    <div className="hamburger-menu-wrapper">
      <button 
        className="hamburger-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
       
        <span className="current-tab-label">
          <span className="current-tab-icon">{activeTab?.icon}</span>
          <span className="current-tab-text">{activeTab?.label}</span>
        </span>
         <span className="hamburger-icon">
          {isMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </span>
      </button>
      
      {isMenuOpen && (
        <>
          <div className="menu-overlay" onClick={() => setIsMenuOpen(false)} />
          <div className="hamburger-dropdown-menu">
            {tabs.map((t) => (
              <div
                key={t.key}
                className={"menu-item " + (getActiveTab() === t.key ? "active" : "")}
                onClick={() => handleTabClick(t.path)}
                role="button"
              >
                <span className="menu-item-icon">{t.icon}</span>
                <span className="menu-item-label">{t.label}</span>
                {getActiveTab() === t.key && (
                  <span className="active-indicator">✓</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
export default Tabs;
