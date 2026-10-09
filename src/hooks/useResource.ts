import { useCallback, useEffect, useState } from "react";
import { toError } from "../lib/errors";
import type { AdminEndpoint, AdminEndpoints } from "../models";
import { useApi } from "./useApi";

interface ResourceState<T> {
  /** null tant que rien n'est chargé, ou si le chargement a échoué */
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * useResource — charge une ressource du backoffice et permet de la
 * recharger après une création, une modification ou une suppression.
 * Le type de `data` est déduit du chemin (voir models/AdminEndpoints).
 */
export function useResource<E extends AdminEndpoint>(endpoint: E) {
  const { get } = useApi();
  const [state, setState] = useState<ResourceState<AdminEndpoints[E]>>({
    data: null,
    loading: true,
    error: null,
  });

  const load = useCallback(
    () =>
      get(endpoint)
        .then((data) => setState({ data, loading: false, error: null }))
        .catch((error: unknown) => setState({ data: null, loading: false, error: toError(error) })),
    [get, endpoint],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const reload = useCallback(() => {
    setState((current) => ({ ...current, loading: true }));
    void load();
  }, [load]);

  return { ...state, reload };
}
