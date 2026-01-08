import { useState } from "react";
import { useTranslation } from "react-i18next";
import { updateUser, changePassword } from "../services/api";
import LanguageSwitcher from "./LanguageSwitcher";

const UserProfile = ({ user, onUpdate, onLogout }) => {
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
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError(t("fillAllFields"));
      return;
    }
    
    if (passwordData.oldPassword === passwordData.newPassword) {
      setPasswordError(t("newPasswordSameAsOld"));
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(t("passwordsDoNotMatch"));
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError(t("passwordTooShort"));
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      alert(t("passwordChangedSuccess"));
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordError("");
      // Şifre değiştirilince logout yap
      setTimeout(() => {
        onLogout();
      }, 1000);
    } catch (error) {
      console.error("Change password error:", error);
      if (error.message.includes("Old password is incorrect")) {
        setPasswordError(t("oldPasswordIncorrect"));
      } else {
        setPasswordError(t("authError"));
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePasswordDataChange = (e) => {
    setPasswordError("");
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
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

          <div className="info-card language-card">
            <h3>{t("language")}</h3>
            <div className="language-switcher-container">
              <LanguageSwitcher />
            </div>
          </div>

          <div className="info-card password-card">
            <h3>{t("changePassword")}</h3>
            <form onSubmit={handlePasswordChange} className="password-form">
              {passwordError && (
                <div className="password-error-message">
                  {passwordError}
                </div>
              )}
              
              <div className="form-group">
                <label>{t("oldPassword")}</label>
                <div className="password-input-container">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordDataChange}
                    placeholder={t("enterOldPassword")}
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    disabled={isChangingPassword}
                  >
                    {showOldPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>{t("newPassword")}</label>
                <div className="password-input-container">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordDataChange}
                    placeholder={t("enterNewPassword")}
                    disabled={isChangingPassword}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={isChangingPassword}
                  >
                    {showNewPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>{t("confirmNewPassword")}</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordDataChange}
                    placeholder={t("confirmPasswordPlaceholder")}
                    disabled={isChangingPassword}
                    className={passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? "input-error" : ""}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isChangingPassword}
                  >
                    {showConfirmPassword ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <small className="password-mismatch-hint">{t("passwordsDoNotMatch")}</small>
                )}
              </div>
              
              <button 
                type="submit" 
                className="change-password-button"
                disabled={isChangingPassword || (passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword)}
              >
                {isChangingPassword ? (
                  <>
                    <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    {t("changing")}
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    {t("changePasswordButton")}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserProfile;
