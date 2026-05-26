import { formatEntryDate } from "../lib/format";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EntriesListSection } from "../components/EntriesListSection";
import { EntryForm } from "../components/EntryForm";
import { FilterBar } from "../components/FilterBar";
import { useEntries } from "../hooks/useEntries";
import { useEntriesFilter } from "../hooks/useEntriesFilter";
import { useEntriesFilterActions } from "../hooks/useEntriesFilterActions";
import { useEntryDialogs } from "../hooks/useEntryDialogs";
import { useEntryMutations } from "../hooks/useEntryMutations";
import { useWorkTypes } from "../hooks/useWorkTypes";
import type { EntryFormData } from "../types";

export function EntriesPage() {
    const [filter, setFilter] = useEntriesFilter();
    const { applyFilterPatch, resetPage, setPage, setDateOrder, updateFilter } =
        useEntriesFilterActions(setFilter);

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

    const handleFormSubmit = (data: EntryFormData) => {
        if (modal.entry) {
            updateMutation.mutate(
                { id: modal.entry.id, data },
                { onSuccess: closeModal },
            );
            return;
        }

        createMutation.mutate(data, {
            onSuccess: () => {
                closeModal();
                resetPage();
            },
        });
    };

    const handleDeleteConfirm = () => {
        if (!deleteTarget) return;

        const wasLastOnPage = entries.length === 1;
        const currentPage = filter.page;

        deleteMutation.mutate(deleteTarget.id, {
            onSuccess: () => {
                closeDelete();
                if (wasLastOnPage && currentPage > 1) {
                    updateFilter({ page: currentPage - 1 });
                }
            },
        });
    };

    return (
        <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
            <div className="panel">
                <FilterBar
                    filter={filter}
                    onChange={applyFilterPatch}
                    onAdd={openCreate}
                    totalCount={totalCount}
                />

                <EntriesListSection
                    entries={entries}
                    totalCount={totalCount}
                    page={page}
                    pageSize={pageSize}
                    filter={filter}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    isError={isError}
                    error={error}
                    onDateOrderChange={setDateOrder}
                    onPageChange={setPage}
                    onEdit={openEdit}
                    onDelete={openDelete}
                />
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
