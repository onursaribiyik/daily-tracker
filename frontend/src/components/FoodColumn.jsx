import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const FoodColumn = ({ title, items, onChange, readOnly = false }) => {
  const { t } = useTranslation();

  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [editText, setEditText] = useState("");
  const [editCalories, setEditCalories] = useState("");
  const [editIndex, setEditIndex] = useState(-1);
  const addTimerRef = useRef(null);
  const editTimerRef = useRef(null);

  const add = () => {
    const name = foodName.trim();
    if (!name) return;
    
    const cal = calories.trim();
    const foodEntry = cal ? `${name} ${cal}kcal` : name;
    
    onChange([...(items || []), foodEntry]);
    setFoodName("");
    setCalories("");
  };

  const autoAdd = (name, cal) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    
    const trimmedCal = cal.trim();
    const foodEntry = trimmedCal ? `${trimmedName} ${trimmedCal}kcal` : trimmedName;
    
    onChange([...(items || []), foodEntry]);
    setFoodName("");
    setCalories("");
  };

  const handleFoodNameChange = (e) => {
    const value = e.target.value;
    setFoodName(value);

    if (addTimerRef.current) {
      clearTimeout(addTimerRef.current);
    }

    if (value.trim()) {
      addTimerRef.current = setTimeout(() => {
        autoAdd(value, calories);
      }, 1500);
    }
  };

  const handleCaloriesChange = (e) => {
    const value = e.target.value;
    setCalories(value);

    if (addTimerRef.current) {
      clearTimeout(addTimerRef.current);
    }

    if (foodName.trim()) {
      addTimerRef.current = setTimeout(() => {
        autoAdd(foodName, value);
      }, 1500);
    }
  };

  const del = (idx) => {
    const next = items.filter((_, i) => i !== idx);
    onChange(next);
  };

  const startEdit = (idx) => {
    setEditIndex(idx);
    const item = items[idx];
    const kcalMatch = item.match(/(\d+)\s*kcal/i);
    
    if (kcalMatch) {
      const kcalValue = kcalMatch[1];
      const name = item.replace(/(\s*-?\d+\s*kcal)/i, "").trim();
      setEditText(name);
      setEditCalories(kcalValue);
    } else {
      setEditText(item);
      setEditCalories("");
    }
  };

  const commitEdit = () => {
    if (editIndex < 0) return;
    const name = editText.trim();
    if (!name) return;
    
    const cal = editCalories.trim();
    const foodEntry = cal ? `${name} ${cal}kcal` : name;
    
    const next = items.slice();
    next[editIndex] = foodEntry;
    onChange(next);
    setEditIndex(-1);
    setEditText("");
    setEditCalories("");
  };

  const autoCommitEdit = (name, cal) => {
    if (editIndex < 0) return;
    const trimmedName = name.trim();
    if (!trimmedName) return;
    
    const trimmedCal = cal.trim();
    const foodEntry = trimmedCal ? `${trimmedName} ${trimmedCal}kcal` : trimmedName;
    
    const next = items.slice();
    next[editIndex] = foodEntry;
    onChange(next);
  };

  const handleEditNameChange = (e) => {
    const value = e.target.value;
    setEditText(value);

    if (editTimerRef.current) {
      clearTimeout(editTimerRef.current);
    }

    editTimerRef.current = setTimeout(() => {
      autoCommitEdit(value, editCalories);
    }, 1500);
  };

  const handleEditCaloriesChange = (e) => {
    const value = e.target.value;
    setEditCalories(value);

    if (editTimerRef.current) {
      clearTimeout(editTimerRef.current);
    }

    editTimerRef.current = setTimeout(() => {
      autoCommitEdit(editText, value);
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
              value={foodName}
              onChange={handleFoodNameChange}
              style={{ flex: 2 }}
            />
            <input
              className="input"
              placeholder={t("calories") || "Kalori"}
              value={calories}
              onChange={handleCaloriesChange}
              type="number"
              style={{ flex: 1 }}
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
                <div className="row" style={{ flex: 1 }}>
                  <input
                    className="input"
                    placeholder={t("addFood")}
                    value={editText}
                    onChange={handleEditNameChange}
                    style={{ flex: 2 }}
                  />
                  <input
                    className="input"
                    placeholder={t("calories") || "Kalori"}
                    value={editCalories}
                    onChange={handleEditCaloriesChange}
                    type="number"
                    style={{ flex: 1 }}
                  />
                </div>
              ) : (
                <span title={displayText} className="food-text-ellipsis">
                  {displayText}
                </span>
              )}

              {kcalValue && !readOnly && editIndex !== idx && (
                <span className="food-kcal-badge">{kcalValue} kcal</span>
              )}
              {kcalValue && readOnly && (
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
