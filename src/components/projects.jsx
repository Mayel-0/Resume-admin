import ProjectCard from "./projectCard";

import { MoveRight } from "lucide-react";
import useProjects from "../hooks/useProject.js";


function Projets() {
  const { projects, loading: loadingProjects } = useProjects();

  if (loadingProjects) return <p>Chargement...</p>;

  return (
    <section id="projets" className="projects section shell">
      <div className="section__head">
        <span className="section__index">04</span>
        <h2>Projets</h2>
      </div>
      <p className="section__lead">
        Une sélection de projets d'école et personnels, du jeu CLI en Go au cloud auto-hébergé.
      </p>

      <div className="projects__grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="projects__more">
        <a className="btn btn--accent" href="/projet">
          Voir tous les détails techniques
          <MoveRight size={24} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

export default Projets;
