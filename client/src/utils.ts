import type { TimeEntry } from "./api";

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function groupEntriesByDate(
  entries: TimeEntry[],
): Record<string, TimeEntry[]> {
  return entries.reduce<Record<string, TimeEntry[]>>((acc, item) => {
    (acc[item.date] ??= []).push(item);
    return acc;
  }, {});
}

export function sumHours(entries: TimeEntry[]): number {
  return entries.reduce((sum, e) => sum + e.hours, 0);
}
