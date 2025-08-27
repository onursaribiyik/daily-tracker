import { useEffect, useState, useRef } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import Tabs from "./components/Tabs";
import DayView from "./components/DayView";
import AuthForm from "./components/AuthForm";
import UserProfile from "./components/UserProfile";
import CaloriesInfo from "./components/CaloriesInfo";
import Recipes from "./components/Recipes";
import LanguageSwitcher from "./components/LanguageSwitcher";
import {
  getDays,
  getDay,
  createDay,
  updateDay,
  upsertDay,
  setAuthToken,
  getUserProfile,
} from "./api";

function getTotalCaloriesFromMeals(meals) {
  let total = 0;
  if (!meals) return 0;
  Object.values(meals).forEach((arr) => {
    (arr || []).forEach((txt) => {
      const kcalMatch = txt.match(/(\d+)\s*kcal/i);
      if (kcalMatch) total += parseInt(kcalMatch[1], 10);
    });
  });
  return total;
}

function isoToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;
  return today;
}

const emptyDay = (id) => ({
  id,
  meals: {
    sabah: [],
    araOgun1: [],
    oglen: [],
    araOgun2: [],
    aksam: [],
  },
  activities: [],
  waterIntake: 0, // Günlük su içme miktarı (ml)
  stepCount: 0, // Günlük adım sayısı
  totalCalories: 0, // Günlük toplam kalori miktarı (kcal)
});

function MainApp() {
  const [days, setDays] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state eklendi
  const [todayId, setTodayId] = useState(isoToday());
  const [expandedDays, setExpandedDays] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const location = useLocation();
  const { t } = useTranslation();
  const authCheckRef = useRef(false); // Tekrarlı auth check'i önlemek için

  useEffect(() => {
    const checkStoredAuth = async () => {
      // Eğer auth check zaten yapıldıysa, tekrar yapma
      if (authCheckRef.current) {
        return;
      }

      authCheckRef.current = true;

      const authToken = localStorage.getItem("authToken");

      if (authToken) {
        setAuthToken(authToken);
        try {
          console.log("Auth check yapılıyor - getUserProfile çağrılıyor");
          // LocalStorage'tan değil, her zaman backend'den fresh data çek
          const userProfile = await getUserProfile();
          if (userProfile) {
            setUser(userProfile);
            // Fresh data ile localStorage'ı güncelle
            localStorage.setItem("currentUser", JSON.stringify(userProfile));
          } else {
            // Token geçersiz, temizle
            handleLogout();
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          handleLogout();
        }
      }
      setLoading(false); // Loading state burada false yapılıyor
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

    // İlk başta hemen kontrol et
    checkDate();

    // Her dakika kontrol et
    const interval = setInterval(checkDate, 60000);

    return () => clearInterval(interval);
  }, [todayId]);

  async function bootstrap() {
    try {
      console.log("Bootstrap called with todayId:", todayId);
      const all = await getDays();
      const allDays = Array.isArray(all) ? all : [];
      console.log("Loaded days:", allDays.length);

      if (!allDays.find((d) => d.id === todayId)) {
        console.log("Today's day not found, creating:", todayId);
        const newDay = emptyDay(todayId);
        console.log("New day object:", newDay);
        const createdDay = await upsertDay(newDay);
        console.log("Created day:", createdDay);
        allDays.push(createdDay);
      } else {
        console.log("Today's day already exists:", todayId);
      }
      allDays.sort((a, b) => b.id.localeCompare(a.id));
      setDays(allDays);
    } catch (error) {
      console.error("Error loading days:", error);
      setDays([]);
    }
  }
  useEffect(() => {
    if (user) {
      bootstrap();
    }
  }, [user, todayId]);

  const today = days.find((d) => d.id === todayId);

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
    authCheckRef.current = false; // Ref'i resetle
  };

  // Loading state gösterilirken hiçbir şey render edilmez
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
          <LanguageSwitcher />
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
                // Pagination hesaplamaları
                const totalItems = days.length;
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const currentDays = days.slice(startIndex, endIndex);

                return (
                  <>
                    {/* Pagination Info */}
                    <div className="pagination-info">
                      <span className="pagination-text">
                        {t("showing")} {startIndex + 1}-
                        {Math.min(endIndex, totalItems)} / {totalItems}{" "}
                        {t("days")}
                      </span>
                    </div>

                    {/* Days List */}
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
                            {/* Kart başlığı - her zaman görünür */}
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

                            {/* Detaylar - sadece açıkken görünür */}
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

                    {/* Pagination Controls */}
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

      <footer>{t("footer")}</footer>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}
