import type { EntriesFilter } from "../types";
import { normalizeEntriesFilter } from "./entriesFilter";

export const queryKeys = {
  entries: {
    all: ["entries"] as const,
    list: (filter: EntriesFilter) =>
      ["entries", "list", normalizeEntriesFilter(filter)] as const,
  },
  workTypes: {
    all: ["work-types"] as const,
  },
};
