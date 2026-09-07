import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { EditableField } from "../components/EditableField";
import { CreateField } from "../components/CreateField";
import { DeleteButton } from "../components/DeleteField";

export default function AdminBriefs() {
  const { get } = useApi();
  const [briefs, setBriefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBriefs = () => {
    setLoading(true);
    get("/briefs")
      .then(setBriefs)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBriefs();
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  if (!briefs) return <p>Aucun brief trouvé.</p>;

  const maxOrder = briefs.length > 0
    ? Math.max(...briefs.map((brief) => Number(brief.order) || 0))
    : 0;

  return (
    <section className="admin-briefs">
      <h2>Briefs</h2>
      <div className="admin-briefs__inner">
        <div className="admin-briefs__create">
          <CreateField
            route="/briefs"
            currentOrder={maxOrder}
            onSuccess={loadBriefs}
          >
            <label>Titre</label>
            <input name="title" type="text" required />
            <label>Sous-titre</label>
            <input name="subtitle" type="text" required />
          </CreateField>
        </div>

        <div className="admin-briefs__list">
          {briefs.map((brief) => (
            <article className="admin-briefs__card" key={brief.id}>
              <div className="admin-briefs__field">
                <label>Titre</label>
                <EditableField
                  value={brief.title}
                  route={`/briefs/${brief.id}`}
                  fieldKey="title"
                />
              </div>
              <div className="admin-briefs__field">
                <label>Sous-titre</label>
                <EditableField
                  value={brief.subtitle}
                  route={`/briefs/${brief.id}`}
                  fieldKey="subtitle"
                />
              </div>
              <DeleteButton
                route={`/briefs/${brief.id}`}
                onSuccess={loadBriefs}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
