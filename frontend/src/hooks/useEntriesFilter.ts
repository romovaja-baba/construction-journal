import { useCallback, useEffect, useState } from "react";
import { normalizeEntriesFilter } from "../lib/entriesFilter";
import type { EntriesFilter, NormalizedEntriesFilter } from "../types";
import {
    readEntriesFilterFromLocation,
    writeEntriesFilterToLocation,
} from "../lib/entriesFilterUrl";

export type SetEntriesFilter = (
    update: EntriesFilter | ((prev: NormalizedEntriesFilter) => EntriesFilter),
) => void;

function resolveFilterUpdate(
    prev: NormalizedEntriesFilter,
    update: EntriesFilter | ((prev: NormalizedEntriesFilter) => EntriesFilter),
): NormalizedEntriesFilter {
    const next = typeof update === "function" ? update(prev) : update;
    return normalizeEntriesFilter(next);
}

function syncFilterFromLocation(): NormalizedEntriesFilter {
    return normalizeEntriesFilter(readEntriesFilterFromLocation());
}

export function useEntriesFilter(): [
    NormalizedEntriesFilter,
    SetEntriesFilter,
] {
    const [filter, setFilterState] = useState<NormalizedEntriesFilter>(
        syncFilterFromLocation,
    );

    const setFilter = useCallback<SetEntriesFilter>((update) => {
        setFilterState((prev) => {
            const next = resolveFilterUpdate(prev, update);
            writeEntriesFilterToLocation(next);
            return next;
        });
    }, []);

    useEffect(() => {
        const onPopState = () => setFilterState(syncFilterFromLocation());
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    return [filter, setFilter];
}
