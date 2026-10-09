import { useState } from "react";
import { useApi } from "../hooks/useApi";
import { toError } from "../lib/errors";
import type { ItemRoute, TextField } from "../models";

interface EditableFieldProps<T> {
  /** L'élément affiché (projet, section…) */
  item: T;
  /** Le champ texte à modifier : TypeScript refuse un nom qui n'existe pas */
  fieldKey: TextField<T>;
  /** Route de l'élément, ex. "/projects/12" */
  route: ItemRoute;
  /** "html" : zone de texte multi-ligne, rendue comme du HTML */
  type?: "text" | "html";
}

export function EditableField<T extends object>({
  item,
  route,
  fieldKey,
  type = "text",
}: EditableFieldProps<T>) {
  const initial: unknown = item[fieldKey];
  const value = typeof initial === "string" ? initial : "";

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saved, setSaved] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { patch } = useApi();

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const updated = await patch(route, { [fieldKey]: draft });
      const next = updated[fieldKey];
      setSaved(typeof next === "string" ? next : draft);
      setEditing(false);
    } catch (err) {
      setError(toError(err).message);
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
