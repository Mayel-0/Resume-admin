import { useResource } from "../hooks/useResource";
import { highestOrder } from "../lib/order";
import { EditableField } from "../components/EditableField";
import { CreateField } from "../components/CreateField";
import { DeleteButton } from "../components/DeleteField";


export default function AdminSections() {
  const { data: sections, loading, error, reload: loadSections } = useResource("/sections");

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p>Erreur : {error.message}</p>;
  if (!sections) return <p>Aucune section trouvée.</p>;

  const maxOrder = highestOrder(sections);

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
          <article key={section.id} className="admin-sections__card">
            <div className="admin-sections__field">
              <label>Titre</label>
              <EditableField
                item={section}
                route={`/sections/${section.id}`}
                fieldKey="title"
              />
            </div>
            <div className="admin-sections__field">
              <label>Text</label>
              <EditableField
                item={section}
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
