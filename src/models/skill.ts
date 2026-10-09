/** Catégorie de compétences (Langages, Front-end…). */
export interface SkillCategory {
  id: number;
  title: string;
  order: number;
}

/** Compétence rattachée à une catégorie. */
export interface SkillItem {
  id: number;
  categoryId: number;
  label: string;
  order: number;
}
