import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { EditableField } from "../components/EditableField";
import { CreateField } from "../components/CreateField";

export default function AdminTimeline() {
  const {get} = useApi();
  const [timelines, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    get("/timeline")
      .then(setTimeline)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [])


  if (loading) return <p>chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  if (!timelines) return <p>Aucun object trouvé</p>;

      const loadTimeline = () => {
    setLoading(true);
    get("/timeline")
      .then(setTimeline)
      .catch(setError)
      .finally(() => setLoading(false));
  };

    const maxOrder = timelines.length > 0
  ? Math.max(...timelines.map((p) => Number(p.order) || 0))
  : 0;

  return (
    <section className="admin-timeline">
      <div className="admin-timeline__inner">
        <div className="admin-timeline__create">
          <CreateField
            route="/timeline"
            currentOrder={maxOrder}
            onSuccess={loadTimeline}
          >
            <label>Période</label>
            <input name="period" type="text" />

            <label>Titre</label>
            <input name="title" type="text" />

            <label>Sous-titre</label>
            <input name="subtitle" type="text" />

            <label>Texte</label>
            <textarea name="text" rows={4} />
          </CreateField>
        </div>
        <div className="admin-timeline__list">
        {timelines.map((timeline) => (
          <article key={timeline.order} className="admin-timeline__card">
            <div className="admin-timeline__field">
              <label>period</label>
              <EditableField
                value={timeline.period}
                route={`/timeline/${timeline.id}`}
                fieldKey="period"
              />
            </div>
            <div className="admin-timeline__field">
              <label>title</label>
              <EditableField
                value={timeline.title}
                route={`/timeline/${timeline.id}`}
                fieldKey="title"
              />
            </div>
            <div className="admin-timeline__field">
              <label>subtitle</label>
              <EditableField
                value={timeline.subtitle}
                route={`/timeline/${timeline.id}`}
                fieldKey="subtitle"
              />
            </div>
            <div className="admin-timeline__field">
              <label>text</label>
              <EditableField
                value={timeline.text}
                route={`/timeline/${timeline.id}`}
                fieldKey="text"
              />
            </div>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}

