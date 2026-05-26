import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createEntry, deleteEntry, getEntries, updateEntry } from "../../api/entries";
import { getWorkTypes } from "../../api/workTypes";
import { normalizeEntriesFilter } from "../../lib/entriesFilter";
import { queryKeys } from "../../lib/queryKeys";
import type { EntriesFilter, EntryFormData } from "../../types";

export function useEntries(filter: EntriesFilter) {
  const normalized = normalizeEntriesFilter(filter);

  const { data, ...rest } = useQuery({
    queryKey: queryKeys.entries.list(filter),
    queryFn: () => getEntries(normalized),
    placeholderData: keepPreviousData,
  });

  return {
    data: data?.items ?? [],
    totalCount: data?.total ?? 0,
    page: data?.page ?? normalized.page,
    pageSize: data?.page_size ?? normalized.page_size,
    ...rest,
  };
}

export function useWorkTypes() {
  return useQuery({
    queryKey: queryKeys.workTypes.all,
    queryFn: getWorkTypes,
    staleTime: Infinity,
  });
}

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
