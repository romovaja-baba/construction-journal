import type { EntriesFilter } from "../types";
import {
    DEFAULT_ENTRIES_ORDER,
    DEFAULT_ENTRIES_PAGE,
    DEFAULT_ENTRIES_PAGE_SIZE,
} from "./entriesPagination";

export function normalizeEntriesFilter(
    filter: EntriesFilter,
): Required<Pick<EntriesFilter, "page" | "page_size" | "order">> &
    EntriesFilter {
    return {
        ...filter,
        page: filter.page ?? DEFAULT_ENTRIES_PAGE,
        page_size: filter.page_size ?? DEFAULT_ENTRIES_PAGE_SIZE,
        order: filter.order ?? DEFAULT_ENTRIES_ORDER,
    };
}

export function entriesFilterToURLSearchParams(
    filter: EntriesFilter,
): URLSearchParams {
    const { date_from, date_to, page, page_size, order } =
        normalizeEntriesFilter(filter);
    const params = new URLSearchParams();

    if (date_from) params.set("date_from", date_from);
    if (date_to) params.set("date_to", date_to);
    params.set("page", String(page));
    params.set("page_size", String(page_size));
    params.set("order", order);

    return params;
}
