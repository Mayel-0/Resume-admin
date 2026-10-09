/** Lien de contact. `path` et `viewbox` décrivent l'icône SVG. */
export interface Social {
  id: number;
  label: string;
  handle: string | null;
  href: string;
  icon: string | null;
  order: number;
  path: string | null;
  viewbox: string | null;
}
