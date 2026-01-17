export type TimeEntry = {
  id: number;
  date: string;
  project: string;
  hours: number;
  description: string;
  createdAt: string;
};

const API_BASE_URL = "http://localhost:4000";

export async function getEntries(): Promise<TimeEntry[]> {
  const res = await fetch(`${API_BASE_URL}/api/entries`);
  if (!res.ok) throw new Error("Failed to load entries");
  return res.json();
}

export async function createEntry(input: {
  date: string;
  project: string;
  hours: number;
  description: string;
}): Promise<TimeEntry> {
  const res = await fetch(`${API_BASE_URL}/api/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message ?? "Failed to create entry");
  }

  return data;
}
