import { useCallback } from "react";
import { DEFAULT_ENTRIES_PAGE } from "../lib/entriesPagination";
import type { EntriesFilter, EntriesSortOrder } from "../types";
import type { SetEntriesFilter } from "./useEntriesFilter";

export function useEntriesFilterActions(setFilter: SetEntriesFilter) {
    const updateFilter = useCallback(
        (patch: Partial<EntriesFilter>) => {
            setFilter((prev) => ({ ...prev, ...patch }));
        },
        [setFilter],
    );

    const resetPage = useCallback(() => {
        updateFilter({ page: DEFAULT_ENTRIES_PAGE });
    }, [updateFilter]);

    const applyFilterPatch = useCallback(
        (patch: Partial<EntriesFilter>) => {
            setFilter((prev) => ({
                ...prev,
                ...patch,
                page: DEFAULT_ENTRIES_PAGE,
            }));
        },
        [setFilter],
    );

    const setPage = useCallback(
        (page: number) => updateFilter({ page }),
        [updateFilter],
    );

    const setDateOrder = useCallback(
        (order: EntriesSortOrder) =>
            updateFilter({ order, page: DEFAULT_ENTRIES_PAGE }),
        [updateFilter],
    );

    return { updateFilter, resetPage, applyFilterPatch, setPage, setDateOrder };
}
