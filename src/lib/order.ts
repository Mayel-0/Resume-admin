/** Plus grande position d'une liste : un nouvel élément se place juste après. */
export const highestOrder = (items: { order: number }[]): number =>
  items.reduce((max, item) => Math.max(max, item.order), 0);
