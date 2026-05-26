import { entriesFilterToURLSearchParams } from "../lib/entriesFilterUrl";
import type {
    WorkEntry,
    EntryFormData,
    NormalizedEntriesFilter,
} from "../types";
import { apiFetch } from "./client";

export interface EntriesResponse {
    items: WorkEntry[];
    total: number;
    page: number;
    page_size: number;
}

export const getEntries = (
    filter: NormalizedEntriesFilter,
): Promise<EntriesResponse> => {
    const params = entriesFilterToURLSearchParams(filter);
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
