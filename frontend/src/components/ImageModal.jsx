import { useState } from "react";
import { useTranslation } from "react-i18next";

const ImageModal = ({ isOpen, onClose, photos = [], onAddPhoto, onDeletePhoto, readOnly = false }) => {
  const { t } = useTranslation();
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCalories, setNewPhotoCalories] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  if (!isOpen) return null;

  // Compress image to reduce file size
  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with compression
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const compressedImage = await compressImage(file);
      setPreviewUrl(compressedImage);
      setNewPhotoUrl(compressedImage);
    }
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) return;

    const photo = {
      id: Date.now().toString(),
      url: newPhotoUrl,
      calories: parseInt(newPhotoCalories) || 0,
      timestamp: new Date().toISOString(),
    };

    onAddPhoto(photo);
    setNewPhotoUrl("");
    setNewPhotoCalories("");
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleDelete = (photoId) => {
    if (window.confirm(t("confirmDeletePhoto"))) {
      onDeletePhoto(photoId);
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const compressedImage = await compressImage(file);
        setPreviewUrl(compressedImage);
        setNewPhotoUrl(compressedImage);
        setSelectedFile(file);
      }
    };
    input.click();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("mealPhotos")}</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Existing Photos */}
          {photos.length > 0 && (
            <div className="photos-grid">
              {photos.map((photo) => (
                <div key={photo.id} className="photo-card">
                  <img src={photo.url} alt="Meal" className="photo-image" />
                  <div className="photo-info">
                    <span className="photo-calories">{photo.calories} kcal</span>
                    {!readOnly && (
                      <button
                        className="photo-delete-btn"
                        onClick={() => handleDelete(photo.id)}
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {photos.length === 0 && (
            <div className="no-photos">
              <p>{t("noPhotosYet")}</p>
            </div>
          )}

          {/* Add New Photo Section */}
          {!readOnly && (
            <div className="add-photo-section">
              <h3>{t("addNewPhoto")}</h3>

              {previewUrl && (
                <div className="photo-preview">
                  <img src={previewUrl} alt="Preview" />
                </div>
              )}

              <div className="photo-actions">
                <button className="button secondary" onClick={handleCameraCapture}>
                  📷 {t("takePhoto")}
                </button>
                <label className="button secondary">
                  📁 {t("chooseFile")}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                </label>
              </div>

              <div className="photo-form">
                <div className="form-group">
                  <label>{t("caloriesAmount")}</label>
                  <input
                    type="number"
                    value={newPhotoCalories}
                    onChange={(e) => setNewPhotoCalories(e.target.value)}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <button
                  className="button"
                  onClick={handleAddPhoto}
                  disabled={!newPhotoUrl}
                >
                  {t("addPhoto")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
