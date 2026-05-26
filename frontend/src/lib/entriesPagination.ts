import type { EntriesSortOrder } from "../types";

export const DEFAULT_ENTRIES_PAGE = 1;
export const DEFAULT_ENTRIES_PAGE_SIZE = 25;
export const DEFAULT_ENTRIES_ORDER: EntriesSortOrder = "desc";

export function totalPages(total: number, pageSize: number): number {
  if (total === 0) return 1;
  return Math.ceil(total / pageSize);
}
