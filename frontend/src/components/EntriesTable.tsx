import { formatEntryDate, formatVolume } from "../lib/format";
import type { EntriesSortOrder, WorkEntry } from "../types";

interface Props {
  data: WorkEntry[];
  dateOrder: EntriesSortOrder;
  onDateOrderChange: (order: EntriesSortOrder) => void;
  onEdit: (entry: WorkEntry) => void;
  onDelete: (entry: WorkEntry) => void;
}

export function EntriesTable({
  data,
  dateOrder,
  onDateOrderChange,
  onEdit,
  onDelete,
}: Props) {
  const toggleDateOrder = () => {
    onDateOrderChange(dateOrder === "desc" ? "asc" : "desc");
  };

  const dateSortIcon = dateOrder === "asc" ? "▲" : "▼";

  if (data.length === 0) {
    return (
      <p className="py-14 text-center text-sm text-journal-muted">
        Записей нет. Нажмите «+ Запись».
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b-2 border-journal-border-dark bg-journal-subtle">
            <th
              className="cursor-pointer px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-journal-muted select-none hover:text-journal-ink"
              onClick={toggleDateOrder}
            >
              <span className="inline-flex items-center gap-1">
                Дата
                <span className="font-mono font-normal text-journal-border-dark">
                  {dateSortIcon}
                </span>
              </span>
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-journal-muted">
              Вид работ
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-journal-muted">
              Объём
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-journal-muted">
              Исполнитель
            </th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr
              key={entry.id}
              className="border-b border-journal-border hover:bg-journal-subtle/80"
            >
              <td className="px-4 py-2.5 align-top">
                <span className="font-mono text-journal-ink">
                  {formatEntryDate(entry.date)}
                </span>
              </td>
              <td className="px-4 py-2.5 align-top">
                {entry.work_type?.name ?? "—"}
              </td>
              <td className="px-4 py-2.5 align-top">
                <span className="font-mono tabular-nums text-journal-ink">
                  {formatVolume(entry.volume, entry.unit)}
                </span>
              </td>
              <td className="px-4 py-2.5 align-top">
                <span className="text-journal-muted">
                  {entry.executor_name}
                </span>
              </td>
              <td className="px-4 py-2.5 align-top">
                <div className="flex justify-end gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => onEdit(entry)}
                    className="border border-transparent px-1 py-0.5 text-journal-ink underline underline-offset-2 hover:border-journal-border"
                  >
                    Изм.
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry)}
                    className="border border-transparent px-1 py-0.5 text-red-900 underline underline-offset-2 hover:border-red-200"
                  >
                    Удал.
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
