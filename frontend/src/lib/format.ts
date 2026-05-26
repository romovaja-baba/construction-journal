import type { EntryUnit } from "../constants/units";

const DATE_FORMAT: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
};

/** ISO date from API → value for `<input type="date">`. */
export function isoToDateInput(iso: string): string {
    return iso.substring(0, 10);
}

/** ISO date from API → localized display string. */
export function formatEntryDate(iso: string): string {
    return new Date(iso).toLocaleDateString("ru-RU", DATE_FORMAT);
}

export function formatVolume(volume: number, unit: EntryUnit): string {
    const v = volume % 1 === 0 ? volume.toFixed(0) : volume.toFixed(2);
    return `${v} ${unit}`;
}

export function declension(n: number, forms: [string, string, string]): string {
    const abs = Math.abs(n) % 100;
    const n1 = abs % 10;
    if (abs > 10 && abs < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
}
