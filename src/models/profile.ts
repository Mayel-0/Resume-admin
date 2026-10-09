/** Présentation du hero. L'API renvoie un tableau d'une seule ligne. */
export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  location: string | null;
  tagline: string | null;
  /** Chemin servi par le back, ex. "/images/portrait.png" */
  portraitUrl: string | null;
  /** Date ISO : le JSON ne transporte pas d'objet Date */
  updatedAt: string | null;
}
