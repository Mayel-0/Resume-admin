import { useState } from "react";
import { useApi } from "../hooks/useApi";

export function DeleteButton({ route, onSuccess }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { del } = useApi();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await del(route);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  };

  if (!confirm) {
    return (
      <button onClick={() => setConfirm(true)}>
        🗑️ Supprimer
      </button>
    );
  }

  return (
    <div>
      <span>Tu es sûr ?</span>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? "Suppression…" : "✅ Confirmer"}
      </button>
      <button onClick={() => setConfirm(false)} disabled={loading}>
        ✕ Annuler
      </button>
    </div>
  );
}
