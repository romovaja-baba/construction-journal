import { useCallback, useEffect, useState } from "react";
import {
    readEntriesFilterFromLocation,
    writeEntriesFilterToLocation,
} from "../lib/entriesSearchParams";
import { normalizeEntriesFilter } from "../lib/entriesFilter";
import type { EntriesFilter } from "../types";

type SetEntriesFilter = (
    update: EntriesFilter | ((prev: EntriesFilter) => EntriesFilter),
) => void;

function resolveFilterUpdate(
    prev: EntriesFilter,
    update: EntriesFilter | ((prev: EntriesFilter) => EntriesFilter),
): EntriesFilter {
    return normalizeEntriesFilter(
        typeof update === "function" ? update(prev) : update,
    );
}

export function useEntriesFilter(): [EntriesFilter, SetEntriesFilter] {
    const [filter, setFilterState] = useState<EntriesFilter>(() =>
        normalizeEntriesFilter(readEntriesFilterFromLocation()),
    );

    const setFilter = useCallback<SetEntriesFilter>((update) => {
        setFilterState((prev) => {
            const next = resolveFilterUpdate(prev, update);
            writeEntriesFilterToLocation(next);
            return next;
        });
    }, []);

    useEffect(() => {
        const syncFilterFromLocation = () => {
            setFilterState(
                normalizeEntriesFilter(readEntriesFilterFromLocation()),
            );
        };
        window.addEventListener("popstate", syncFilterFromLocation);
        return () =>
            window.removeEventListener("popstate", syncFilterFromLocation);
    }, []);

    return [filter, setFilter];
}
