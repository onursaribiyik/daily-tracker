const API_URL = "http://localhost:5000/api";

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
