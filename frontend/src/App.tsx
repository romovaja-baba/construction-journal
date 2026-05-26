import { EntriesPage } from "./features/entries/EntriesPage";

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b-4 border-journal-accent bg-journal-header text-white">
        <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-4 px-4 py-3 sm:px-6">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            Журнал выполненных работ
          </h1>
        </div>
      </header>

      <EntriesPage />
    </div>
  );
}
