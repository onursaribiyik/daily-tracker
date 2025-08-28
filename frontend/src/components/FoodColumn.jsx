import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const FoodColumn = ({ title, items, onChange, readOnly = false }) => {
  const { t } = useTranslation();

  const [input, setInput] = useState("");
  const [editText, setEditText] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const addTimerRef = useRef(null);
  const editTimerRef = useRef(null);

  const add = () => {
    const val = input.trim();
    if (!val) return;
    onChange([...(items || []), val]);
    setInput("");
  };

  const autoAdd = (value) => {
    const val = value.trim();
    if (!val) return;
    onChange([...(items || []), val]);
    setInput("");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (addTimerRef.current) {
      clearTimeout(addTimerRef.current);
    }

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

  const autoCommitEdit = (value) => {
    if (editIndex < 0) return;
    const next = items.slice();
    next[editIndex] = value.trim() || next[editIndex];
    onChange(next);
  };

  const handleEditChange = (e) => {
    const value = e.target.value;
    setEditText(value);

    if (editTimerRef.current) {
      clearTimeout(editTimerRef.current);
    }

    editTimerRef.current = setTimeout(() => {
      autoCommitEdit(value);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (addTimerRef.current) clearTimeout(addTimerRef.current);
      if (editTimerRef.current) clearTimeout(editTimerRef.current);
    };
  }, []);

  return (
    <div className="card">
      {title && <div className="meal-title">{title}</div>}

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
          const kcalMatch = txt.match(/(\d+)\s*kcal/i);
          const kcalValue = kcalMatch ? kcalMatch[1] : null;
          const displayText = kcalValue
            ? txt.replace(/(\s*-?\d+\s*kcal)/i, "").trim()
            : txt;
          return (
            <li key={idx}>
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

              {kcalValue && (
                <span className="food-kcal-badge">{kcalValue} kcal</span>
              )}

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

      {readOnly && (!items || items.length === 0) && (
        <div className="food-empty-message">{t("noFood")}</div>
      )}
    </div>
  );
};
export default FoodColumn;
