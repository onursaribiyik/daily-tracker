import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export default function FoodColumn({
  title,
  items,
  onChange,
  readOnly = false,
}) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const [editText, setEditText] = useState("");

  // Otomatik kaydetme için timer referansları
  const addTimerRef = useRef(null);
  const editTimerRef = useRef(null);
  const add = () => {
    const val = input.trim();
    if (!val) return;
    onChange([...(items || []), val]);
    setInput("");
  };

  // Otomatik ekleme fonksiyonu
  const autoAdd = (value) => {
    const val = value.trim();
    if (!val) return;
    onChange([...(items || []), val]);
    setInput("");
  };

  // Input değiştiğinde otomatik kaydetme
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Önceki timer'ı temizle
    if (addTimerRef.current) {
      clearTimeout(addTimerRef.current);
    }

    // Yeni timer başlat - 1.5 saniye sonra kaydet
    if (value.trim()) {
      addTimerRef.current = setTimeout(() => {
        autoAdd(value);
      }, 1500);
    }
  };

  const del = (idx) => {
    const next = items.filter((_, i) => i !== idx);
    onChange(next);
  };

  const startEdit = (idx) => {
    setEditIndex(idx);
    setEditText(items[idx]);
  };

  const commitEdit = () => {
    if (editIndex < 0) return;
    const next = items.slice();
    next[editIndex] = editText.trim() || next[editIndex];
    onChange(next);
    setEditIndex(-1);
    setEditText("");
  };

  // Otomatik düzenleme kaydetme
  const autoCommitEdit = (value) => {
    if (editIndex < 0) return;
    const next = items.slice();
    next[editIndex] = value.trim() || next[editIndex];
    onChange(next);
  };

  // Düzenleme input'u değiştiğinde otomatik kaydetme
  const handleEditChange = (e) => {
    const value = e.target.value;
    setEditText(value);

    // Önceki timer'ı temizle
    if (editTimerRef.current) {
      clearTimeout(editTimerRef.current);
    }

    // Yeni timer başlat - 1.5 saniye sonra kaydet
    editTimerRef.current = setTimeout(() => {
      autoCommitEdit(value);
    }, 1500);
  };

  // Component unmount olduğunda timer'ları temizle
  useEffect(() => {
    return () => {
      if (addTimerRef.current) clearTimeout(addTimerRef.current);
      if (editTimerRef.current) clearTimeout(editTimerRef.current);
    };
  }, []);

  return (
    <div className="card">
      {title && <div className="meal-title">{title}</div>}

      {/* Sadece readOnly değilse input ve kaydet butonunu göster */}
      {!readOnly && (
        <>
          <div className="row">
            <input
              className="input"
              placeholder={t("addFood")}
              value={input}
              onChange={handleInputChange}
            />
            <button className="button" onClick={add}>
              {t("save")}
            </button>
          </div>
          <hr className="sep" />
        </>
      )}

      <ul className="list">
        {(items || []).map((txt, idx) => {
          // Kalori bilgisini ayıkla (ör: "20kcal" veya "20 kcal")
          const kcalMatch = txt.match(/(\d+)\s*kcal/i);
          const kcalValue = kcalMatch ? kcalMatch[1] : null;
          // Metinden kalori bilgisini sil
          const displayText = kcalValue
            ? txt.replace(/(\s*-?\d+\s*kcal)/i, "").trim()
            : txt;
          return (
            <li key={idx}>
              {/* ReadOnly modunda düzenleme yok */}
              {!readOnly && editIndex === idx ? (
                <input
                  className="input"
                  value={editText}
                  onChange={handleEditChange}
                />
              ) : (
                <span title={displayText} className="food-text-ellipsis">
                  {displayText}
                </span>
              )}

              {/* Sağda kalori badge'i */}
              {kcalValue && (
                <span className="food-kcal-badge">{kcalValue} kcal</span>
              )}

              {/* ReadOnly modunda butonları gösterme */}
              {!readOnly && (
                <div className="row activity-controls">
                  {editIndex === idx ? (
                    <button className="button" onClick={commitEdit}>
                      {t("save")}
                    </button>
                  ) : (
                    <button
                      className="button secondary"
                      onClick={() => startEdit(idx)}
                    >
                      {t("edit")}
                    </button>
                  )}
                  <button className="button ghost" onClick={() => del(idx)}>
                    {t("delete")}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* ReadOnly modunda liste boşsa mesaj göster */}
      {readOnly && (!items || items.length === 0) && (
        <div className="food-empty-message">{t("noFood")}</div>
      )}
    </div>
  );
}
