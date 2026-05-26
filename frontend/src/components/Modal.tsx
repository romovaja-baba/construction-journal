import { useEffect, useId, type ReactNode } from 'react';

interface Props {
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md';
}

const maxWidthClass = { sm: 'max-w-sm', md: 'max-w-md' } as const;

export function Modal({ onClose, title, children, maxWidth = 'md' }: Props) {
  const titleId = useId();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`panel w-full shadow-lg ${maxWidthClass[maxWidth]}`}
      >
        <div className="flex items-center justify-between border-b border-journal-border bg-journal-subtle px-4 py-3">
          <h2 id={titleId} className="text-sm font-semibold uppercase tracking-wide">
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
