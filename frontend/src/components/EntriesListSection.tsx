import type {
    EntriesSortOrder,
    NormalizedEntriesFilter,
    WorkEntry,
} from "../types";
import { EntriesPagination } from "./EntriesPagination";
import { EntriesTable } from "./EntriesTable";

interface Props {
    entries: WorkEntry[];
    totalCount: number;
    page: number;
    pageSize: number;
    filter: NormalizedEntriesFilter;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    error: Error | null;
    onDateOrderChange: (order: EntriesSortOrder) => void;
    onPageChange: (page: number) => void;
    onEdit: (entry: WorkEntry) => void;
    onDelete: (entry: WorkEntry) => void;
}

export function EntriesListSection({
    entries,
    totalCount,
    page,
    pageSize,
    filter,
    isLoading,
    isFetching,
    isError,
    error,
    onDateOrderChange,
    onPageChange,
    onEdit,
    onDelete,
}: Props) {
    if (isError) {
        return (
            <p className="py-12 text-center text-sm text-red-800">
                Не удалось загрузить данные.
                {error?.message
                    ? ` ${error.message}`
                    : " Проверьте соединение с сервером."}
            </p>
        );
    }

    if (isLoading && entries.length === 0) {
        return (
            <p className="py-16 text-center font-mono text-xs uppercase tracking-wider text-journal-muted">
                Загрузка…
            </p>
        );
    }

    const showTable = !isLoading || entries.length > 0;
    if (!showTable) return null;

    return (
        <>
            <div className={isFetching ? "opacity-60" : undefined}>
                <EntriesTable
                    data={entries}
                    dateOrder={filter.order}
                    onDateOrderChange={onDateOrderChange}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
            <EntriesPagination
                page={page}
                pageSize={pageSize}
                total={totalCount}
                onPageChange={onPageChange}
            />
        </>
    );
}
