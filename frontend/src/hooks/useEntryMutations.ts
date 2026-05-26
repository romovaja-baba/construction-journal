import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createEntry, updateEntry, deleteEntry } from "../api/entries";
import { queryKeys } from "../lib/queryKeys";
import type { EntryFormData } from "../types";

export function useEntryMutations() {
    const queryClient = useQueryClient();

    const invalidateEntries = () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.entries.all });

    const createMutation = useMutation({
        mutationFn: createEntry,
        onSuccess: invalidateEntries,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: EntryFormData }) =>
            updateEntry(id, data),
        onSuccess: invalidateEntries,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteEntry,
        onSuccess: invalidateEntries,
    });

    return { createMutation, updateMutation, deleteMutation };
}
