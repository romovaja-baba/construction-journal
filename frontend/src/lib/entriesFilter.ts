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
  options: { omitDefaults: boolean },
): URLSearchParams {
  const normalized = normalizeEntriesFilter(filter);
  const params = new URLSearchParams();

  if (normalized.date_from) params.set("date_from", normalized.date_from);
  if (normalized.date_to) params.set("date_to", normalized.date_to);

  if (options.omitDefaults) {
    if (normalized.page !== DEFAULT_ENTRIES_PAGE) {
      params.set("page", String(normalized.page));
    }
    if (normalized.page_size !== DEFAULT_ENTRIES_PAGE_SIZE) {
      params.set("page_size", String(normalized.page_size));
    }
    if (normalized.order !== DEFAULT_ENTRIES_ORDER) {
      params.set("order", normalized.order);
    }
  } else {
    params.set("page", String(normalized.page));
    params.set("page_size", String(normalized.page_size));
    params.set("order", normalized.order);
  }

  return params;
}
