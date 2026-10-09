// CreateField.tsx
import { useState, type FormEvent, type ReactNode } from "react";
import { useApi, type Payload } from "../hooks/useApi";
import { toError } from "../lib/errors";
import { slugify } from "../lib/slugify";
import type { CollectionRoute } from "../models";

interface CreateFieldProps {
  /** Les champs du formulaire (inputs avec un attribut name) */
  children: ReactNode;
  /** Route de la liste où créer l'élément, ex. "/projects" */
  route: CollectionRoute;
  /** Plus grande position existante : le nouvel élément se place après */
  currentOrder?: number;
  onSuccess?: () => void;
  /** Projets : génère le slug à partir du titre */
  withSlug?: boolean;
  /** Sections : génère sectionId et le numéro affiché ("01", "02"…) */
  withSectionExtras?: boolean;
  /** false pour les éléments sans position (tags, stack technique) */
  withOrder?: boolean;
}

export function CreateField({
  children,
  route,
  currentOrder = 0,
  onSuccess,
  withSlug = false,
  withSectionExtras = false,
  withOrder = true,
}: CreateFieldProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { post } = useApi();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // À lire tout de suite : currentTarget n'existe plus après un await
    const form = e.currentTarget;
    setLoading(true);
    setError(null);

    const data: Payload = Object.fromEntries(new FormData(form));
    const title = typeof data.title === "string" ? data.title : "";

    // Slug pour projects
    if (withSlug && title) {
      data.slug = slugify(title);
    }

    // sectionId + index pour sections
    if (withSectionExtras && title) {
      data.sectionId = slugify(title);
      // "01", "02"… "09", puis "10", "11"…
      data.index = String(currentOrder + 1).padStart(2, "0");
    }

    if (withOrder) {
      data.order = currentOrder + 1;
    }

    try {
      await post(route, data);
      form.reset();
      onSuccess?.();
    } catch (err) {
      setError(toError(err).message);
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
