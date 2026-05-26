import { useCallback, useState } from "react";
import type { WorkEntry } from "../../types";

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

  const openCreate = useCallback(() => {
    resetFormMutations();
    setModal({ open: true });
  }, [resetFormMutations]);

  const openEdit = useCallback(
    (entry: WorkEntry) => {
      resetFormMutations();
      setModal({ open: true, entry });
    },
    [resetFormMutations],
  );

  const closeModal = useCallback(() => {
    resetFormMutations();
    setModal({ open: false });
  }, [resetFormMutations]);

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
