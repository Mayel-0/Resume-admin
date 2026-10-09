/** Bloc de texte libre de la section « Parcours ». */
export interface Section {
  id: number;
  /** Identifiant d'ancre, ex. "apropos" */
  sectionId: string;
  /** Numéro affiché, ex. "01" */
  index: string | null;
  title: string;
  /** HTML saisi dans le backoffice */
  html: string;
  order: number;
}
