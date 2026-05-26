import { totalPages } from "../lib/entriesPagination";

interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function EntriesPagination({
  page,
  pageSize,
  total,
  onPageChange,
}: Props) {
  const pages = totalPages(total, pageSize);
  if (total <= pageSize) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-journal-border px-4 py-3">
      <p className="font-mono text-xs text-journal-muted">
        {from}–{to} из {total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn-secondary px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Назад
        </button>
        <span className="font-mono text-xs text-journal-muted">
          {page} / {pages}
        </span>
        <button
          type="button"
          className="btn-secondary px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          Вперёд
        </button>
      </div>
    </div>
  );
}
