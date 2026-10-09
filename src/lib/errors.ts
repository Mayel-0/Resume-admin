/** Ce qui est attrapé par un catch est de type inconnu : on en fait une Error. */
export const toError = (error: unknown): Error =>
  error instanceof Error ? error : new Error(String(error));
