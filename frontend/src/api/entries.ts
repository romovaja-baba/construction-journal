import type { WorkEntry, EntryFormData, EntriesFilter } from "../types";
import { entriesFilterToURLSearchParams } from "../lib/entriesFilter";
import { apiFetch } from "./client";

export interface EntriesResponse {
  items: WorkEntry[];
  total: number;
  page: number;
  page_size: number;
}

export const getEntries = (filter: EntriesFilter): Promise<EntriesResponse> => {
  const params = entriesFilterToURLSearchParams(filter, {
    omitDefaults: false,
  });
  return apiFetch<EntriesResponse>(`/entries?${params}`);
};

export const createEntry = (data: EntryFormData): Promise<WorkEntry> =>
  apiFetch<WorkEntry>("/entries", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateEntry = (
  id: number,
  data: EntryFormData,
): Promise<WorkEntry> =>
  apiFetch<WorkEntry>(`/entries/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteEntry = (id: number): Promise<void> =>
  apiFetch<void>(`/entries/${id}`, { method: "DELETE" });
