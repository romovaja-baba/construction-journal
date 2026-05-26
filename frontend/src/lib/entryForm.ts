import { ENTRY_UNITS } from "../constants/units";
import type { WorkEntry, EntryFormData } from "../types";
import { isoToDateInput } from "./format";

export function entryToFormData(entry: WorkEntry): EntryFormData {
    return {
        date: isoToDateInput(entry.date),
        work_type_id: entry.work_type_id,
        volume: entry.volume,
        unit: entry.unit,
        executor_name: entry.executor_name,
    };
}

export const defaultEntryFormValues: Partial<EntryFormData> = {
    unit: ENTRY_UNITS[0],
};
