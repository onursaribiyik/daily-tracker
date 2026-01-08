import { DEMO_USER } from "../utils/constants";
import { createDemoDay } from "../utils/helpers";

const API_URL = import.meta.env.VITE_API_URL;
const IS_DEMO_MODE = API_URL.includes("localhost");
let authToken = localStorage.getItem("authToken");

console.log("IS_DEMO_MODE:", IS_DEMO_MODE);

export const setAuthToken = (token) => {
  authToken = token;
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
};

export const getAuthToken = () => {
  return authToken;
};

const getAuthHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  return headers;
};

export const getDays = async () => {
  if (IS_DEMO_MODE) {
    const storedDays = localStorage.getItem("demo-days");
    if (storedDays) {
      return JSON.parse(storedDays);
    }

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
};

export const getDay = async (id) => {
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
};

export const createDay = async (day) => {
  if (IS_DEMO_MODE) {
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
};

export const updateDay = async (id, day) => {
  if (IS_DEMO_MODE) {
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
};

export const upsertDay = async (day) => {
  try {
    const existing = await getDay(day.id);
    if (!existing) {
      return createDay(day);
    }
    return updateDay(day.id, day);
  } catch (error) {
    console.error("Error in upsertDay:", error);
    return createDay(day);
  }
};

export const registerUser = async (userData) => {
  if (IS_DEMO_MODE) {
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
};

export const loginUser = async (username, password) => {
  if (IS_DEMO_MODE) {
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
};

export const logoutUser = async () => {
  setAuthToken(null);
};

export const getUserProfile = async () => {
  if (IS_DEMO_MODE) {
    const demoUser = JSON.parse(localStorage.getItem("demo-user")) || DEMO_USER;
    return demoUser;
  }

  const r = await fetch(`${API_URL}/auth/profile`, {
    headers: getAuthHeaders(),
  });
  if (r.status === 401) return null;
  return r.json();
};

export const checkUsernameExists = async (username) => {
  return false;
};

export const updateUser = async (userData) => {
  if (IS_DEMO_MODE) {
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
};

export const changePassword = async (oldPassword, newPassword) => {
  if (IS_DEMO_MODE) {
    // Demo modunda şifre değiştirmeyi simüle et
    return { message: "Password changed successfully" };
  }

  const r = await fetch(`${API_URL}/auth/change-password`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  if (!r.ok) {
    const errorData = await r.json();
    throw new Error(errorData.message || "Change password failed");
  }

  return r.json();
};
