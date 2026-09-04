import { useState } from "react";
import { useApi } from "../hooks/useApi";

export function EditableField({ value, route, fieldKey, type = "text" }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saved, setSaved] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { patch } = useApi();

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const updated = await patch(route, { [fieldKey]: draft });
      setSaved(updated[fieldKey] ?? draft);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDraft(saved); // remet la valeur sauvegardée
    setEditing(false);
    setError(null);
  };

  // ── Mode lecture ─────────────────────────────────────────
  if (!editing) {
    return (
      <div
        className="editable-field"
        onClick={() => setEditing(true)}
        title="Cliquer pour modifier"
      >
        {type === "html"
          ? <span dangerouslySetInnerHTML={{ __html: saved }} />
          : <span>{saved}</span>
        }
        <button className="editable-field__edit-btn">✏️</button>
      </div>
    );
  }

  // ── Mode édition ─────────────────────────────────────────
  return (
    <div className="editable-field editable-field--editing">

      {type === "html" ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={6}
          autoFocus
        />
      ) : (
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
        />
      )}

      {error && <p className="editable-field__error">{error}</p>}

      <div className="editable-field__actions">
        <button onClick={handleSave} disabled={loading}>
          {loading ? "Sauvegarde…" : "💾 Sauvegarder"}
        </button>
        <button onClick={handleCancel} disabled={loading}>
          ✕ Annuler
        </button>
      </div>

    </div>
  );
}
