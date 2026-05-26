import { declension } from "../lib/format";
import type { EntriesFilter } from "../types";

interface Props {
  filter: EntriesFilter;
  onChange: (filter: EntriesFilter) => void;
  onAdd: () => void;
  totalCount: number;
}

export function FilterBar({ filter, onChange, onAdd, totalCount }: Props) {
  const hasFilter = filter.date_from || filter.date_to;

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-journal-border bg-journal-subtle px-4 py-3">
      <span className="text-xs font-medium uppercase tracking-wide text-journal-muted">
        Период
      </span>
      <input
        type="date"
        value={filter.date_from ?? ""}
        onChange={(e) =>
          onChange({ ...filter, date_from: e.target.value || undefined })
        }
        className="input-field w-auto"
        aria-label="Дата с"
      />
      <span className="text-journal-muted">—</span>
      <input
        type="date"
        value={filter.date_to ?? ""}
        min={filter.date_from}
        onChange={(e) =>
          onChange({ ...filter, date_to: e.target.value || undefined })
        }
        className="input-field w-auto"
        aria-label="Дата по"
      />

      {hasFilter && (
        <button
          type="button"
          onClick={() => onChange({})}
          className="text-xs text-journal-muted underline underline-offset-2 hover:text-journal-ink"
        >
          Сбросить
        </button>
      )}

      <span className="hidden font-mono text-xs text-journal-muted sm:inline">
        {totalCount}{" "}
        {declension(totalCount, ["запись", "записи", "записей"])}
      </span>

      <div className="flex-1" />

      <button type="button" onClick={onAdd} className="btn-primary">
        + Запись
      </button>
    </div>
  );
}
