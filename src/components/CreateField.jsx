// CreateField.jsx
import { useState } from "react";
import { useApi } from "../hooks/useApi";

export function CreateField({ children, route, currentOrder, onSuccess, withSlug = false, withSectionExtras = false}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { post } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.target));

        // Slug pour projects
    if (withSlug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    // sectionId + index pour sections
    if (withSectionExtras && data.title) {
      data.sectionId = data.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const nextOrder = currentOrder + 1;
      data.index = nextOrder < 10
        ? `0${nextOrder}`   // "01", "02"... "09"
        : `${nextOrder}`;   // "10", "11"...
    }

    data.order = currentOrder + 1;
    //console.log(data)

    try {
      await post(route, data);
      e.target.reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {children}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Envoi..." : "Envoyer"}
      </button>
    </form>
  );
}
