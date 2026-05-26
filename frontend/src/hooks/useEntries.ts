import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getEntries } from "../api/entries";
import { queryKeys } from "../lib/queryKeys";
import type { NormalizedEntriesFilter } from "../types";

export function useEntries(filter: NormalizedEntriesFilter) {
    const { data, ...rest } = useQuery({
        queryKey: queryKeys.entries.list(filter),
        queryFn: () => getEntries(filter),
        placeholderData: keepPreviousData,
    });

    return {
        data: data?.items ?? [],
        totalCount: data?.total ?? 0,
        page: data?.page ?? filter.page,
        pageSize: data?.page_size ?? filter.page_size,
        ...rest,
    };
}
