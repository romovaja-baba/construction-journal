import type { EntriesFilter, EntriesSortOrder } from "../types";
import { entriesFilterToURLSearchParams } from "./entriesFilter";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function parseEntriesFilterFromSearch(search: string): EntriesFilter {
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const filter: EntriesFilter = {};

  const dateFrom = params.get("date_from");
  if (dateFrom && DATE_RE.test(dateFrom)) {
    filter.date_from = dateFrom;
  }

  const dateTo = params.get("date_to");
  if (dateTo && DATE_RE.test(dateTo)) {
    filter.date_to = dateTo;
  }

  const page = params.get("page");
  if (page) {
    const p = Number.parseInt(page, 10);
    if (p >= 1) filter.page = p;
  }

  const pageSize = params.get("page_size");
  if (pageSize) {
    const ps = Number.parseInt(pageSize, 10);
    if (ps >= 1 && ps <= 100) filter.page_size = ps;
  }

  const order = params.get("order");
  if (order === "asc" || order === "desc") {
    filter.order = order as EntriesSortOrder;
  }

  return filter;
}

export function entriesFilterToSearchParams(
  filter: EntriesFilter,
): URLSearchParams {
  return entriesFilterToURLSearchParams(filter, { omitDefaults: true });
}

export function readEntriesFilterFromLocation(): EntriesFilter {
  return parseEntriesFilterFromSearch(window.location.search);
}

export function writeEntriesFilterToLocation(filter: EntriesFilter): void {
  const params = entriesFilterToSearchParams(filter);
  const qs = params.toString();
  const url = qs
    ? `${window.location.pathname}?${qs}`
    : window.location.pathname;
  window.history.replaceState(null, "", url);
}
