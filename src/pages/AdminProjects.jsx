import { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import { EditableField } from "../components/EditableField";
import { CreateField } from "../components/CreateField";
import { DeleteButton } from "../components/DeleteField";

export default function AdminProjects() {
  const {get} = useApi();
  const [projects, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    get("/projects")
      .then(setProject)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [])

  if (loading) return <p>Chargement…</p>;
  if (error)   return <p>Erreur : {error.message}</p>;
  if (!projects) return <p>Aucun project trouvé.</p>;

  const loadProjects = () => {
  setLoading(true);
  get("/projects")
    .then(setProject)
    .catch(setError)
    .finally(() => setLoading(false));
};

  const maxOrder = projects.length > 0
  ? Math.max(...projects.map((p) => Number(p.order) || 0))
  : 0;

  return (
    <section className="admin-project">
      <h2>Project</h2>
      <div className="admin-project__inner">
        <div className="admin-project__create">
          <CreateField route="/projects" currentOrder={maxOrder} onSuccess={loadProjects} withSlug>
            <label>Titre</label>
            <input name="title" type="text"/>
            <label>imageUrl</label>
            <input name="imageUrl" type="text"/>
            <label>year</label>
            <input name="year" type="text"/>
            <label>visibility</label>
            <input name="visibility" type="text"/>
            <label>Intro</label>
            <input name="intro" type="text"/>
            <label>contextTitle</label>
            <input name="contextTitle" type="text"/>
            <label>context</label>
            <input name="context" type="text"/>
            <label>readme</label>
            <input name="readme" type="text"/>
            <label>note</label>
            <input name="note" type="text"/>
            <label>githubUrl</label>
            <input name="githubUrl" type="text"/>
            <label>liveUrl</label>
            <input name="liveUrl" type="text"/>
            <label>linkLabel</label>
            <input name="linkLabel" type="text"/>
          </CreateField>
        </div>
        <hr></hr>
        <div className="admin-project__list">
        {projects.map((project) => (
          <article key={project.id} className="admin-project__card">
            <div className="admin-project__field">
              <label>Titre</label>
              <EditableField
                value={project.title}
                route={`/projects/${project.id}`}
                fieldKey="title"
              />
            </div>
            <div className="admin-project__field">
              <label>imageUrl</label>
              <EditableField
                value={project.imageUrl}
                route={`/projects/${project.id}`}
                fieldKey="imageUrl"
              />
            </div>
            <div className="admin-project__field">
              <label>year</label>
              <EditableField
                value={project.year}
                route={`/projects/${project.id}`}
                fieldKey="year"
              />
            </div>
            <div className="admin-project__field">
              <label>visibility: Privé , Public</label>
              <EditableField
                value={project.visibility}
                route={`/projects/${project.id}`}
                fieldKey="visibility"
              />
            </div>
            <div className="admin-project__field">
              <label>Intro</label>
              <EditableField
                value={project.intro}
                route={`/projects/${project.id}`}
                fieldKey="intro"
              />
            </div>
            <div className="admin-project__field">
              <label>contextTitle</label>
              <EditableField
                value={project.contextTitle}
                route={`/projects/${project.id}`}
                fieldKey="contextTitle"
              />
            </div>
            <div className="admin-project__field">
              <label>context</label>
              <EditableField
                value={project.context}
                route={`/projects/${project.id}`}
                fieldKey="context"
              />
            </div>
            <div className="admin-project__field">
              <label>readme</label>
              <EditableField
                value={project.readme}
                route={`/projects/${project.id}`}
                fieldKey="readme"
              />
            </div>
            <div className="admin-project__field">
              <label>note</label>
              <EditableField
                value={project.note}
                route={`/projects/${project.id}`}
                fieldKey="note"
              />
            </div>
            <div className="admin-project__field">
              <label>githubUrl</label>
              <EditableField
                value={project.githubUrl}
                route={`/projects/${project.id}`}
                fieldKey="githubUrl"
              />
            </div>
            <div className="admin-project__field">
              <label>liveUrl</label>
              <EditableField
                value={project.liveUrl}
                route={`/projects/${project.id}`}
                fieldKey="liveUrl"
              />
            </div>
            <div className="admin-project__field">
              <label>linkLabel</label>
              <EditableField
                value={project.linkLabel}
                route={`/projects/${project.id}`}
                fieldKey="linkLabel"
              />
            </div>
            <DeleteButton
              route={`/projects/${project.id}`}
              onSuccess={loadProjects}
            />
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
