import { useTranslation } from "react-i18next";

export default function ActivitySection({
  items,
  onChange,
  waterIntake,
  onWaterChange,
  stepCount,
  onStepChange,
  readOnly = false,
}) {
  const { t } = useTranslation();

  return (
    <div className="card">
      <div className="title activity-title">
        {t("stepCount")} / {t("dailyWaterIntake")}
      </div>

      {/* Su Tüketimi Progress Bar */}
      <div className="water-section">
        <div className="water-header">
          <label className="water-label">{t("water")}</label>
          <span className="water-amount">{waterIntake || 0} ml / 3500 ml</span>
        </div>

        {/* Progress Bar */}
        <div className="water-progress-bar">
          <div
            className="water-progress-fill"
            style={{
              width: `${Math.min(((waterIntake || 0) / 3500) * 100, 100)}%`,
            }}
          ></div>
        </div>

        <div className="water-controls">
          {!readOnly ? (
            <>
              <input
                type="number"
                className="input water-input"
                value={waterIntake || 0}
                onChange={(e) => onWaterChange(e.target.value)}
                min="0"
                max="5000"
                step="250"
                placeholder="ml"
              />
              <span className="water-amount">ml</span>
            </>
          ) : (
            <span>{waterIntake || 0} ml</span>
          )}

          {waterIntake > 0 && (
            <span className="water-percentage">
              💧 {Math.round(((waterIntake || 0) / 3500) * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Adım Sayacı Progress Bar */}
      <div className="step-section">
        <div className="step-header">
          <label className="step-label">{t("stepsLabel")}</label>
          <span className="step-amount">
            {stepCount || 0} / 10000 {t("steps")}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="step-progress-bar">
          <div
            className="step-progress-fill"
            style={{
              width: `${Math.min(((stepCount || 0) / 10000) * 100, 100)}%`,
            }}
          ></div>
        </div>

        <div className="step-controls">
          {!readOnly ? (
            <>
              <input
                type="number"
                className="input step-input"
                value={stepCount || 0}
                onChange={(e) => onStepChange(e.target.value)}
                min="0"
                max="50000"
                step="100"
                placeholder={t("steps")}
              />
              <span className="step-amount">{t("steps")}</span>
            </>
          ) : (
            <span>
              {stepCount || 0} {t("steps")}
            </span>
          )}

          {stepCount > 0 && (
            <span className="step-percentage">
              🚶 {Math.round(((stepCount || 0) / 10000) * 100)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
