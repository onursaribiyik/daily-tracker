import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateUser } from "../api";

export default function UserProfile({ user, onUpdate, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: user.name,
    surname: user.surname,
    gender: user.gender,
    weight: user.weight,
    height: user.height,
    age: user.age,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("USERPROFİLE");

    if (
      !formData.name ||
      !formData.surname ||
      !formData.gender ||
      !formData.weight ||
      !formData.height ||
      !formData.age
    ) {
      alert(t("fillAllFields"));
      setIsLoading(false);
      return;
    }

    try {
      const updatedUser = {
        ...user,
        name: formData.name,
        surname: formData.surname,
        gender: formData.gender,
        weight: parseInt(formData.weight),
        height: parseInt(formData.height),
        age: parseInt(formData.age),
      };

      // Backend'de güncelle
      const updated = await updateUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updated.user));

      onUpdate(updated.user);
      setIsEditing(false);
    } catch (error) {
      console.error("Update error:", error);
      alert(t("authError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateBMI = () => {
    const heightInMeters = user.height / 100;
    return (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMIStatus = (bmi) => {
    if (bmi < 18.5) return t("underweight");
    if (bmi < 25) return t("normal");
    if (bmi < 30) return t("overweight");
    return t("obese");
  };

  const getGenderDisplay = (gender) => {
    if (gender === "male") return t("male");
    if (gender === "female") return t("female");
    return gender; // fallback için eski değeri dön
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <h2>{t("userProfile")}</h2>
        <div className="profile-actions">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="edit-button">
              {t("edit")}
            </button>
          )}
          <button onClick={onLogout} className="logout-button">
            {t("logout")}
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>{t("name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("surname")}</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("gender")}</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">{t("selectGender")}</option>
              <option value="male">{t("male")}</option>
              <option value="female">{t("female")}</option>
            </select>
          </div>

          <div className="form-group">
            <label>{t("weight")}</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("height")}</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("age")}</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-button" disabled={isLoading}>
              {isLoading ? t("saving") : t("save")}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cancel-button"
              disabled={isLoading}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="info-card">
            <h3>{t("personalInfo")}</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>{t("fullName")}</label>
                <span>
                  {user.name} {user.surname}
                </span>
              </div>
              <div className="info-item">
                <label>{t("username")}:</label>
                <span>{user.username}</span>
              </div>
              <div className="info-item">
                <label>{t("gender")}:</label>
                <span>{getGenderDisplay(user.gender)}</span>
              </div>
              <div className="info-item">
                <label>{t("age")}:</label>
                <span>{user.age}</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h3>{t("physicalInfo")}</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>{t("weight")}:</label>
                <span>{user.weight} kg</span>
              </div>
              <div className="info-item">
                <label>{t("height")}:</label>
                <span>{user.height} cm</span>
              </div>
              <div className="info-item">
                <label>{t("bmi")}:</label>
                <span>
                  {calculateBMI()} ({getBMIStatus(calculateBMI())})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
