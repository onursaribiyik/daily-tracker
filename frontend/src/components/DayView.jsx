import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FoodColumn from "./FoodColumn";
import ActivitySection from "./ActivitySection";
import ImageModal from "./ImageModal";
import { addMealPhoto, deleteMealPhoto } from "../services/api";

function getTotalCaloriesFromMeals(meals, mealPhotos) {
  let total = 0;
  Object.values(meals).forEach((arr) => {
    (arr || []).forEach((txt) => {
      const kcalMatch = txt.match(/(\d+)\s*kcal/i);
      if (kcalMatch) total += parseInt(kcalMatch[1], 10);
    });
  });
  // Fotoğraflardan gelen kalorileri ekle
  if (mealPhotos) {
    Object.values(mealPhotos).forEach((photos) => {
      (photos || []).forEach((photo) => {
        total += parseInt(photo.calories) || 0;
      });
    });
  }
  return total;
}

function getMealCalories(mealItems, mealPhotos) {
  let total = 0;
  (mealItems || []).forEach((txt) => {
    const kcalMatch = txt.match(/(\d+)\s*kcal/i);
    if (kcalMatch) total += parseInt(kcalMatch[1], 10);
  });
  // Fotoğraflardan gelen kalorileri ekle
  (mealPhotos || []).forEach((photo) => {
    total += parseInt(photo.calories) || 0;
  });
  return total;
}

const DayView = ({ day, onSave, compact = false, readOnly = false }) => {
  const { t } = useTranslation();
  const [data, setData] = useState(day);
  const [saving, setSaving] = useState(false);
  const [openMeal, setOpenMeal] = useState(null);
  const [selectedMealForPhotos, setSelectedMealForPhotos] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const title = new Date(data.id + "T00:00:00").toLocaleDateString("tr-TR");
  const mealCaloriesFromMeals = getTotalCaloriesFromMeals(data.meals, data.mealPhotos);
  const showSaveButton = !compact && !readOnly;
  const mealTitles = {
    sabah: `🌅 ${t("breakfast")} (${getMealCalories(data.meals?.sabah, data.mealPhotos?.sabah)} kcal)`,
    araOgun1: `🍎 ${t("snack")} 1 (${getMealCalories(
      data.meals?.araOgun1, data.mealPhotos?.araOgun1
    )} kcal)`,
    oglen: `🌞 ${t("lunch")} (${getMealCalories(data.meals?.oglen, data.mealPhotos?.oglen)} kcal)`,
    araOgun2: `🍪 ${t("snack")} 2 (${getMealCalories(
      data.meals?.araOgun2, data.mealPhotos?.araOgun2
    )} kcal)`,
    aksam: `🌙 ${t("dinner")} (${getMealCalories(data.meals?.aksam, data.mealPhotos?.aksam)} kcal)`,
  };

  useEffect(() => setData(day), [day]);

  const setMeal = (key, items) => {
    setData((prev) => ({ ...prev, meals: { ...prev.meals, [key]: items } }));
  };

  const setActivities = (items) => {
    setData((prev) => ({ ...prev, activities: items }));
  };

  const setWaterIntake = (amount) => {
    setData((prev) => ({ ...prev, waterIntake: parseInt(amount) || 0 }));
  };

  const setStepCount = (count) => {
    setData((prev) => ({ ...prev, stepCount: parseInt(count) || 0 }));
  };

  const toggleMeal = (mealKey) => {
    setOpenMeal(openMeal === mealKey ? null : mealKey);
  };

  const save = async () => {
    setSaving(true);
    await onSave(data);
    setSaving(false);
  };

  const openPhotoModal = (mealKey) => {
    setSelectedMealForPhotos(mealKey);
    setIsPhotoModalOpen(true);
  };

  const closePhotoModal = () => {
    setIsPhotoModalOpen(false);
    setSelectedMealForPhotos(null);
  };

  const handleAddPhoto = async (photo) => {
    try {
      const updatedDay = await addMealPhoto(data.id, selectedMealForPhotos, photo);
      setData(updatedDay);
      // App.jsx'teki days state'ini güncelle
      await onSave(updatedDay);
    } catch (error) {
      console.error("Error adding photo:", error);
      alert(t("errorAddingPhoto"));
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      const updatedDay = await deleteMealPhoto(data.id, selectedMealForPhotos, photoId);
      setData(updatedDay);
      // App.jsx'teki days state'ini güncelle
      await onSave(updatedDay);
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert(t("errorDeletingPhoto"));
    }
  };

  const getMealPhotos = (mealKey) => {
    return data.mealPhotos?.[mealKey] || [];
  };

  const getMealPhotoCount = (mealKey) => {
    const photos = getMealPhotos(mealKey);
    return photos.length;
  };

  if (compact) {
    return (
      <div>
        <div className="subtitle">{t("meals")}</div>
        <div className="compact-meals">
          {Object.entries(mealTitles).map(([key, title]) => (
            <div key={key} className="card meal-card">
              <div
                onClick={() => toggleMeal(key)}
                className="compact-meal-header"
              >
                <span className="meal-title">{title}</span>
                <div className="meal-header-actions">
                  <button
                    className="photo-icon-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPhotoModal(key);
                    }}
                  >
                    📷 {getMealPhotoCount(key) > 0 && `(${getMealPhotoCount(key)})`}
                  </button>
                  <span className="meal-arrow">
                    {openMeal === key ? "▼" : "▶"}
                  </span>
                </div>
              </div>
              {openMeal === key && (
                <div className="meal-content">
                  <FoodColumn
                    title=""
                    items={data.meals[key] || []}
                    onChange={(items) => setMeal(key, items)}
                    readOnly={readOnly}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="spacing-small" />

        <ActivitySection
          items={data.activities || []}
          onChange={setActivities}
          waterIntake={data.waterIntake}
          onWaterChange={setWaterIntake}
          stepCount={data.stepCount}
          onStepChange={setStepCount}
          readOnly={readOnly}
        />

        <div className="spacing-small" />

        {isPhotoModalOpen && (
          <ImageModal
            isOpen={isPhotoModalOpen}
            onClose={closePhotoModal}
            photos={getMealPhotos(selectedMealForPhotos)}
            onAddPhoto={handleAddPhoto}
            onDeletePhoto={handleDeletePhoto}
            readOnly={readOnly}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="row header-content">
          <div>
            <div className="title">{title}</div>
            <div className="subtitle">
              {t("totalCalories")}: {mealCaloriesFromMeals} kcal
            </div>
          </div>
          {showSaveButton && (
            <button className="button" onClick={save} disabled={saving}>
              {saving ? t("saving") : `💾 ${t("save")}`}
            </button>
          )}
        </div>
      </div>

      <div className="meals-accordion">
        {Object.entries(mealTitles).map(([key, title]) => (
          <div key={key} className="card meal-card">
            <div onClick={() => toggleMeal(key)} className="meal-header">
              <span className="meal-title">{title}</span>
              <div className="meal-header-actions">
                <button
                  className="photo-icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openPhotoModal(key);
                  }}
                >
                  📷 {getMealPhotoCount(key) > 0 && `(${getMealPhotoCount(key)})`}
                </button>
                <span className="meal-arrow">{openMeal === key ? "▼" : "▶"}</span>
              </div>
            </div>
            {openMeal === key && (
              <div className="meal-content">
                <FoodColumn
                  title=""
                  items={data.meals[key] || []}
                  onChange={(items) => setMeal(key, items)}
                  readOnly={readOnly}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <ActivitySection
        items={data.activities || []}
        onChange={setActivities}
        waterIntake={data.waterIntake}
        onWaterChange={setWaterIntake}
        stepCount={data.stepCount}
        onStepChange={setStepCount}
        readOnly={readOnly}
      />

      {isPhotoModalOpen && (
        <ImageModal
          isOpen={isPhotoModalOpen}
          onClose={closePhotoModal}
          photos={getMealPhotos(selectedMealForPhotos)}
          onAddPhoto={handleAddPhoto}
          onDeletePhoto={handleDeletePhoto}
          readOnly={readOnly}
        />
      )}
    </div>
  );
};
export default DayView;
