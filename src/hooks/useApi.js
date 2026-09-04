import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BASE = import.meta.env.VITE_API_URL + "/api/admin";

export function useApi() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleResponse = async (res) => {
    if (res.status === 401) {
      logout();
      navigate("/login");
      return null;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? `Erreur ${res.status}`);
    }
    if (res.status === 204) return null;
    return res.json();
  };

  const get = (path) =>
    fetch(`${BASE}${path}`, { headers }).then(handleResponse);

  const patch = (path, body) =>
    fetch(`${BASE}${path}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    }).then(handleResponse);

  const post = (path, body) =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }).then(handleResponse);

  const del = (path) =>
    fetch(`${BASE}${path}`, {
      method: "DELETE",
      headers,
    }).then(handleResponse);

  return { get, patch, post, del };
}
