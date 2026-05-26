import { useQuery } from "@tanstack/react-query";
import { getWorkTypes } from "../api/workTypes";
import { queryKeys } from "../lib/queryKeys";

export function useWorkTypes() {
    return useQuery({
        queryKey: queryKeys.workTypes.all,
        queryFn: getWorkTypes,
        staleTime: Infinity,
    });
}
