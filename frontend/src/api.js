// Production'da backend kullan, development'ta demo mode
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const IS_DEMO_MODE = !import.meta.env.VITE_API_URL && API_URL.includes("localhost");

console.log("API URL:", API_URL);
console.log("Demo Mode:", IS_DEMO_MODE);

// Demo kullanıcı verisi
const DEMO_USER = {
  id: "demo-user",
  name: "Demo",
  surname: "Kullanıcı",
  email: "demo@example.com",
  gender: "Erkek",
  weight: 70,
  height: 175,
  age: 25,
};

// Demo günlük verisi oluşturucu
const createDemoDay = (id) => ({
  id,
  userId: "demo-user",
  meals: {
    sabah: ["Ekmek 150 kcal", "Peynir 100 kcal"],
    araOgun1: ["Elma 50 kcal"],
    oglen: ["Pilav 200 kcal", "Tavuk 150 kcal"],
    araOgun2: ["Çay 5 kcal"],
    aksam: ["Makarna 250 kcal", "Salata 30 kcal"],
  },
  activities: ["30 dakika yürüyüş"],
  waterIntake: 8,
  stepCount: 5000,
  totalCalories: 935,
});

// Authentication token management
let authToken = localStorage.getItem("authToken");

export function setAuthToken(token) {
  authToken = token;
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
}

export function getAuthToken() {
  return authToken;
}

// Helper function to add auth headers
function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  return headers;
}

export async function getDays() {
  if (IS_DEMO_MODE) {
    // Demo mode: localStorage'dan günleri al
    const storedDays = localStorage.getItem("demo-days");
    if (storedDays) {
      return JSON.parse(storedDays);
    }

    // İlk kez açılıyorsa demo günler oluştur
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const demoDays = [createDemoDay(today), createDemoDay(yesterday)];
    localStorage.setItem("demo-days", JSON.stringify(demoDays));
    return demoDays;
  }

  const r = await fetch(`${API_URL}/days?_t=${Date.now()}`, {
    headers: getAuthHeaders(),
  });

  if (!r.ok) {
    const errorData = await r.json();
    throw new Error(errorData.message || "Get days failed");
  }

  return r.json();
}

export async function getDay(id) {
  if (IS_DEMO_MODE) {
    const storedDays = localStorage.getItem("demo-days");
    if (storedDays) {
      const days = JSON.parse(storedDays);
      return days.find((day) => day.id === id) || null;
    }
    return null;
  }

  try {
    const r = await fetch(`${API_URL}/days/${id}`, {
      headers: getAuthHeaders(),
    });
    if (r.status === 404) return null;

    if (!r.ok) {
      const errorData = await r.json();
      throw new Error(errorData.message || "Get day failed");
    }

    return r.json();
  } catch (error) {
    if (error.message.includes("404")) {
      return null;
    }
    throw error;
  }
}

export async function createDay(day) {
  if (IS_DEMO_MODE) {
    // Demo mode: localStorage'a gün ekle
    const storedDays = JSON.parse(localStorage.getItem("demo-days") || "[]");
    const newDay = { ...day, userId: "demo-user" };
    storedDays.push(newDay);
    localStorage.setItem("demo-days", JSON.stringify(storedDays));
    return newDay;
  }

  const r = await fetch(`${API_URL}/days`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(day),
  });

  if (!r.ok) {
    const errorData = await r.json();
    throw new Error(errorData.message || "Create day failed");
  }

  return r.json();
}

export async function updateDay(id, day) {
  if (IS_DEMO_MODE) {
    // Demo mode: localStorage'da güncelle
    const storedDays = JSON.parse(localStorage.getItem("demo-days") || "[]");
    const index = storedDays.findIndex((d) => d.id === id);
    if (index !== -1) {
      storedDays[index] = { ...day, userId: "demo-user" };
      localStorage.setItem("demo-days", JSON.stringify(storedDays));
      return storedDays[index];
    }
    return day;
  }

  const r = await fetch(`${API_URL}/days/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(day),
  });

  if (!r.ok) {
    const errorData = await r.json();
    throw new Error(errorData.message || "Update day failed");
  }

  return r.json();
}

// Upsert helper: create if not exists, otherwise update
export async function upsertDay(day) {
  try {
    const existing = await getDay(day.id);
    if (!existing) {
      console.log("Day doesn't exist, creating:", day.id);
      return createDay(day);
    }
    console.log("Day exists, updating:", day.id);
    return updateDay(day.id, day);
  } catch (error) {
    console.error("Error in upsertDay:", error);
    // Hata durumunda da create'i dene
    console.log("Trying to create due to error:", day.id);
    return createDay(day);
  }
}

// Authentication functions
export async function registerUser(userData) {
  if (IS_DEMO_MODE) {
    // Demo mode: localStorage'a kullanıcı kaydet
    const demoUser = { ...DEMO_USER, ...userData, id: "demo-user" };
    localStorage.setItem("demo-user", JSON.stringify(demoUser));
    setAuthToken("demo-token");
    return { user: demoUser, token: "demo-token" };
  }

  const r = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await r.json();

  if (!r.ok) {
    throw new Error(data.message || "Registration failed");
  }

  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function loginUser(username, password) {
  if (IS_DEMO_MODE) {
    // Demo mode: her zaman başarılı login
    const demoUser = JSON.parse(localStorage.getItem("demo-user")) || DEMO_USER;
    setAuthToken("demo-token");
    return { user: demoUser, token: "demo-token" };
  }

  const r = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await r.json();

  if (!r.ok) {
    throw new Error(data.message || "Login failed");
  }

  if (data.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function logoutUser() {
  setAuthToken(null);
}

// User profile functions
export async function getUserProfile() {
  if (IS_DEMO_MODE) {
    // Demo mode: localStorage'dan kullanıcı al
    const demoUser = JSON.parse(localStorage.getItem("demo-user")) || DEMO_USER;
    return demoUser;
  }

  const r = await fetch(`${API_URL}/auth/profile`, {
    headers: getAuthHeaders(),
  });
  if (r.status === 401) return null;
  return r.json();
}

export async function checkUsernameExists(username) {
  return false;
}

export async function updateUser(userData) {
  if (IS_DEMO_MODE) {
    // Demo mode: localStorage'da kullanıcı güncelle
    const updatedUser = { ...userData, id: "demo-user" };
    localStorage.setItem("demo-user", JSON.stringify(updatedUser));
    return { user: updatedUser };
  }

  const r = await fetch(`${API_URL}/auth/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  if (!r.ok) {
    const errorData = await r.json();
    throw new Error(errorData.message || "Update user failed");
  }

  return r.json();
}
