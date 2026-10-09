import { useResource } from "../hooks/useResource";
import { highestOrder } from "../lib/order";
import { EditableField } from "../components/EditableField";
import { CreateField } from "../components/CreateField";
import { DeleteButton } from "../components/DeleteField";

export default function AdminTimeline() {
  const { data: timelines, loading, error, reload: loadTimeline } = useResource("/timeline");

  if (loading) return <p>chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  if (!timelines) return <p>Aucun object trouvé</p>;

  const maxOrder = highestOrder(timelines);

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
          <article key={timeline.id} className="admin-timeline__card">
            <div className="admin-timeline__field">
              <label>period</label>
              <EditableField
                item={timeline}
                route={`/timeline/${timeline.id}`}
                fieldKey="period"
              />
            </div>
            <div className="admin-timeline__field">
              <label>title</label>
              <EditableField
                item={timeline}
                route={`/timeline/${timeline.id}`}
                fieldKey="title"
              />
            </div>
            <div className="admin-timeline__field">
              <label>subtitle</label>
              <EditableField
                item={timeline}
                route={`/timeline/${timeline.id}`}
                fieldKey="subtitle"
              />
            </div>
            <div className="admin-timeline__field">
              <label>text</label>
              <EditableField
                item={timeline}
                route={`/timeline/${timeline.id}`}
                fieldKey="text"
              />
            </div>
            <DeleteButton
              route={`/timeline/${timeline.id}`}
              onSuccess={loadTimeline}
            />
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}

