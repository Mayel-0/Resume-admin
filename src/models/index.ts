// Modèles des données renvoyées par l'API (miroir de Resume-Back/src/models).
import type { Brief } from "./brief";
import type { Profile } from "./profile";
import type { Project, ProjectTag, ProjectTechStack } from "./project";
import type { Section } from "./section";
import type { SkillCategory, SkillItem } from "./skill";
import type { Social } from "./social";
import type { TimelineItem } from "./timeline";

export type { Brief } from "./brief";
export type { Profile } from "./profile";
export type { Project, ProjectTag, ProjectTechStack, TechType, Visibility } from "./project";
export type { Section } from "./section";
export type { SkillCategory, SkillItem } from "./skill";
export type { Social } from "./social";
export type { TimelineItem } from "./timeline";

/**
 * Ce que renvoie chaque route GET de /api/admin. Les chemins servent
 * aussi à typer les routes de création, modification et suppression.
 */
export interface AdminEndpoints {
  /** Une seule ligne ; null tant que le profil n'a pas été créé */
  "/profil": Profile | null;
  "/sections": Section[];
  "/timeline": TimelineItem[];
  "/briefs": Brief[];
  "/socials": Social[];
  "/skill-categories": SkillCategory[];
  "/skill-items": SkillItem[];
  "/projects": Project[];
  "/project-tags": ProjectTag[];
  "/project-tech-stack": ProjectTechStack[];
}

export type AdminEndpoint = keyof AdminEndpoints;

/** Route d'une liste : on y crée des éléments (POST). */
export type CollectionRoute = Exclude<AdminEndpoint, "/profil">;

/** Route d'un élément précis : "/projects/12". Le profil n'a pas d'identifiant. */
export type ItemRoute = `${CollectionRoute}/${number}` | "/profil";

/** Noms des champs texte d'un modèle : ceux qu'on peut modifier en ligne. */
export type TextField<T> = {
  [K in keyof T]-?: T[K] extends string | null ? K : never;
}[keyof T] &
  string;
