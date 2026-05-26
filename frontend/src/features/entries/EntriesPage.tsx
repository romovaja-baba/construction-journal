import { useCallback } from "react";
import { EntriesTable } from "../../components/EntriesTable";
import { EntriesPagination } from "../../components/EntriesPagination";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { EntryForm } from "../../components/EntryForm";
import { FilterBar } from "../../components/FilterBar";
import { formatEntryDate } from "../../lib/format";
import {
  DEFAULT_ENTRIES_ORDER,
  DEFAULT_ENTRIES_PAGE,
  DEFAULT_ENTRIES_PAGE_SIZE,
} from "../../lib/entriesPagination";
import { useEntries, useEntryMutations, useWorkTypes } from "./hooks";
import { useEntryDialogs } from "./useEntryDialogs";
import { useEntriesFilter } from "./useEntriesFilter";
import type { EntryFormData, EntriesFilter, EntriesSortOrder } from "../../types";

export function EntriesPage() {
  const [filter, setFilter] = useEntriesFilter();
  const {
    data: entries = [],
    totalCount,
    page,
    pageSize,
    isLoading,
    isError,
    error,
    isFetching,
  } = useEntries(filter);
  const { data: workTypes = [] } = useWorkTypes();
  const { createMutation, updateMutation, deleteMutation } =
    useEntryMutations();
  const {
    modal,
    deleteTarget,
    openCreate,
    openEdit,
    closeModal,
    openDelete,
    closeDelete,
    formError,
    isFormPending,
    isDeletePending,
  } = useEntryDialogs({ createMutation, updateMutation, deleteMutation });

  const handleFilterChange = useCallback(
    (next: EntriesFilter) => {
      setFilter((prev) => ({
        ...next,
        page: DEFAULT_ENTRIES_PAGE,
        page_size: prev.page_size ?? DEFAULT_ENTRIES_PAGE_SIZE,
        order: prev.order ?? DEFAULT_ENTRIES_ORDER,
      }));
    },
    [setFilter],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setFilter((prev) => ({ ...prev, page: nextPage }));
    },
    [setFilter],
  );

  const handleDateOrderChange = useCallback(
    (order: EntriesSortOrder) => {
      setFilter((prev) => ({
        ...prev,
        order,
        page: DEFAULT_ENTRIES_PAGE,
      }));
    },
    [setFilter],
  );

  const handleFormSubmit = (data: EntryFormData) => {
    if (modal.entry) {
      updateMutation.mutate(
        { id: modal.entry.id, data },
        { onSuccess: closeModal },
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          closeModal();
          setFilter((prev) => ({ ...prev, page: DEFAULT_ENTRIES_PAGE }));
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const wasLastOnPage = entries.length === 1;
    const currentPage = filter.page ?? DEFAULT_ENTRIES_PAGE;

    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        closeDelete();
        if (wasLastOnPage && currentPage > 1) {
          setFilter((prev) => ({ ...prev, page: currentPage - 1 }));
        }
      },
    });
  };

  const showTable = !isError && (!isLoading || entries.length > 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
      <div className="panel">
        <FilterBar
          filter={filter}
          onChange={handleFilterChange}
          onAdd={openCreate}
          totalCount={totalCount}
        />

        {isError ? (
          <p className="py-12 text-center text-sm text-red-800">
            Не удалось загрузить данные.
            {error?.message
              ? ` ${error.message}`
              : " Проверьте соединение с сервером."}
          </p>
        ) : isLoading && entries.length === 0 ? (
          <p className="py-16 text-center font-mono text-xs uppercase tracking-wider text-journal-muted">
            Загрузка…
          </p>
        ) : showTable ? (
          <>
            <div className={isFetching ? "opacity-60" : undefined}>
              <EntriesTable
                data={entries}
                dateOrder={filter.order ?? DEFAULT_ENTRIES_ORDER}
                onDateOrderChange={handleDateOrderChange}
                onEdit={openEdit}
                onDelete={openDelete}
              />
            </div>
            <EntriesPagination
              page={page}
              pageSize={pageSize}
              total={totalCount}
              onPageChange={handlePageChange}
            />
          </>
        ) : null}
      </div>

      {modal.open && (
        <EntryForm
          workTypes={workTypes}
          initial={modal.entry}
          onSubmit={handleFormSubmit}
          onClose={closeModal}
          isLoading={isFormPending}
          error={formError}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Удалить запись"
          description={
            <>
              <p>
                {deleteTarget.work_type?.name} ·{" "}
                {formatEntryDate(deleteTarget.date)}
              </p>
              <p className="mt-1 text-xs">Действие необратимо.</p>
            </>
          }
          confirmLabel="Удалить"
          pendingLabel="Удаление…"
          onConfirm={handleDeleteConfirm}
          onClose={closeDelete}
          isLoading={isDeletePending}
          error={deleteMutation.error}
        />
      )}
    </main>
  );
}
