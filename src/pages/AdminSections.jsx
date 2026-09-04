import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { EditableField } from "../components/EditableField";
import { CreateField } from "../components/CreateField";
import { DeleteButton } from "../components/DeleteField";


export default function AdminSections() {
  const {get} = useApi();
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    get("/sections")
      .then(setSections)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [])

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p>Erreur : {error.message}</p>;
  if (!sections) return <p>Aucun project trouvé.</p>;

    const loadSections = () => {
    setLoading(true);
    get("/sections")
      .then(setSections)
      .catch(setError)
      .finally(() => setLoading(false));
  };

    const maxOrder = sections.length > 0
  ? Math.max(...sections.map((p) => Number(p.order) || 0))
  : 0;

  return(
    <section className="admin-sections">
      <div className="admin-sections__inner">
        <div className="admin-sections__create">
          <CreateField
            route="/sections"
            currentOrder={maxOrder}
            onSuccess={loadSections}
            withSectionExtras
          >
            <label>Titre</label>
            <input name="title" type="text" />
            <label>Contenu HTML</label>
            <textarea name="html" rows={6} />
          </CreateField>
        </div>
        <div className="admin-sections__list">
        {sections.map((section) => (
          <article key={section.order} className="admin-sections__card">
            <div className="admin-sections__field">
              <label>Titre</label>
              <EditableField
                value={section.title}
                route={`/sections/${section.id}`}
                fieldKey="title"
              />
            </div>
            <div className="admin-sections__field">
              <label>Text</label>
              <EditableField
                value={section.html}
                route={`/sections/${section.id}`}
                fieldKey="html"
                type="html"
              />
            </div>
            <DeleteButton
              route={`/sections/${section.id}`}
              onSuccess={loadSections}
            />
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
