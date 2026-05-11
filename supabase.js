/**
 * SUPABASE CONFIGURATION & API CLIENT
 * Shop Administrator - ERP System
 */

const SUPABASE_CONFIG = {
  url: localStorage.getItem('sb_url') || 'https://imcmslwvsdbpbuvesljr.supabase.co',
  apiKey: localStorage.getItem('sb_key') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltY21zbHd2c2RicGJ1dmVzbGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTg3OTksImV4cCI6MjA5NDA3NDc5OX0.VQVTKjML2Z2uYS-BC6zokidx-CBehSsZQQ3nJxvMBVs',
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

/* ============================================================
   HEADERS + URL
============================================================ */

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
async function testInsert() {
  try {
    const result = await SupabaseAPI.insert("produtos", {
      nome: "Teste Mobile",
      preco: 100
    });

    alert("Funcionou! Produto salvo no Supabase");
    console.log(result);

  } catch (error) {
    alert("Erro ao salvar");
    console.error(error);
  }
}
/* ============================================================
   CRUD SUPABASE
============================================================ */

async function dbInsert(table, data) {
  try {
    const res = await fetch(buildUrl(table), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error(res.statusText);
    return await res.json();

  } catch (err) {
    return fallbackInsert(table, data);
  }
}

async function dbSelect(table, options = {}) {
  try {
    const params = new URLSearchParams();

    params.append('select', options.select || '*');

    if (options.eq) {
      Object.entries(options.eq).forEach(([k, v]) => {
        params.append(k, `eq.${v}`);
      });
    }

    if (options.order) {
      params.append(
        'order',
        `${options.order.column}.${options.order.ascending ? 'asc' : 'desc'}`
      );
    }

    if (options.limit) params.append('limit', options.limit);

    const res = await fetch(buildUrl(table, '?' + params.toString()), {
      method: 'GET',
      headers: getHeaders()
    });

    if (!res.ok) throw new Error(res.statusText);
    return await res.json();

  } catch (err) {
    return fallbackSelect(table, options);
  }
}

async function dbUpdate(table, id, data) {
  try {
    const res = await fetch(buildUrl(table, `?id=eq.${id}`), {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error(res.statusText);
    return await res.json();

  } catch (err) {
    return fallbackUpdate(table, id, data);
  }
}

async function dbDelete(table, id) {
  try {
    const res = await fetch(buildUrl(table, `?id=eq.${id}`), {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!res.ok) throw new Error(res.statusText);
    return true;

  } catch (err) {
    return fallbackDelete(table, id);
  }
}

async function dbRpc(fn, params = {}) {
  const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(params)
  });

  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

/* ============================================================
   FALLBACK LOCAL (OFFLINE MODE)
============================================================ */

function fallbackInsert(table, data) {
  const store = JSON.parse(localStorage.getItem(`sb_${table}`) || '[]');

  const records = Array.isArray(data) ? data : [data];

  records.forEach(r => {
    r.id = r.id || generateId();
    r.created_at = new Date().toISOString();
    r.updated_at = new Date().toISOString();
    store.push(r);
  });

  localStorage.setItem(`sb_${table}`, JSON.stringify(store));

  return Array.isArray(data) ? records : records[0];
}

function fallbackSelect(table, options = {}) {
  let store = JSON.parse(localStorage.getItem(`sb_${table}`) || '[]');

  if (options.eq) {
    Object.entries(options.eq).forEach(([k, v]) => {
      store = store.filter(r => r[k] == v);
    });
  }

  return store;
}

function fallbackUpdate(table, id, data) {
  const store = JSON.parse(localStorage.getItem(`sb_${table}`) || '[]');

  const i = store.findIndex(r => r.id == id);

  if (i !== -1) {
    store[i] = { ...store[i], ...data };
    localStorage.setItem(`sb_${table}`, JSON.stringify(store));
    return store[i];
  }

  return null;
}

function fallbackDelete(table, id) {
  let store = JSON.parse(localStorage.getItem(`sb_${table}`) || '[]');
  store = store.filter(r => r.id != id);
  localStorage.setItem(`sb_${table}`, JSON.stringify(store));
  return true;
}

/* ============================================================
   HELPERS
============================================================ */

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

/* ============================================================
   BULK + CLEAR
============================================================ */

async function dbInsertBulk(table, dataArray) {
  return Promise.all(dataArray.map(d => dbInsert(table, d)));
}

async function dbClear(table) {
  await fetch(buildUrl(table), {
    method: 'DELETE',
    headers: getHeaders()
  });

  localStorage.removeItem(`sb_${table}`);
  return true;
}

/* ============================================================
   GLOBAL API
============================================================ */

window.SupabaseAPI = {
  insert: dbInsert,
  select: dbSelect,
  update: dbUpdate,
  delete: dbDelete,
  rpc: dbRpc,
  insertBulk: dbInsertBulk,
  clear: dbClear,
  setConfig: setSupabaseConfig,
  isConfigured: isSupabaseConfigured,
  generateId,
  config: SUPABASE_CONFIG
};
