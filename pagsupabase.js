/**
 * PAGSUPABASE - SUPABASE CONFIGURATION & API CLIENT
 * Shop Administrator - ERP System
 * 
 * Configure your Supabase credentials below.
 */

const SUPABASE_CONFIG = {
  url: localStorage.getItem('sb_url') || 'https://your-project.supabase.co',
  apiKey: localStorage.getItem('sb_key') || 'your-anon-public-api-key',
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
    'apikey': SUPABASE_CONFIG.apiKey,
    'Authorization': `Bearer ${SUPABASE_CONFIG.apiKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };
}

function buildUrl(table, query = '') {
  return `${SUPABASE_CONFIG.url}/rest/v1/${table}${query}`;
}

async function dbInsert(table, data) {
  try {
    const response = await fetch(buildUrl(table), {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Insert failed: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`[dbInsert] Error in ${table}:`, error);
    return fallbackInsert(table, data);
  }
}

async function dbSelect(table, options = {}) {
  try {
    let query = '';
    const params = new URLSearchParams();

    if (options.select) params.append('select', options.select);
    else params.append('select', '*');

    if (options.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        params.append(key, `eq.${value}`);
      });
    }

    if (options.neq) {
      Object.entries(options.neq).forEach(([key, value]) => {
        params.append(key, `neq.${value}`);
      });
    }

    if (options.gt) {
      Object.entries(options.gt).forEach(([key, value]) => {
        params.append(key, `gt.${value}`);
      });
    }

    if (options.lt) {
      Object.entries(options.lt).forEach(([key, value]) => {
        params.append(key, `lt.${value}`);
      });
    }

    if (options.lte) {
      Object.entries(options.lte).forEach(([key, value]) => {
        params.append(key, `lte.${value}`);
      });
    }

    if (options.gte) {
      Object.entries(options.gte).forEach(([key, value]) => {
        params.append(key, `gte.${value}`);
      });
    }

    if (options.ilike) {
      Object.entries(options.ilike).forEach(([key, value]) => {
        params.append(key, `ilike.*${value}*`);
      });
    }

    if (options.order) {
      params.append('order', `${options.order.column}.${options.order.ascending ? 'asc' : 'desc'}`);
    }

    if (options.limit) {
      params.append('limit', options.limit);
    }

    if (options.offset) {
      params.append('offset', options.offset);
    }

    query = '?' + params.toString();

    const response = await fetch(buildUrl(table, query), {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) throw new Error(`Select failed: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`[dbSelect] Error in ${table}:`, error);
    return fallbackSelect(table, options);
  }
}

async function dbUpdate(table, id, data) {
  try {
    const response = await fetch(buildUrl(table, `?id=eq.${id}`), {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Update failed: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`[dbUpdate] Error in ${table}:`, error);
    return fallbackUpdate(table, id, data);
  }
}

async function dbDelete(table, id) {
  try {
    const response = await fetch(buildUrl(table, `?id=eq.${id}`), {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error(`Delete failed: ${response.statusText}`);
    return true;
  } catch (error) {
    console.error(`[dbDelete] Error in ${table}:`, error);
    return fallbackDelete(table, id);
  }
}

async function dbRpc(fn, params = {}) {
  try {
    const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params)
    });
    if (!response.ok) throw new Error(`RPC failed: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`[dbRpc] Error calling ${fn}:`, error);
    return null;
  }
}

function fallbackInsert(table, data) {
  const store = JSON.parse(localStorage.getItem(`sb_${table}`) || '[]');
  const records = Array.isArray(data) ? data : [data];

  records.forEach(record => {
    record.id = record.id || generateId();
    record.created_at = new Date().toISOString();
    record.updated_at = new Date().toISOString();
    store.push(record);
  });

  localStorage.setItem(`sb_${table}`, JSON.stringify(store));
  return Array.isArray(data) ? records : records[0];
}

function fallbackSelect(table, options = {}) {
  let store = JSON.parse(localStorage.getItem(`sb_${table}`) || '[]');

  if (options.eq) {
    Object.entries(options.eq).forEach(([key, value]) => {
      store = store.filter(r => r[key] == value);
    });
  }

  if (options.ilike && options.ilike.nome) {
    const term = options.ilike.nome.toLowerCase();
    store = store.filter(r => r.nome && r.nome.toLowerCase().includes(term));
  }

  if (options.order) {
    store.sort((a, b) => {
      const aVal = a[options.order.column];
      const bVal = b[options.order.column];
      return options.order.ascending 
        ? (aVal > bVal ? 1 : -1) 
        : (aVal < bVal ? 1 : -1);
    });
  }

  return store;
}

function fallbackUpdate(table, id, data) {
  const store = JSON.parse(localStorage.getItem(`sb_${table}`) || '[]');
  const index = store.findIndex(r => r.id == id);

  if (index !== -1) {
    store[index] = { ...store[index], ...data, updated_at: new Date().toISOString() };
    localStorage.setItem(`sb_${table}`, JSON.stringify(store));
    return store[index];
  }
  return null;
}

function fallbackDelete(table, id) {
  let store = JSON.parse(localStorage.getItem(`sb_${table}`) || '[]');
  store = store.filter(r => r.id != id);
  localStorage.setItem(`sb_${table}`, JSON.stringify(store));
  return true;
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
  return SUPABASE_CONFIG.url !== 'https://https://imcmslwvsdbpbuvesljr.supabase.co' && 
         SUPABASE_CONFIG.apiKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltY21zbHd2c2RicGJ1dmVzbGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0OTg3OTksImV4cCI6MjA5NDA3NDc5OX0.VQVTKjML2Z2uYS-BC6zokidx-CBehSsZQQ3nJxvMBVs';
}

async function dbInsertBulk(table, dataArray) {
  const results = [];
  for (const data of dataArray) {
    const result = await dbInsert(table, data);
    results.push(result);
  }
  return results;
}

async function dbClear(table) {
  try {
    const response = await fetch(buildUrl(table), {
      method: 'DELETE',
      headers: { ...getHeaders(), 'Prefer': 'return=minimal' }
    });
    if (!response.ok) throw new Error(`Clear failed: ${response.statusText}`);
    localStorage.removeItem(`sb_${table}`);
    return true;
  } catch (error) {
    console.error(`[dbClear] Error in ${table}:`, error);
    localStorage.removeItem(`sb_${table}`);
    return true;
  }
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
