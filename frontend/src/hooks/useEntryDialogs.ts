import { useCallback, useState } from "react";
import type { WorkEntry } from "../types";

interface ModalState {
    open: boolean;
    entry?: WorkEntry;
}

interface MutationLike {
    reset: () => void;
    error: Error | null;
    isPending: boolean;
}

interface Mutations {
    createMutation: MutationLike;
    updateMutation: MutationLike;
    deleteMutation: MutationLike;
}

export function useEntryDialogs({
    createMutation,
    updateMutation,
    deleteMutation,
}: Mutations) {
    const [modal, setModal] = useState<ModalState>({ open: false });
    const [deleteTarget, setDeleteTarget] = useState<WorkEntry | null>(null);

    const resetFormMutations = useCallback(() => {
        createMutation.reset();
        updateMutation.reset();
    }, [createMutation, updateMutation]);

    const setModalOpen = useCallback(
        (open: boolean, entry?: WorkEntry) => {
            resetFormMutations();
            setModal(
                open
                    ? entry
                        ? { open: true, entry }
                        : { open: true }
                    : { open: false },
            );
        },
        [resetFormMutations],
    );

    const openCreate = useCallback(() => setModalOpen(true), [setModalOpen]);

    const openEdit = useCallback(
        (entry: WorkEntry) => setModalOpen(true, entry),
        [setModalOpen],
    );

    const closeModal = useCallback(() => setModalOpen(false), [setModalOpen]);

    const openDelete = useCallback(
        (entry: WorkEntry) => {
            deleteMutation.reset();
            setDeleteTarget(entry);
        },
        [deleteMutation],
    );

    const closeDelete = useCallback(() => {
        deleteMutation.reset();
        setDeleteTarget(null);
    }, [deleteMutation]);

    return {
        modal,
        deleteTarget,
        openCreate,
        openEdit,
        closeModal,
        openDelete,
        closeDelete,
        formError: createMutation.error ?? updateMutation.error,
        isFormPending: createMutation.isPending || updateMutation.isPending,
        isDeletePending: deleteMutation.isPending,
    };
}
