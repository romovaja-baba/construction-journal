import type { ReactNode } from "react";
import { FormAlert } from "./FormField";
import { Modal } from "./Modal";

interface Props {
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  pendingLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Подтвердить",
  pendingLabel,
  onConfirm,
  onClose,
  isLoading,
  error,
}: Props) {
  return (
    <Modal onClose={onClose} title={title} maxWidth="sm">
      <div className="p-5">
        <div className="text-sm text-journal-muted">{description}</div>
        {error && <FormAlert error={error} className="mt-3" />}
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Отмена
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="btn-danger"
          >
            {isLoading ? (pendingLabel ?? "…") : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
