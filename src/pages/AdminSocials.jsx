import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { EditableField } from "../components/EditableField";
import { CreateField } from "../components/CreateField";
import { DeleteButton } from "../components/DeleteField";

export default function AdminSocials() {
  const {get} = useApi();
  const [socials, setSocials] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    get("/socials")
      .then(setSocials)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [])

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p>Erreur : {error.message}</p>;
  if (!socials) return <p>Aucun socials trouvé.</p>;


  const loadSocials = () => {
    setLoading(true);
    get("/socials")
      .then(setSocials)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const maxOrder = socials.length > 0
  ? Math.max(...socials.map((p) => Number(p.order) || 0))
  : 0;

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
            <article key={social.order} className="admin-socials__card">
              <label>label</label>
              <EditableField
                value={social.label}
                route={`/socials/${social.id}`}
                fieldKey="label"
              />
              <label>handle</label>
              <EditableField
                value={social.handle}
                route={`/socials/${social.id}`}
                fieldKey="handle"
              />
              <label>href</label>
              <EditableField
                value={social.href}
                route={`/socials/${social.id}`}
                fieldKey="href"
              />
              <label>icon</label>
              <EditableField
                value={social.icon}
                route={`/socials/${social.id}`}
                fieldKey="icon"
              />
              <label>path</label>
              <EditableField
                value={social.path}
                route={`/socials/${social.id}`}
                fieldKey="path"
              />
              <label>viewbox</label>
              <EditableField
                value={social.viewbox}
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
