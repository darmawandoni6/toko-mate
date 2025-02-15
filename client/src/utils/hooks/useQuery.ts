import { useMemo } from 'react';

export function useQuery(search: string) {
  return useMemo(() => new URLSearchParams(search), [search]);
}
