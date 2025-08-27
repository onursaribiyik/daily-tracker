import { useState } from "react";
import { useTranslation } from "react-i18next";
import { loginUser, registerUser, checkUsernameExists } from "../api";

export default function AuthForm({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    surname: "",
    gender: "",
    weight: "",
    height: "",
    age: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // Giriş yapmaya çalış
        const result = await loginUser(formData.username, formData.password);

        if (result.user) {
          localStorage.setItem("currentUser", JSON.stringify(result.user));
          onAuth(result.user);
        } else if (result.message) {
          alert(result.message);
        }
      } else {
        // Kayıt ol
        if (
          !formData.username ||
          !formData.password ||
          !formData.name ||
          !formData.surname ||
          !formData.gender ||
          !formData.weight ||
          !formData.height ||
          !formData.age
        ) {
          alert(t("fillAllFields"));
          return;
        }

        // Kullanıcı adı kontrolü backend'de yapılacak
        // const usernameExists = await checkUsernameExists(formData.username);
        // if (usernameExists) {
        //   alert(t("usernameExists"));
        //   return;
        // }

        // Yeni kullanıcı oluştur
        const newUser = {
          username: formData.username,
          password: formData.password,
          name: formData.name,
          surname: formData.surname,
          gender: formData.gender,
          weight: parseInt(formData.weight),
          height: parseInt(formData.height),
          age: parseInt(formData.age),
        };

        const createdUser = await registerUser(newUser);
        if (createdUser.user) {
          localStorage.setItem("currentUser", JSON.stringify(createdUser.user));
          onAuth(createdUser.user);
        } else if (createdUser.message) {
          alert(createdUser.message);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      let errorMessage = t("authError");

      // Backend'ten gelen hata mesajını göster
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
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

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? t("login") : t("register")}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("username")}</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("password")}</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
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

          {!isLogin && (
            <>
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
            </>
          )}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? t("saving") : isLogin ? t("login") : t("register")}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? t("noAccount") : t("hasAccount")}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="link-button"
          >
            {isLogin ? t("register") : t("login")}
          </button>
        </p>
      </div>
    </div>
  );
}
