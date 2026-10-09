import { useResource } from "../hooks/useResource";
import { highestOrder } from "../lib/order";
import { EditableField } from "../components/EditableField";
import { CreateField } from "../components/CreateField";
import { DeleteButton } from "../components/DeleteField";

export default function AdminBriefs() {
  const { data: briefs, loading, error, reload: loadBriefs } = useResource("/briefs");

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  if (!briefs) return <p>Aucun brief trouvé.</p>;

  const maxOrder = highestOrder(briefs);

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
                  item={brief}
                  route={`/briefs/${brief.id}`}
                  fieldKey="title"
                />
              </div>
              <div className="admin-briefs__field">
                <label>Sous-titre</label>
                <EditableField
                  item={brief}
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
