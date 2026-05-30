import { supabase } from './supabase'; // Adjust path if needed

const WORKER_BASE_URL = "https://supabase-d1-sync.adityaarta085.workers.dev";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });

    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWorkerJson(url, retries = 3) {
  let lastError = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, 4000);

      if (response.status === 429 || response.status >= 500) {
        throw new Error(`Worker HTTP ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(`Worker HTTP ${response.status}`);
      }

      const json = await response.json();

      if (!json || json.ok !== true) {
        throw new Error("Worker returned invalid response");
      }

      return json;
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await sleep(attempt * 300);
      }
    }
  }

  throw lastError;
}

export async function getList(table, options = {}) {
  // Prevent frontend from fetching restricted tables
  if (['admins', 'page_views', 'sync_changes'].includes(table)) {
    throw new Error(`Access to table ${table} is restricted from frontend.`);
  }

  const limit = options.limit ?? 50;
  const offset = options.offset ?? 0;
  const orderBy = options.orderBy;
  const order = options.order ?? "desc";

  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("offset", String(offset));
  if (orderBy) params.set("orderBy", orderBy);
  if (order) params.set("order", order);

  const workerUrl = `${WORKER_BASE_URL}/api/${table}?${params.toString()}`;

  try {
    const workerJson = await fetchWorkerJson(workerUrl, 3);

    return {
      ok: true,
      source: "worker",
      data: workerJson.data,
    };
  } catch (error) {
    console.warn("Worker gagal, fallback ke Supabase:", error?.message);

    let query = supabase.from(table).select("*").range(offset, offset + limit - 1);

    if (orderBy) {
      query = query.order(orderBy, { ascending: order === "asc" });
    }

    const { data, error: supabaseError } = await query;

    if (supabaseError) throw supabaseError;

    return {
      ok: true,
      source: "supabase_fallback",
      reason: error?.message,
      data: data ?? [],
    };
  }
}

export async function getById(table, id) {
  // Prevent frontend from fetching restricted tables
  if (['admins', 'page_views', 'sync_changes'].includes(table)) {
    throw new Error(`Access to table ${table} is restricted from frontend.`);
  }

  const workerUrl = `${WORKER_BASE_URL}/api/${table}/${encodeURIComponent(String(id))}`;

  try {
    const workerJson = await fetchWorkerJson(workerUrl, 3);

    return {
      ok: true,
      source: "worker",
      data: workerJson.data,
    };
  } catch (error) {
    console.warn("Worker detail gagal, fallback ke Supabase:", error?.message);

    const primaryKey = getPrimaryKey(table);

    const { data, error: supabaseError } = await supabase
      .from(table)
      .select("*")
      .eq(primaryKey, id)
      .maybeSingle();

    if (supabaseError) throw supabaseError;

    return {
      ok: true,
      source: "supabase_fallback",
      reason: error?.message,
      data: data,
    };
  }
}

export async function getByColumn(table, column, value) {
  // Prevent frontend from fetching restricted tables
  if (['admins', 'page_views', 'sync_changes'].includes(table)) {
    throw new Error(`Access to table ${table} is restricted from frontend.`);
  }

  const workerUrl = `${WORKER_BASE_URL}/api/${table}/by/${column}/${encodeURIComponent(String(value))}`;

  try {
    const workerJson = await fetchWorkerJson(workerUrl, 3);

    return {
      ok: true,
      source: "worker",
      data: workerJson.data,
    };
  } catch (error) {
    console.warn("Worker by-column gagal, fallback ke Supabase:", error?.message);

    const { data, error: supabaseError } = await supabase
      .from(table)
      .select("*")
      .eq(column, value)
      .maybeSingle();

    if (supabaseError) throw supabaseError;

    return {
      ok: true,
      source: "supabase_fallback",
      reason: error?.message,
      data: data,
    };
  }
}

function getPrimaryKey(table) {
  if (table === "chatsCS") return "chat_id";
  if (table === "site_settings") return "key";

  if (
    table === "user_currencies" ||
    table === "user_gacha_stats" ||
    table === "user_gamification" ||
    table === "user_profile_customizations" ||
    table === "user_tiers"
  ) {
    return "user_id";
  }

  return "id";
}
