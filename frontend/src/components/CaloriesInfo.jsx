import { useTranslation } from "react-i18next";

const CaloriesInfo = () => {
  const { t } = useTranslation();

  const handleExternalLink = () => {
    window.open("https://www.diyetkolik.com/kac-kalori", "_blank");
  };

  return (
    <div className="calories-info-page">
      <div className="card">
        <div className="row page-header">
          <div className="title">{t("caloriesInfo")}</div>
          <button
            className="external-link-button compact"
            onClick={handleExternalLink}
          >
            {t("learnFoodCalories")}
          </button>
        </div>

        <div className="calories-content">
          <div className="calories-section-info">
            <h3>{t("whatIsCalorie")}</h3>
            <p>{t("calorieDefinition")}</p>
          </div>

          <div className="calories-section-info">
            <h3>{t("calorieDeficit")}</h3>
            <p>{t("calorieDeficitDefinition")}</p>
          </div>

          <div className="calories-section-info">
            <h3>{t("howManyCalories")}</h3>
            <p>{t("howManyCaloriesDefinition")}</p>
          </div>

          <div className="calories-section-info">
            <h3>{t("healthyTips")}</h3>
            <ul className="tips-list">
              <li>{t("tip1")}</li>
              <li>{t("tip2")}</li>
              <li>{t("tip3")}</li>
              <li>{t("tip4")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CaloriesInfo;
