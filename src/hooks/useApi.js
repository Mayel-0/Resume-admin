import { useAuth } from "../context/AuthContext";

const BASE = import.meta.env.VITE_API_URL + "/api/admin";

export function useApi() {
  const { logout } = useAuth();

  const headers = {
    "Content-Type": "application/json",
  };

  const handleResponse = async (res) => {
    console.log("Response status:", res.status, "for URL:", res.url);
    if (res.status === 401) {
      logout();
      window.location.href = "/login";
      return null;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? `Erreur ${res.status}`);
    }
    if (res.status === 204) return null;
    return res.json();
  };

  const get = (path) => {
    console.log("GET request to:", `${BASE}${path}`);
    return fetch(`${BASE}${path}`, {
      headers,
      credentials: "include",
    }).then(handleResponse);
  };

  const patch = (path, body) =>
    fetch(`${BASE}${path}`, {
      method: "PATCH",
      headers,
      credentials: "include",
      body: JSON.stringify(body),
    }).then(handleResponse);

  const post = (path, body) =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(body),
    }).then(handleResponse);

  const del = (path) =>
    fetch(`${BASE}${path}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    }).then(handleResponse);

  return { get, patch, post, del };
}
