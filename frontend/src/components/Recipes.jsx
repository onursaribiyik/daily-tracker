import { useTranslation } from "react-i18next";

const Recipes = () => {
  const { t } = useTranslation();

  const handleExternalLink = () => {
    window.open("https://www.nefisyemektarifleri.com/", "_blank");
  };

  return (
    <div className="recipes-page">
      <div className="card">
        <div className="row page-header">
          <div className="title">{t("recipes")}</div>
          <button
            className="external-link-button compact"
            onClick={handleExternalLink}
          >
            {t("discoverRecipes")}
          </button>
        </div>

        <div className="recipes-content">
          <div className="recipes-section-info">
            <h3>{t("healthyRecipes")}</h3>
            <p>{t("healthyRecipesDescription")}</p>
          </div>

          <div className="recipes-section-info">
            <h3>{t("cookingTips")}</h3>
            <p>{t("cookingTipsDescription")}</p>
          </div>

          <div className="recipes-section-info">
            <h3>{t("mealPlanning")}</h3>
            <p>{t("mealPlanningDescription")}</p>
          </div>

          <div className="recipes-section-info">
            <h3>{t("recipeTips")}</h3>
            <ul className="tips-list">
              <li>{t("recipeTip1")}</li>
              <li>{t("recipeTip2")}</li>
              <li>{t("recipeTip3")}</li>
              <li>{t("recipeTip4")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Recipes;
