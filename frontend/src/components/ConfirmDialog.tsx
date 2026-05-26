import type { ReactNode } from "react";
import { ApiErrorMessage } from "./ApiErrorMessage";
import { Modal } from "./Modal";
import { ModalFooter } from "./ModalFooter";

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
                {error && (
                    <ApiErrorMessage error={error} asAlert className="mt-3" />
                )}
                <ModalFooter
                    onCancel={onClose}
                    bordered={false}
                    danger
                    primary={{
                        label: confirmLabel,
                        pendingLabel,
                        onClick: onConfirm,
                        isLoading,
                    }}
                />
            </div>
        </Modal>
    );
}
