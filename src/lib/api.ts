export const API = import.meta.env.VITE_API_URL || "";
let csrfToken = "";
let refreshing: Promise<void> | null = null;
export async function api<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown } = {},
  retry = true,
): Promise<T> {
  const admin = path.startsWith("/admin");
  const method = options.method || "GET";
  if (admin && method !== "GET" && path !== "/admin/login" && !csrfToken) {
    const response = await fetch(API + "/api/admin/csrf", {
      credentials: "include",
    });
    csrfToken = (await response.json()).csrfToken;
  }
  const response = await fetch(API + "/api" + path, {
    method,
    credentials: admin ? "include" : "omit",
    headers: {
      ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
      ...(admin && csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    ...(method !== "GET" ? { body: JSON.stringify(options.body || {}) } : {}),
  });
  if (
    response.status === 401 &&
    admin &&
    !["/admin/login", "/admin/refresh"].includes(path) &&
    retry
  ) {
    refreshing ||= api<{ csrfToken: string }>(
      "/admin/refresh",
      { method: "POST" },
      false,
    )
      .then((data) => {
        csrfToken = data.csrfToken;
      })
      .finally(() => {
        refreshing = null;
      });
    await refreshing;
    return api<T>(path, options, false);
  }
  const data = await response
    .json()
    .catch(() => ({ error: "Server returned an unreadable response" }));
  if (!response.ok)
    throw new Error(data.error || `Request failed (${response.status})`);
  if (data.csrfToken) csrfToken = data.csrfToken;
  return data as T;
}
export type ServiceRow = {
  id: string;
  name: string;
  slug: string;
  group: string;
  summary: string;
  deliverables: string[];
  isPublished: boolean;
  sortOrder: number;
};
export type List<T> = { items: T[]; total: number; page: number };
export type Settings = Record<string, string | boolean>;
export async function allServices() {
  const rows: ServiceRow[] = [];
  let page = 1;
  while (true) {
    const result = await api<List<ServiceRow>>(
      `/services?limit=100&page=${page++}`,
    );
    rows.push(...result.items);
    if (rows.length >= result.total || !result.items.length) return rows;
  }
}
export async function exportCsv(path: string, filename: string) {
  await api("/admin/me");
  const [endpoint, query] = path.split("?");
  const params = new URLSearchParams(query);
  params.set("limit", "100");
  params.set("page", "1");
  const list = await api<List<{ id: string }>>(
    endpoint.replace(/\/export$/, "") + "?" + params,
  );
  const parts: string[] = [];
  for (let page = 1; page <= Math.max(1, Math.ceil(list.total / 100)); page++) {
    params.set("page", String(page));
    const response = await fetch(API + "/api" + endpoint + "?" + params, {
      credentials: "include",
    });
    if (!response.ok) throw new Error("Export failed; please retry");
    const text = await response.text();
    parts.push(page === 1 ? text : text.slice(text.indexOf("\r\n") + 2));
  }
  const url = URL.createObjectURL(
    new Blob([parts.join("\r\n")], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
