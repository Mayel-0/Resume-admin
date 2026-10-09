import { useResource } from "../hooks/useResource";
import { highestOrder } from "../lib/order";
import { EditableField } from "../components/EditableField";
import { CreateField } from "../components/CreateField";
import { DeleteButton } from "../components/DeleteField";

export default function AdminSocials() {
  const { data: socials, loading, error, reload: loadSocials } = useResource("/socials");

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p>Erreur : {error.message}</p>;
  if (!socials) return <p>Aucun socials trouvé.</p>;

  const maxOrder = highestOrder(socials);

  return (
    <section className="admin-socials">
      <div className="admin-socials__inner">
        <div className="admin-socials__create">
          <CreateField
            route="/socials"
            currentOrder={maxOrder}
            onSuccess={loadSocials}
          >
            <label>label</label>
            <input name="label" type="text" />
            <label>handle</label>
            <input name="handle" type="text" />
            <label>href</label>
            <input name="href" type="text" />
            <label>icon</label>
            <input name="icon" type="text" />
            <label>path</label>
            <input name="path" type="text" />
            <label>viewbox</label>
            <input name="viewbox" type="text" />
          </CreateField>
        </div>
        <div className="admin-socials__list">
          {socials.map((social) => (
            <article key={social.id} className="admin-socials__card">
              <label>label</label>
              <EditableField
                item={social}
                route={`/socials/${social.id}`}
                fieldKey="label"
              />
              <label>handle</label>
              <EditableField
                item={social}
                route={`/socials/${social.id}`}
                fieldKey="handle"
              />
              <label>href</label>
              <EditableField
                item={social}
                route={`/socials/${social.id}`}
                fieldKey="href"
              />
              <label>icon</label>
              <EditableField
                item={social}
                route={`/socials/${social.id}`}
                fieldKey="icon"
              />
              <label>path</label>
              <EditableField
                item={social}
                route={`/socials/${social.id}`}
                fieldKey="path"
              />
              <label>viewbox</label>
              <EditableField
                item={social}
                route={`/socials/${social.id}`}
                fieldKey="viewbox"
              />
              <DeleteButton
              route={`/socials/${social.id}`}
              onSuccess={loadSocials}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
