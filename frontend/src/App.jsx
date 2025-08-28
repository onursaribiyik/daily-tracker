import { useEffect, useState, useRef } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { emptyDay, getTotalCaloriesFromMeals, isoToday } from "./utils/helpers";

import {
  getDays,
  upsertDay,
  setAuthToken,
  getUserProfile,
} from "./services/api";

import Tabs from "./components/Tabs";
import Recipes from "./components/Recipes";
import DayView from "./components/DayView";
import AuthForm from "./components/AuthForm";
import UserProfile from "./components/UserProfile";
import CaloriesInfo from "./components/CaloriesInfo";
import LanguageSwitcher from "./components/LanguageSwitcher";

const MainApp = () => {
  const { t } = useTranslation();
  const authCheckRef = useRef(false);

  const [itemsPerPage] = useState(10);
  const [days, setDays] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [todayId, setTodayId] = useState(isoToday());
  const [expandedDays, setExpandedDays] = useState({});

  const today = days.find((d) => d.id === todayId);
  const location = useLocation();

  useEffect(() => {
    const checkStoredAuth = async () => {
      if (authCheckRef.current) {
        return;
      }

      authCheckRef.current = true;

      const authToken = localStorage.getItem("authToken");

      if (authToken) {
        setAuthToken(authToken);
        try {
          const userProfile = await getUserProfile();
          if (userProfile) {
            setUser(userProfile);
            localStorage.setItem("currentUser", JSON.stringify(userProfile));
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    checkStoredAuth();
  }, []);

  useEffect(() => {
    const checkDate = () => {
      const newTodayId = isoToday();
      if (newTodayId !== todayId) {
        setTodayId(newTodayId);
      }
    };

    checkDate();

    const interval = setInterval(checkDate, 60000);

    return () => clearInterval(interval);
  }, [todayId]);

  useEffect(() => {
    if (user) {
      bootstrap();
    }
  }, [user, todayId]);

  const bootstrap = async () => {
    try {
      const all = await getDays();
      const allDays = Array.isArray(all) ? all : [];

      if (!allDays.find((d) => d.id === todayId)) {
        const newDay = emptyDay(todayId);
        const createdDay = await upsertDay(newDay);
        allDays.push(createdDay);
      }
      allDays.sort((a, b) => b.id.localeCompare(a.id));
      setDays(allDays);
    } catch (error) {
      console.error("Error loading days:", error);
      setDays([]);
    }
  };

  const setDayInList = (updated) => {
    setDays((prev) => {
      const existingIndex = prev.findIndex((d) => d.id === updated.id);
      if (existingIndex >= 0) {
        const newDays = [...prev];
        newDays[existingIndex] = updated;
        return newDays;
      } else {
        const newDays = [...prev, updated];
        return newDays.sort((a, b) => b.id.localeCompare(a.id));
      }
    });
  };

  const toggleDayExpansion = (dayId) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  const handleAuth = (authenticatedUser) => {
    setUser(authenticatedUser);
    localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setUser(null);
    setDays([]);
    authCheckRef.current = false;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">{t("loading", "Loading...")}</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <>
      <div className="row app-header">
        <div className="title">{t("appTitle")}</div>
        <div className="row app-controls">
          {location.pathname === "/user" && <LanguageSwitcher />}
          <div className="kv">
            <label>{t("welcome", { name: user.name })}</label>
            <span className="badge">{todayId}</span>
          </div>
        </div>
      </div>

      <Tabs />

      <Routes>
        <Route path="/" element={<Navigate to="/today" replace />} />

        <Route
          path="/today"
          element={
            today ? (
              <DayView
                key={today.id}
                day={today}
                onSave={async (d) => {
                  const updatedDay = await upsertDay(d);
                  setDayInList(updatedDay);
                }}
              />
            ) : (
              <div>Yükleniyor...</div>
            )
          }
        />

        <Route
          path="/allDay"
          element={
            <div className="all-days-container">
              {(() => {
                const totalItems = days.length;
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const currentDays = days.slice(startIndex, endIndex);

                return (
                  <>
                    <div className="pagination-info">
                      <span className="pagination-text">
                        {t("showing")} {startIndex + 1}-
                        {Math.min(endIndex, totalItems)} / {totalItems}{" "}
                        {t("days")}
                      </span>
                    </div>

                    <div className="row pagination-container">
                      {currentDays.map((day) => {
                        const isExpanded = expandedDays[day.id];
                        const dayTitle = new Date(
                          day.id + "T00:00:00"
                        ).toLocaleDateString("tr-TR");

                        return (
                          <div
                            key={day.id}
                            className={`card ${isExpanded ? "expanded" : ""}`}
                          >
                            <div
                              className="day-header"
                              onClick={() => toggleDayExpansion(day.id)}
                              style={{
                                cursor: "pointer",
                                padding: "12px",
                                borderBottom: isExpanded
                                  ? "1px solid #1f2937"
                                  : "none",
                              }}
                            >
                              <div className="row pagination-info">
                                <div className="row pagination-controls">
                                  <div className="title">{dayTitle}</div>
                                  <span className="calories-summary">
                                    🍖 {getTotalCaloriesFromMeals(day.meals)}{" "}
                                    kcal
                                  </span>
                                </div>
                                <div className="expand-icon">
                                  {isExpanded ? "▼" : "▶"}
                                </div>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="day-content">
                                <DayView
                                  day={day}
                                  compact
                                  readOnly={true}
                                  onSave={async (d) => {
                                    const updatedDay = await upsertDay(d);
                                    setDayInList(updatedDay);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {totalPages > 1 && (
                      <div className="pagination">
                        <button
                          className="pagination-btn"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                        >
                          ← {t("previous")}
                        </button>

                        <div className="pagination-numbers">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              className={`pagination-number ${
                                currentPage === page ? "active" : ""
                              }`}
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          className="pagination-btn"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                        >
                          {t("next")} →
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          }
        />

        <Route path="/calories" element={<CaloriesInfo />} />

        <Route path="/recipes" element={<Recipes />} />

        <Route
          path="/user"
          element={
            <UserProfile
              user={user}
              onUpdate={handleUserUpdate}
              onLogout={handleLogout}
            />
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};
export default App;
