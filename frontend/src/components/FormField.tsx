import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, error, children, className }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-journal-muted">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-800">{error}</p>}
    </div>
  );
}

interface FormAlertProps {
  error: Error;
  className?: string;
}

export function FormAlert({ error, className }: FormAlertProps) {
  return <p className={`alert-error ${className ?? ""}`.trim()}>{error.message}</p>;
}
