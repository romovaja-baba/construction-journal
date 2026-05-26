export interface WorkType {
    id: number;
    name: string;
}

export interface WorkEntry {
    id: number;
    date: string;
    work_type_id: number;
    work_type: WorkType;
    volume: number;
    unit: string;
    executor_name: string;
    created_at: string;
    updated_at: string;
}

export interface EntryFormData {
    date: string;
    work_type_id: number;
    volume: number;
    unit: string;
    executor_name: string;
}

export type EntriesSortOrder = "asc" | "desc";

export interface EntriesFilter {
    date_from?: string;
    date_to?: string;
    page?: number;
    page_size?: number;
    order?: EntriesSortOrder;
}
