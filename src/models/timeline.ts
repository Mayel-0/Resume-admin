/** Étape du parcours (formation, expérience…). */
export interface TimelineItem {
  id: number;
  period: string;
  title: string;
  subtitle: string | null;
  text: string | null;
  order: number;
}
