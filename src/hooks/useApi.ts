import { useMemo } from "react";
import { useAuth } from "../context/authContext";
import type { AdminEndpoint, AdminEndpoints, CollectionRoute, ItemRoute } from "../models";

const BASE = import.meta.env.VITE_API_URL + "/api/admin";

const headers = {
  "Content-Type": "application/json",
};

/** Corps d'une requête : des champs de formulaire. */
export type Payload = Record<string, unknown>;

/** Ligne renvoyée après création ou modification. */
export type SavedRow = Record<string, unknown>;

export interface AdminApi {
  /** Le type de retour est déduit du chemin (voir models/AdminEndpoints). */
  get: <E extends AdminEndpoint>(path: E) => Promise<AdminEndpoints[E]>;
  post: (path: CollectionRoute, body: Payload) => Promise<SavedRow>;
  patch: (path: ItemRoute, body: Payload) => Promise<SavedRow>;
  del: (path: ItemRoute) => Promise<void>;
}

/** Message d'erreur renvoyé par le back, s'il y en a un. */
async function readError(res: Response): Promise<string> {
  const data: unknown = await res.json().catch(() => null);
  if (typeof data === "object" && data !== null && "error" in data && typeof data.error === "string") {
    return data.error;
  }
  return `Erreur ${res.status}`;
}

export function useApi(): AdminApi {
  const { logout } = useAuth();

  return useMemo(() => {
    // Vérifie le statut et renvoie la réponse si tout va bien
    const send = async (path: string, init?: RequestInit): Promise<Response> => {
      const res = await fetch(`${BASE}${path}`, { headers, credentials: "include", ...init });

      if (res.status === 401) {
        // Session expirée : retour à la page de connexion
        void logout();
        window.location.href = "/login";
        throw new Error("Session expirée");
      }
      if (!res.ok) throw new Error(await readError(res));
      return res;
    };

    return {
      get: async <E extends AdminEndpoint>(path: E) => {
        const res = await send(path);
        // Le contrat avec le back est porté par les modèles
        return res.json() as Promise<AdminEndpoints[E]>;
      },
      post: async (path, body) => {
        const res = await send(path, { method: "POST", body: JSON.stringify(body) });
        return res.json() as Promise<SavedRow>;
      },
      patch: async (path, body) => {
        const res = await send(path, { method: "PATCH", body: JSON.stringify(body) });
        // Le back répond sans corps quand l'identifiant n'existe plus
        const text = await res.text();
        return text ? (JSON.parse(text) as SavedRow) : {};
      },
      del: async (path) => {
        await send(path, { method: "DELETE" });
      },
    };
  }, [logout]);
}
