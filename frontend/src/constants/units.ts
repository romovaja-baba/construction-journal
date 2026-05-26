export const ENTRY_UNITS = ['м²', 'м³', 'м.п.', 'шт.', 'т', 'кг', 'л'] as const;

export type EntryUnit = (typeof ENTRY_UNITS)[number];
