import { useEffect, useMemo, useState } from "react";
import { createEntry, getEntries, type TimeEntry } from "./api";
import { PROJECTS } from "./projects";
import { groupEntriesByDate, sumHours, todayISO } from "./utils";

type FormState = {
  date: string;
  project: string;
  hours: string;
  description: string;
};

export default function App() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    date: todayISO(),
    project: PROJECTS[0],
    hours: "",
    description: "",
  });

  async function loadEntries() {
    setError(null);
    setLoading(true);
    try {
      const data = await getEntries();
      setEntries(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadEntries();
  }, []);

  const grouped = useMemo(() => groupEntriesByDate(entries), [entries]);
  const grandTotal = useMemo(() => sumHours(entries), [entries]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!form.date || !form.project || !form.hours || !form.description) {
      setError("All fields are required");
      return;
    }

    const hoursNumber = Number(form.hours);
    if (!Number.isFinite(hoursNumber) || hoursNumber <= 0) {
      setError("Hours must be a positive number");
      return;
    }

    setSaving(true);
    try {
      await createEntry({
        date: form.date,
        project: form.project,
        hours: hoursNumber,
        description: form.description,
      });

      setForm((prev) => ({ ...prev, hours: "", description: "" }));
      await loadEntries();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app">
      <div className="header">
        <div>
          <h1 className="h1">Mini Time Tracker</h1>
          <p className="subtitle">React + TS • Express • Prisma • SQLite</p>
        </div>
      </div>

      <div className="grid">
        {/* Form */}
        <section className="card">
          <div className="card__body">
            <h2 className="card__title">Time Entry Form</h2>

            <form onSubmit={onSubmit} className="form">
              <div className="field">
                <span className="label">Date</span>
                <input
                  className="control"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </div>

              <div className="field">
                <span className="label">Project</span>
                <select
                  className="control"
                  value={form.project}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, project: e.target.value }))
                  }
                >
                  {PROJECTS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <span className="label">Hours</span>
                <input
                  className="control"
                  type="number"
                  min="0"
                  step="0.25"
                  value={form.hours}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, hours: e.target.value }))
                  }
                />
              </div>

              <div className="field">
                <span className="label">Work description</span>
                <textarea
                  className="control"
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>

              <div className="actions">
                <button className="button" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <span className="hint">Max 24 hours per day</span>
              </div>

              {error && <div className="alert">{error}</div>}
            </form>
          </div>
        </section>

        {/* History */}
        <section className="card">
          <div className="card__body">
            <div className="history__header">
              <h2 className="card__title">Entry History</h2>
              <div className="total">Grand total: {grandTotal}</div>
            </div>

            {loading ? (
              <div className="hint">Loading...</div>
            ) : (
              <>
                {Object.keys(grouped)
                  .sort((a, b) => b.localeCompare(a))
                  .map((date) => {
                    const dayEntries = grouped[date];
                    const dayTotal = sumHours(dayEntries);

                    return (
                      <div key={date} className="day">
                        <h3 className="day__title">
                          {date} — total: {dayTotal}
                        </h3>

                        <div className="tableWrap">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Project</th>
                                <th>Hours</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dayEntries.map((e) => (
                                <tr key={e.id}>
                                  <td>{e.project}</td>
                                  <td>{e.hours}</td>
                                  <td>{e.description}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
