import { useEffect, useId, useRef, type ReactNode } from "react";

interface Props {
    onClose: () => void;
    title: string;
    children: ReactNode;
    maxWidth?: "sm" | "md";
}

const maxWidthClass = { sm: "max-w-sm", md: "max-w-md" } as const;

const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ onClose, title, children, maxWidth = "md" }: Props) {
    const titleId = useId();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    useEffect(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const first = panel.querySelector<HTMLElement>(FOCUSABLE);
        first?.focus();
    }, []);

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={`panel w-full shadow-lg ${maxWidthClass[maxWidth]}`}
            >
                <div className="flex items-center justify-between border-b border-journal-border bg-journal-subtle px-4 py-3">
                    <h2
                        id={titleId}
                        className="text-sm font-semibold uppercase tracking-wide"
                    >
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="border border-journal-border px-2 py-0.5 text-xs text-journal-muted hover:border-journal-border-dark hover:text-journal-ink"
                        aria-label="Закрыть"
                    >
                        ESC
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
