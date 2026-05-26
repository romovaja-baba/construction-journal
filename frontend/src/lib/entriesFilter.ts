import type { EntriesFilter, NormalizedEntriesFilter } from "../types";
import {
    DEFAULT_ENTRIES_ORDER,
    DEFAULT_ENTRIES_PAGE,
    DEFAULT_ENTRIES_PAGE_SIZE,
} from "./entriesPagination";

export function normalizeEntriesFilter(
    filter: EntriesFilter,
): NormalizedEntriesFilter {
    return {
        date_from: filter.date_from,
        date_to: filter.date_to,
        page: filter.page ?? DEFAULT_ENTRIES_PAGE,
        page_size: filter.page_size ?? DEFAULT_ENTRIES_PAGE_SIZE,
        order: filter.order ?? DEFAULT_ENTRIES_ORDER,
    };
}

export function applyEntriesFilterPatch(
    filter: NormalizedEntriesFilter,
    patch: Partial<EntriesFilter>,
): NormalizedEntriesFilter {
    return normalizeEntriesFilter({ ...filter, ...patch });
}
