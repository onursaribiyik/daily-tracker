import { useTranslation } from "react-i18next";

const WeightHistoryModal = ({ isOpen, onClose, weightHistory = [] }) => {
  const { t } = useTranslation();

  console.log("WeightHistoryModal - weightHistory:", weightHistory);

  if (!isOpen) return null;

  // Fallback - eğer weightHistory undefined veya null ise boş array kullan
  const safeWeightHistory = Array.isArray(weightHistory) ? weightHistory : [];

  // Son kayıttan ilk kayda doğru sırala (en yeni en üstte)
  const sortedHistory = [...safeWeightHistory].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateWeightChange = (index) => {
    if (index === sortedHistory.length - 1) return null; // İlk kayıt
    const current = sortedHistory[index].weight;
    const previous = sortedHistory[index + 1].weight;
    const change = current - previous;
    return change;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content weight-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚖️ {t("weightHistory")}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {sortedHistory.length === 0 ? (
            <div className="no-history">
              <p>{t("noWeightHistory")}</p>
            </div>
          ) : (
            <div className="weight-history-list">
              {sortedHistory.map((entry, index) => {
                const weightChange = calculateWeightChange(index);
                return (
                  <div key={entry._id || index} className="weight-history-item">
                    <div className="weight-history-main">
                      <span className="weight-value">{entry.weight} kg</span>
                      <span className="weight-date">{formatDate(entry.date)}</span>
                    </div>
                    {weightChange !== null && (
                      <div className={`weight-change ${weightChange > 0 ? 'positive' : weightChange < 0 ? 'negative' : 'neutral'}`}>
                        {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeightHistoryModal;
