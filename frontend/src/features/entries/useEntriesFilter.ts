import { useCallback, useEffect, useState } from "react";
import {
  readEntriesFilterFromLocation,
  writeEntriesFilterToLocation,
} from "../../lib/entriesSearchParams";
import { normalizeEntriesFilter } from "../../lib/entriesFilter";
import type { EntriesFilter } from "../../types";

type SetEntriesFilter = (
  update: EntriesFilter | ((prev: EntriesFilter) => EntriesFilter),
) => void;

export function useEntriesFilter(): [EntriesFilter, SetEntriesFilter] {
  const [filter, setFilterState] = useState<EntriesFilter>(() =>
    normalizeEntriesFilter(readEntriesFilterFromLocation()),
  );

  const setFilter = useCallback<SetEntriesFilter>((update) => {
    setFilterState((prev) => {
      const next = normalizeEntriesFilter(
        typeof update === "function" ? update(prev) : update,
      );
      writeEntriesFilterToLocation(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setFilterState(normalizeEntriesFilter(readEntriesFilterFromLocation()));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return [filter, setFilter];
}
