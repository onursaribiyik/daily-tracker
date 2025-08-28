import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Tabs = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { key: "today", label: t("today"), path: "/today" },
    { key: "all", label: t("allDays"), path: "/allDay" },
    { key: "calories", label: t("caloriesInfo"), path: "/calories" },
    { key: "recipes", label: t("recipes"), path: "/recipes" },
    { key: "user", label: t("user"), path: "/user" },
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const tab = tabs.find((t) => t.path === currentPath);
    return tab ? tab.key : "today";
  };

  return (
    <div className="tabbar">
      {tabs.map((t) => (
        <div
          key={t.key}
          className={"tab " + (getActiveTab() === t.key ? "active" : "")}
          onClick={() => navigate(t.path)}
          role="button"
        >
          {t.label}
        </div>
      ))}
    </div>
  );
};
export default Tabs;
