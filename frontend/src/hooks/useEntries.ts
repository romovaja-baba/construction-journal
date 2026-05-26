import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getEntries } from "../api/entries";
import { normalizeEntriesFilter } from "../lib/entriesFilter";
import { queryKeys } from "../lib/queryKeys";
import type { EntriesFilter } from "../types";

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
