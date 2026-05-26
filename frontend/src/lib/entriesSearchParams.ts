import type { EntriesFilter, EntriesSortOrder } from "../types";
import { entriesFilterToURLSearchParams } from "./entriesFilter";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseDateParam(
    params: URLSearchParams,
    key: "date_from" | "date_to",
): string | undefined {
    const value = params.get(key);
    return value && DATE_RE.test(value) ? value : undefined;
}

function parseIntParam(
    params: URLSearchParams,
    key: string,
    isValid: (n: number) => boolean,
): number | undefined {
    const raw = params.get(key);
    if (!raw) return undefined;
    const n = Number.parseInt(raw, 10);
    return isValid(n) ? n : undefined;
}

export function parseEntriesFilterFromSearch(search: string): EntriesFilter {
    const params = new URLSearchParams(
        search.startsWith("?") ? search.slice(1) : search,
    );
    const filter: EntriesFilter = {};

    const dateFrom = parseDateParam(params, "date_from");
    if (dateFrom) filter.date_from = dateFrom;

    const dateTo = parseDateParam(params, "date_to");
    if (dateTo) filter.date_to = dateTo;

    const page = parseIntParam(params, "page", (n) => n >= 1);
    if (page !== undefined) filter.page = page;

    const pageSize = parseIntParam(
        params,
        "page_size",
        (n) => n >= 1 && n <= 100,
    );
    if (pageSize !== undefined) filter.page_size = pageSize;

    const order = params.get("order");
    if (order === "asc" || order === "desc") {
        filter.order = order as EntriesSortOrder;
    }

    return filter;
}

export function entriesFilterToSearchParams(
    filter: EntriesFilter,
): URLSearchParams {
    return entriesFilterToURLSearchParams(filter);
}

export function readEntriesFilterFromLocation(): EntriesFilter {
    return parseEntriesFilterFromSearch(window.location.search);
}

export function writeEntriesFilterToLocation(filter: EntriesFilter): void {
    const qs = entriesFilterToSearchParams(filter).toString();
    const url = qs
        ? `${window.location.pathname}?${qs}`
        : window.location.pathname;
    window.history.replaceState(null, "", url);
}
