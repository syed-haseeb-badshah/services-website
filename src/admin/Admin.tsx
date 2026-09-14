import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { groups } from "../content";
import { api, exportCsv, type List, type Settings } from "../lib/api";
import "./admin.css";
type Row = Record<string, unknown> & { id: string };
const sections = [
  "dashboard",
  "leads",
  "services",
  "revenue",
  "newsletter",
  "settings",
  "audit-log",
];
const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : "Unable to complete request";
function display(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}
export default function Admin() {
  const [email, setEmail] = useState<string | null>(null),
    [checking, setChecking] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    api<{ email: string }>("/admin/me")
      .then((user) => setEmail(user.email))
      .catch(() => setEmail(null))
      .finally(() => setChecking(false));
  }, []);
  if (checking)
    return (
      <main className="admin-shell" role="status">
        Checking session…
      </main>
    );
  if (!email) return <Login onLogin={setEmail} />;
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <Link to="/admin">Aster Digital / Admin</Link>
        <span>{email}</span>
        <Link to="/">View website</Link>
        <button
          onClick={async () => {
            try {
              await api("/admin/logout", { method: "POST" });
              setEmail(null);
            } catch (error) {
              setError(messageOf(error));
            }
          }}
        >
          Sign out
        </button>
      </header>
      <nav aria-label="Admin navigation">
        {sections.map((section) => (
          <NavLink
            key={section}
            to={section === "dashboard" ? "/admin" : "/admin/" + section}
            end
          >
            {section.replace("-", " ")}
          </NavLink>
        ))}
      </nav>
      {error && <p role="alert">{error}</p>}
      <main>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="settings"
            element={<SettingsPage onPasswordChanged={() => setEmail(null)} />}
          />
          {["leads", "services", "revenue", "newsletter", "audit-log"].map(
            (kind) => (
              <Route
                key={kind}
                path={kind}
                element={<Records key={kind} kind={kind} />}
              />
            ),
          )}
          <Route
            path="*"
            element={
              <p>
                Page not found. <Link to="/admin">Dashboard</Link>
              </p>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
function Login({ onLogin }: { onLogin: (email: string) => void }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const navigate = useNavigate();
  return (
    <main className="admin-shell admin-login">
      <p>Aster Digital</p>
      <h1>Studio administration</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy) return;
          setBusy(true);
          setError("");
          const form = new FormData(event.currentTarget);
          try {
            const result = await api<{ email: string }>("/admin/login", {
              method: "POST",
              body: {
                email: form.get("email"),
                password: form.get("password"),
              },
            });
            onLogin(result.email);
            navigate("/admin");
          } catch (error) {
            setError(messageOf(error));
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Email
          <input name="email" type="email" autoComplete="username" required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <Link to="/">Back to website</Link>
    </main>
  );
}
type Summary = {
  newLeads: number;
  services: number;
  subscribers: number;
  pendingDeliveries: number;
  failedDeliveries: number;
  year: number;
  totals: { currency: string; status: string; _sum: { amount: string } }[];
  months: { currency: string; _sum: { amount: string } }[][];
};
function Dashboard() {
  const [data, setData] = useState<Summary>(),
    [error, setError] = useState("");
  useEffect(() => {
    api<Summary>("/admin/dashboard/summary")
      .then(setData)
      .catch((error) => setError(messageOf(error)));
  }, []);
  if (!data) return <p role="status">{error || "Loading dashboard…"}</p>;
  return (
    <>
      <h1>Studio overview</h1>
      <div className="admin-kpis">
        {[
          ["Leads in the last 7 days", data.newLeads],
          ["Published services", data.services],
          ["Confirmed subscribers", data.subscribers],
          ["Pending deliveries", data.pendingDeliveries],
        ].map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      {data.failedDeliveries > 0 && (
        <p role="alert">
          {data.failedDeliveries} deliveries need attention. Check the API logs
          and provider configuration.
        </p>
      )}
      <h2>Revenue by currency and status</h2>
      <div className="admin-kpis">
        {data.totals.map((item) => (
          <article key={item.currency + item.status}>
            <span>
              {item.currency} · {item.status}
            </span>
            <strong>
              {new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: item.currency,
              }).format(Number(item._sum.amount))}
            </strong>
          </article>
        ))}
        {!data.totals.length && <p>No revenue recorded yet.</p>}
      </div>
      <h2>Paid revenue · {data.year}</h2>
      {["GBP", "USD", "EUR"].map((currency) => {
        const values = data.months.map((rows) =>
          Number(
            rows.find((row) => row.currency === currency)?._sum.amount || 0,
          ),
        );
        const max = Math.max(...values, 1);
        return (
          <section className="admin-chart" key={currency}>
            <h3>
              {currency} · year total{" "}
              {values.reduce((sum, value) => sum + value, 0).toFixed(2)}
            </h3>
            <div className="chart-bars">
              {values.map((value, i) => (
                <div key={i}>
                  <span
                    className="chart-bar"
                    style={{ height: `${Math.max(2, (value / max) * 130)}px` }}
                    title={`${currency} ${value.toFixed(2)}`}
                  />
                  <small>
                    {new Date(2026, i).toLocaleString("en-GB", {
                      month: "short",
                    })}
                  </small>
                  <small>{value.toFixed(2)}</small>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
const columns: Record<string, string[]> = {
  leads: ["name", "email", "serviceName", "status", "createdAt"],
  services: ["name", "group", "isPublished", "sortOrder"],
  revenue: ["clientName", "amount", "currency", "status", "invoicedAt"],
  newsletter: ["email", "isConfirmed", "unsubscribedAt", "createdAt"],
  "audit-log": ["adminId", "action", "entity", "entityId", "createdAt"],
};
function Records({ kind }: { kind: string }) {
  const [data, setData] = useState<List<Row>>({ items: [], total: 0, page: 1 }),
    [page, setPage] = useState(1),
    [filter, setFilter] = useState(""),
    [revision, setRevision] = useState(0);
  const [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [selected, setSelected] = useState<Row | null>(),
    [busy, setBusy] = useState(false);
  const query = `?page=${page}&limit=25${filter}`;
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api<List<Row>>(`/admin/${kind}${query}`)
      .then((data) => {
        if (active) setData(data);
      })
      .catch((error) => {
        if (active) setError(messageOf(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [kind, query, revision]);
  const refresh = () => {
    setSelected(undefined);
    setRevision((x) => x + 1);
  };
  async function action(path: string, method: string, body?: unknown) {
    setBusy(true);
    setError("");
    try {
      await api(path, { method, body });
      refresh();
    } catch (error) {
      setError(messageOf(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="admin-title">
        <h1>{kind.replace("-", " ")}</h1>
        {["services", "revenue"].includes(kind) && (
          <button onClick={() => setSelected(null)}>
            Add {kind === "services" ? "service" : "revenue entry"}
          </button>
        )}
        {["leads", "newsletter", "revenue"].includes(kind) && (
          <button
            onClick={() => {
              void exportCsv(
                `/admin/${kind}/export${query}`,
                `${kind}.csv`,
              ).catch((error) => setError(messageOf(error)));
            }}
          >
            Export all matching records (CSV)
          </button>
        )}
      </div>
      {kind === "leads" && (
        <form
          className="admin-filters"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const params = new URLSearchParams();
            for (const [key, value] of data)
              if (value) params.set(key, String(value));
            setFilter("&" + params.toString());
            setPage(1);
          }}
        >
          <label>
            Status
            <select name="status">
              <option value="">All</option>
              {["new", "contacted", "qualified", "won", "lost"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Service name
            <input name="service" />
          </label>
          <label>
            From
            <input name="from" type="date" />
          </label>
          <label>
            To
            <input name="to" type="date" />
          </label>
          <button>Apply filters</button>
        </form>
      )}
      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p role="status">Loading…</p>
      ) : (
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                {columns[kind].map((column) => (
                  <th key={column}>{column.replace(/([A-Z])/g, " $1")}</th>
                ))}
                {kind !== "audit-log" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {data.items.map((row, index) => (
                <tr key={row.id}>
                  {columns[kind].map((column) => (
                    <td key={column}>{display(row[column])}</td>
                  ))}
                  {kind !== "audit-log" && (
                    <td>
                      <div className="row-actions">
                        {kind !== "newsletter" && (
                          <button onClick={() => setSelected(row)}>
                            {kind === "leads" ? "View / edit" : "Edit"}
                          </button>
                        )}
                        {kind === "services" && (
                          <>
                            <button
                              disabled={busy || index === 0}
                              aria-label={`Move ${row.name} up`}
                              onClick={() => {
                                const rows = [...data.items];
                                [rows[index - 1], rows[index]] = [
                                  rows[index],
                                  rows[index - 1],
                                ];
                                void action(
                                  "/admin/services/reorder",
                                  "PATCH",
                                  { ids: rows.map((x) => x.id) },
                                );
                              }}
                            >
                              ↑
                            </button>
                            <button
                              disabled={busy}
                              onClick={() => {
                                const {
                                  id: _id,
                                  createdAt: _c,
                                  updatedAt: _u,
                                  ...service
                                } = row;
                                void action(
                                  `/admin/services/${row.id}`,
                                  "PUT",
                                  { ...service, isPublished: !row.isPublished },
                                );
                              }}
                            >
                              {row.isPublished ? "Unpublish" : "Publish"}
                            </button>
                          </>
                        )}
                        {kind === "newsletter" ? (
                          <button
                            disabled={busy || !!row.unsubscribedAt}
                            onClick={() => {
                              void action(
                                `/admin/newsletter/${row.id}`,
                                "PATCH",
                                { unsubscribe: true },
                              );
                            }}
                          >
                            Unsubscribe
                          </button>
                        ) : (
                          <button
                            disabled={busy}
                            onClick={() => {
                              if (
                                window.confirm(
                                  kind === "services"
                                    ? "Unpublish this service?"
                                    : "Delete this record?",
                                )
                              )
                                void action(
                                  `/admin/${kind}/${row.id}`,
                                  "DELETE",
                                );
                            }}
                          >
                            {kind === "services" ? "Remove" : "Delete"}
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {!data.items.length && <p>No records found.</p>}
        </div>
      )}
      <div className="admin-pagination">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage((x) => x - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} · {data.total} records
        </span>
        <button
          disabled={page * 25 >= data.total || loading}
          onClick={() => setPage((x) => x + 1)}
        >
          Next
        </button>
      </div>
      {selected !== undefined && (
        <Editor
          key={selected?.id || "new"}
          kind={kind}
          row={selected}
          onClose={() => setSelected(undefined)}
          onSaved={refresh}
        />
      )}
    </>
  );
}
function Editor({
  kind,
  row,
  onClose,
  onSaved,
}: {
  kind: string;
  row: Row | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const defaults: Record<string, unknown> = row || {};
  const input = (
    name: string,
    label: string,
    type = "text",
    required = false,
  ) => (
    <label>
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={
          display(defaults[name]) === "—" ? "" : String(defaults[name])
        }
      />
    </label>
  );
  const select = (
    name: string,
    label: string,
    values: string[],
    fallback: string,
  ) => (
    <label>
      {label}
      <select name={name} defaultValue={String(defaults[name] || fallback)}>
        {values.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
    </label>
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    let body: Record<string, unknown> = data;
    if (kind === "services")
      body = {
        ...data,
        deliverables: String(data.deliverables)
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean),
        isPublished: data.isPublished === "on",
        sortOrder: Number(data.sortOrder),
      };
    if (kind === "revenue")
      body = {
        ...data,
        leadId: data.leadId || null,
        invoicedAt: new Date(String(data.invoicedAt)).toISOString(),
        paidAt: data.paidAt
          ? new Date(String(data.paidAt)).toISOString()
          : null,
      };
    try {
      await api(`/admin/${kind}${row ? "/" + row.id : ""}`, {
        method: kind === "leads" ? "PATCH" : row ? "PUT" : "POST",
        body,
      });
      onSaved();
    } catch (error) {
      setError(messageOf(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="admin-editor" aria-label={`${kind} editor`}>
      <div className="admin-title">
        <h2>{row ? "Edit record" : "Create record"}</h2>
        <button onClick={onClose}>Close</button>
      </div>
      {kind === "leads" && (
        <dl>
          {Object.entries(defaults)
            .filter(([key]) => !["notes", "status"].includes(key))
            .map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{display(value)}</dd>
              </div>
            ))}
        </dl>
      )}
      <form onSubmit={submit}>
        {kind === "leads" && (
          <>
            {select(
              "status",
              "Status",
              ["new", "contacted", "qualified", "won", "lost"],
              "new",
            )}
            <label>
              Internal notes
              <textarea
                name="notes"
                defaultValue={String(defaults.notes || "")}
                rows={5}
              />
            </label>
          </>
        )}
        {kind === "services" && (
          <>
            {input("name", "Service name", "text", true)}
            {input(
              "slug",
              "URL slug (changing this changes the service URL)",
              "text",
              true,
            )}
            {select("group", "Group", groups.slice(1), groups[1])}
            <label>
              Summary
              <textarea
                name="summary"
                required
                defaultValue={String(defaults.summary || "")}
              />
            </label>
            <label>
              Deliverables (one per line)
              <textarea
                name="deliverables"
                rows={6}
                required
                defaultValue={((defaults.deliverables as string[]) || []).join(
                  "\n",
                )}
              />
            </label>
            <label>
              Display order
              <input
                name="sortOrder"
                type="number"
                min={0}
                max={10000}
                defaultValue={Number(defaults.sortOrder || 0)}
                required
              />
            </label>
            <label className="checkbox">
              <input
                name="isPublished"
                type="checkbox"
                defaultChecked={Boolean(defaults.isPublished)}
              />
              Published
            </label>
          </>
        )}
        {kind === "revenue" && (
          <>
            {input("clientName", "Client", "text", true)}
            {input("serviceName", "Service")}
            {input("leadId", "Related lead ID (optional)")}
            <label>
              Amount
              <input
                name="amount"
                inputMode="decimal"
                pattern="[0-9]+(\.[0-9]{1,2})?"
                required
                defaultValue={String(defaults.amount || "")}
              />
            </label>
            {select("currency", "Currency", ["GBP", "USD", "EUR"], "GBP")}
            {select(
              "status",
              "Status",
              ["invoiced", "paid", "overdue", "refunded"],
              "invoiced",
            )}
            <label>
              Invoiced date
              <input
                name="invoicedAt"
                type="date"
                required
                defaultValue={String(
                  defaults.invoicedAt || new Date().toISOString(),
                ).slice(0, 10)}
              />
            </label>
            <label>
              Paid date (required for paid entries)
              <input
                name="paidAt"
                type="date"
                defaultValue={String(defaults.paidAt || "").slice(0, 10)}
              />
            </label>
            <label>
              Notes
              <textarea
                name="notes"
                defaultValue={String(defaults.notes || "")}
              />
            </label>
          </>
        )}
        {error && <p role="alert">{error}</p>}
        <button disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
      </form>
    </section>
  );
}
function SettingsPage({
  onPasswordChanged,
}: {
  onPasswordChanged: () => void;
}) {
  const [data, setData] = useState<{
      settings: Settings;
      secrets: Record<string, boolean>;
    }>(),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    api<{ settings: Settings; secrets: Record<string, boolean> }>(
      "/admin/settings",
    )
      .then(setData)
      .catch((error) => setMessage(messageOf(error)));
  }, []);
  return (
    <>
      <h1>Settings</h1>
      <p role="status">{message}</p>
      {data && (
        <>
          <form
            className="admin-settings"
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              const body = Object.fromEntries(
                new FormData(event.currentTarget),
              );
              try {
                await api("/admin/settings", { method: "PUT", body });
                setMessage(
                  "Settings saved. Public pages use the new values when loaded.",
                );
              } catch (error) {
                setMessage(messageOf(error));
              } finally {
                setBusy(false);
              }
            }}
          >
            {Object.entries(data.settings)
              .filter(([key]) => key.includes("."))
              .map(([key, value]) => (
                <label key={key}>
                  {key.replaceAll(".", " / ").replaceAll("_", " ")}
                  <input name={key} defaultValue={String(value)} />
                </label>
              ))}
            <button disabled={busy}>Save settings</button>
          </form>
          <h2>Integration secrets</h2>
          <p>
            Secrets are set in the API environment and never returned to the
            browser.
          </p>
          <dl>
            {Object.entries(data.secrets).map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value ? "Configured" : "Not configured"}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
      <h2>Change password</h2>
      <form
        className="admin-settings"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          const body = Object.fromEntries(new FormData(event.currentTarget));
          try {
            await api("/admin/password", { method: "POST", body });
            onPasswordChanged();
          } catch (error) {
            setMessage(messageOf(error));
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Current password
          <input
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <label>
          New password (at least 12 characters)
          <input
            name="password"
            type="password"
            minLength={12}
            maxLength={72}
            autoComplete="new-password"
            required
          />
        </label>
        <button disabled={busy}>Change password and sign out</button>
      </form>
    </>
  );
}
