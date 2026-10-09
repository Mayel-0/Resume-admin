export type Visibility = "Public" | "Privé";

export interface Project {
  id: number;
  /** Sert d'ancre sur la page de détail, ex. "cloud-perso" */
  slug: string;
  title: string;
  /** Chemin servi par le back, ex. "/images/Eldoria.webp" */
  imageUrl: string | null;
  year: string | null;
  visibility: Visibility | null;
  intro: string | null;
  contextTitle: string | null;
  context: string | null;
  readme: string | null;
  note: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  linkLabel: string | null;
  order: number;
  /** Date ISO : le JSON ne transporte pas d'objet Date */
  createdAt: string | null;
}

/** Étiquette affichée sur un projet. */
export interface ProjectTag {
  id: number;
  projectId: number;
  tag: string;
}

export type TechType = "language" | "framework";

/** Langage ou framework utilisé sur un projet. */
export interface ProjectTechStack {
  id: number;
  projectId: number;
  label: string;
  type: TechType;
}
