import type { ReactNode } from "react";

interface PrimaryAction {
    label: string;
    pendingLabel?: string;
    type?: "submit" | "button";
    onClick?: () => void;
    disabled?: boolean;
    isLoading?: boolean;
}

interface Props {
    onCancel: () => void;
    cancelLabel?: string;
    primary: PrimaryAction;
    danger?: boolean;
    bordered?: boolean;
    className?: string;
    children?: ReactNode;
}

export function ModalFooter({
    onCancel,
    cancelLabel = "Отмена",
    primary,
    danger = false,
    bordered = true,
    className,
    children,
}: Props) {
    const primaryClass = danger ? "btn-danger" : "btn-primary flex-1";
    const rootClass = [
        "flex gap-2",
        bordered ? "border-t border-journal-border pt-4" : "mt-5",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={rootClass}>
            {children}
            <button
                type="button"
                onClick={onCancel}
                className="btn-secondary flex-1"
            >
                {cancelLabel}
            </button>
            <button
                type={primary.type ?? "button"}
                onClick={primary.onClick}
                disabled={primary.disabled ?? primary.isLoading}
                className={primaryClass}
            >
                {primary.isLoading
                    ? (primary.pendingLabel ?? "…")
                    : primary.label}
            </button>
        </div>
    );
}
