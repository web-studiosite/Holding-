/**
 * PAGSUPABASE - SUPABASE CONFIGURATION & API CLIENT
 * Shop Administrator - ERP System
 */

const SUPABASE_CONFIG = {
  url: localStorage.getItem('sb_url'),
  apiKey: localStorage.getItem('sb_key'),
  tables: {
    produtos: 'produtos',
    categorias: 'categorias',
    estoque: 'estoque',
    movimentacoes: 'movimentacoes',
    vendas: 'vendas',
    relatorios: 'relatorios',
    combustiveis: 'combustiveis',
    configs: 'configs'
  }
};

function getHeaders() {
  return {
    apikey: SUPABASE_CONFIG.apiKey,
    Authorization: `Bearer ${SUPABASE_CONFIG.apiKey}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation'
  };
}

function buildUrl(table, query = '') {
  return `${SUPABASE_CONFIG.url}/rest/v1/${table}${query}`;
}

async function dbInsert(table, data) {
  const response = await fetch(buildUrl(table), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error(`Insert failed: ${response.statusText}`);
  return await response.json();
}

async function dbSelect(table, options = {}) {
  const params = new URLSearchParams();

  params.append('select', options.select || '*');

  if (options.eq) {
    Object.entries(options.eq).forEach(([key, value]) => {
      params.append(key, `eq.${value}`);
    });
  }

  if (options.order) {
    params.append(
      'order',
      `${options.order.column}.${options.order.ascending ? 'asc' : 'desc'}`
    );
  }

  if (options.limit) params.append('limit', options.limit);

  const response = await fetch(buildUrl(table, '?' + params.toString()), {
    method: 'GET',
    headers: getHeaders()
  });

  if (!response.ok) throw new Error(`Select failed: ${response.statusText}`);
  return await response.json();
}

async function dbUpdate(table, id, data) {
  const response = await fetch(buildUrl(table, `?id=eq.${id}`), {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) throw new Error(`Update failed: ${response.statusText}`);
  return await response.json();
}

async function dbDelete(table, id) {
  const response = await fetch(buildUrl(table, `?id=eq.${id}`), {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!response.ok) throw new Error(`Delete failed: ${response.statusText}`);
  return true;
}

async function dbRpc(fn, params = {}) {
  const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(params)
  });

  if (!response.ok) throw new Error(`RPC failed: ${response.statusText}`);
  return await response.json();
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function setSupabaseConfig(url, apiKey) {
  SUPABASE_CONFIG.url = url;
  SUPABASE_CONFIG.apiKey = apiKey;

  localStorage.setItem('sb_url', url);
  localStorage.setItem('sb_key', apiKey);
}

function isSupabaseConfigured() {
  return Boolean(SUPABASE_CONFIG.url && SUPABASE_CONFIG.apiKey);
}

async function dbInsertBulk(table, dataArray) {
  const results = [];
  for (const data of dataArray) {
    results.push(await dbInsert(table, data));
  }
  return results;
}

async function dbClear(table) {
  const response = await fetch(buildUrl(table), {
    method: 'DELETE',
    headers: { ...getHeaders(), Prefer: 'return=minimal' }
  });

  if (!response.ok) throw new Error(`Clear failed: ${response.statusText}`);
  return true;
}

window.SupabaseAPI = {
  config: SUPABASE_CONFIG,
  insert: dbInsert,
  select: dbSelect,
  update: dbUpdate,
  delete: dbDelete,
  rpc: dbRpc,
  insertBulk: dbInsertBulk,
  clear: dbClear,
  setConfig: setSupabaseConfig,
  isConfigured: isSupabaseConfigured,
  generateId
};
