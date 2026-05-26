import type { NormalizedEntriesFilter } from "../types";

export function serializeEntriesFilterForKey(filter: NormalizedEntriesFilter) {
    return {
        date_from: filter.date_from ?? null,
        date_to: filter.date_to ?? null,
        page: filter.page,
        page_size: filter.page_size,
        order: filter.order,
    };
}

export const queryKeys = {
    entries: {
        all: ["entries"] as const,
        list: (filter: NormalizedEntriesFilter) =>
            ["entries", "list", serializeEntriesFilterForKey(filter)] as const,
    },
    workTypes: {
        all: ["work-types"] as const,
    },
};
