const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Parse JSON safely
async function tryParseJson(res) {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) return null;
  try { return await res.json(); } catch { return null; }
}

function getToken() {
  return localStorage.getItem("token");
}

function handleAuthFailure() {
  localStorage.removeItem("token");
  alert("Session expired or invalid. Please login again.");
  window.location.href = "/login";
}

//AUTH
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const json = await tryParseJson(res);
  if (!res.ok) throw new Error(json?.message || "Login failed");

  if (json.token) localStorage.setItem("token", json.token);
  return json;
}

//CREATE TRANSACTION
export async function createTransaction(data) {
  const token = getToken();

  const res = await fetch(`${API_BASE}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401 || res.status === 403) return handleAuthFailure();

  const json = await tryParseJson(res);
  if (!res.ok) throw new Error(json?.message || "Failed to save transaction");

  return json;
}

//GET ALL TRANSACTIONS
export async function getTransactions() {
  const token = getToken();

  const res = await fetch(`${API_BASE}/api/transactions`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) return handleAuthFailure();

  const json = await tryParseJson(res);
  if (!res.ok) throw new Error(json?.message || "Failed to fetch transactions");

  return Array.isArray(json) ? json : [];
}

//DELETE TRANSACTION
export async function deleteTransaction(id) {
  const token = getToken();

  const res = await fetch(`${API_BASE}/api/transactions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) return handleAuthFailure();

  const json = await tryParseJson(res);
  if (!res.ok) throw new Error(json?.message || "Delete failed");

  return json;
}
export async function updateTransaction(id, data) {
  const token = getToken();

  const res = await fetch(`${API_BASE}/api/transactions/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(data)
  });

  if (res.status === 401 || res.status === 403) return handleAuthFailure();

  const json = await tryParseJson(res);
  if (!res.ok) throw new Error(json?.message || "Update failed");

  return json;
}
