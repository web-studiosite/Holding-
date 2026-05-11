/**
 * PAGAPP - SHOP ADMINISTRATOR MAIN APPLICATION
 * ERP System - Single Page Application
 * 
 * All modules, routing, state management and UI logic
 * Includes Reconciliacao module with 30 file formats
 */

// ============================================================
// STATE MANAGEMENT
// ============================================================

const AppState = {
  currentPage: 'dashboard',
  sidebarOpen: window.innerWidth > 768,
  produtos: JSON.parse(localStorage.getItem('sb_produtos') || '[]'),
  categorias: JSON.parse(localStorage.getItem('sb_categorias') || JSON.stringify([
    { id: 'cat-1', nome: 'Bebidas', cor: '#3b82f6' },
    { id: 'cat-2', nome: 'Biscoitos', cor: '#f59e0b' },
    { id: 'cat-3', nome: 'Automoveis', cor: '#ef4444' },
    { id: 'cat-4', nome: 'Higiene', cor: '#10b981' },
    { id: 'cat-5', nome: 'Alimentos', cor: '#8b5cf6' },
    { id: 'cat-6', nome: 'Combustiveis', cor: '#f97316' },
    { id: 'cat-7', nome: 'Diversos', cor: '#6b7280' }
  ])),
  vendas: JSON.parse(localStorage.getItem('sb_vendas') || '[]'),
  movimentacoes: JSON.parse(localStorage.getItem('sb_movimentacoes') || '[]'),
  combustiveis: JSON.parse(localStorage.getItem('sb_combustiveis') || '[]'),
  relatorios: JSON.parse(localStorage.getItem('sb_relatorios') || '[]'),
  configs: JSON.parse(localStorage.getItem('sb_configs') || JSON.stringify({
    nomeEmpresa: 'Shop Administrator',
    moeda: 'AOA',
    alertaEstoque: 5
  })),

  save(table) {
    localStorage.setItem(`sb_${table}`, JSON.stringify(this[table]));
  },

  refresh() {
    this.produtos = JSON.parse(localStorage.getItem('sb_produtos') || '[]');
    this.vendas = JSON.parse(localStorage.getItem('sb_vendas') || '[]');
    this.movimentacoes = JSON.parse(localStorage.getItem('sb_movimentacoes') || '[]');
    this.combustiveis = JSON.parse(localStorage.getItem('sb_combustiveis') || '[]');
    this.relatorios = JSON.parse(localStorage.getItem('sb_relatorios') || '[]');
  }
};

// ============================================================
// ICONS (SVG Strings)
// ============================================================

const Icons = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>',
  warehouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12"/><path d="M6 14h12"/><path d="M6 10h12"/></svg>',
  inventory: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  fuel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="19" y1="4" y2="20"/><path d="M17 4h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M5 8v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8"/><path d="M7 8h10"/><path d="M9 4v4"/><path d="M15 4v4"/></svg>',
  reports: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  add: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',
  transfer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 9 4-4-4-4"/><path d="M20 20h-7a4 4 0 0 1-4-4 4 4 0 0 1 4-4h7"/><path d="M9 20H5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
  export: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
  trendUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  trendDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/></svg>',
  dollar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  fileText: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
  print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>'
};

// ============================================================
// NAVIGATION CONFIG
// ============================================================

const Navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'loja', label: 'Loja', icon: 'store' },
  { id: 'armazem', label: 'Armazem', icon: 'warehouse' },
  { id: 'inventario', label: 'Inventario', icon: 'inventory' },
  { id: 'combustiveis', label: 'Combustiveis', icon: 'fuel' },
  { id: 'relatorios', label: 'Relatorios', icon: 'reports' },
  { id: 'reconciliacao', label: 'Reconciliacao', icon: 'transfer' },
  { id: 'configuracoes', label: 'Configuracoes', icon: 'settings' }
];

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container') || createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconMap = { success: Icons.check, error: Icons.alert, warning: Icons.alert, info: Icons.bell };

  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || Icons.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">${Icons.close}</button>
  `;

  container.appendChild(toast);

  setTimeout(() => toast.remove(), 5000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// ============================================================
// MODAL SYSTEM
// ============================================================

function openModal(title, content, footer = '') {
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" onclick="closeModal()">${Icons.close}</button>
      </div>
      <div class="modal-body">${content}</div>
      ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    </div>
  `;

  overlay.classList.add('active');

  overlay.onclick = (e) => {
    if (e.target === overlay) closeModal();
  };
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('active');
}

// ============================================================
// CONFIRM DIALOG
// ============================================================

function confirmDialog(message, onConfirm, onCancel) {
  const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="(function(){ closeModal(); (${onConfirm})(); })()">Confirmar</button>
  `;
  openModal('Confirmar', `<p>${message}</p>`, footer);
}

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderHeader();
  navigate('dashboard');
  setupEventListeners();
  setupRealtimeUpdates();
});

function setupEventListeners() {
  document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.menu-toggle');
    if (toggle) {
      toggleSidebar();
    }

    const overlay = e.target.closest('.sidebar-overlay');
    if (overlay) {
      toggleSidebar();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      document.querySelector('.sidebar')?.classList.remove('open');
      document.querySelector('.sidebar-overlay')?.classList.remove('active');
    }
  });
}

// ============================================================
// SIDEBAR
// ============================================================

function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const lowStock = AppState.produtos.filter(p => (p.quantidade || 0) <= (AppState.configs.alertaEstoque || 5)).length;

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-logo">S</div>
      <div class="sidebar-brand">Shop <span>Admin</span></div>
    </div>
    <nav class="sidebar-nav">
      ${Navigation.map(item => `
        <button class="nav-item ${AppState.currentPage === item.id ? 'active' : ''}" 
                onclick="navigate('${item.id}')" data-page="${item.id}">
          ${Icons[item.icon] || ''}
          <span>${item.label}</span>
          ${item.id === 'inventario' && lowStock > 0 ? `<span class="nav-badge">${lowStock}</span>` : ''}
        </button>
      `).join('')}
    </nav>
    <div class="sidebar-footer">
      v2.0 &bull; Shop Administrator
    </div>
  `;
}

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

// ============================================================
// HEADER
// ============================================================

function renderHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const pageNames = {
    dashboard: 'Dashboard',
    loja: 'Loja',
    armazem: 'Armazem',
    inventario: 'Inventario',
    combustiveis: 'Combustiveis',
    relatorios: 'Relatorios',
    reconciliacao: 'Reconciliacao',
    configuracoes: 'Configuracoes',
    adicionarProduto: 'Adicionar Produto',
    transferirLoja: 'Transferir para Loja'
  };

  header.innerHTML = `
    <div class="header-left">
      <button class="menu-toggle">${Icons.menu}</button>
      <h2 class="header-title">${pageNames[AppState.currentPage] || 'Shop Administrator'}</h2>
    </div>
    <div class="header-right">
      <button class="header-action" onclick="navigate('inventario')" title="Alertas">
        ${Icons.bell}
        ${AppState.produtos.filter(p => (p.quantidade || 0) <= 5).length > 0 ? '<span class="badge"></span>' : ''}
      </button>
    </div>
  `;
}

// ============================================================
// ROUTING / NAVIGATION
// ============================================================

function navigate(page) {
  AppState.currentPage = page;

  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  renderHeader();

  const container = document.getElementById('page-content');
  if (!container) return;

  AppState.refresh();

  switch (page) {
    case 'dashboard': renderDashboard(container); break;
    case 'loja': renderLoja(container); break;
    case 'armazem': renderArmazem(container); break;
    case 'inventario': renderInventario(container); break;
    case 'combustiveis': renderCombustiveis(container); break;
    case 'relatorios': renderRelatorios(container); break;
    case 'reconciliacao': renderReconciliacao(container); break;
    case 'configuracoes': renderConfiguracoes(container); break;
    case 'adicionarProduto': renderAdicionarProduto(container); break;
    case 'transferirLoja': renderTransferirLoja(container); break;
    default: renderDashboard(container);
  }

  if (window.innerWidth <= 768) {
    document.querySelector('.sidebar')?.classList.remove('open');
    document.querySelector('.sidebar-overlay')?.classList.remove('active');
  }
}

// ============================================================
// REAL-TIME UPDATES
// ============================================================

function setupRealtimeUpdates() {
  window.addEventListener('storage', (e) => {
    if (e.key?.startsWith('sb_')) {
      AppState.refresh();
      const container = document.getElementById('page-content');
      if (container && AppState.currentPage) {
        navigate(AppState.currentPage);
      }
    }
  });
}

function refreshCurrentPage() {
  AppState.refresh();
  navigate(AppState.currentPage);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA'
  }).format(value || 0);
}

function formatNumber(value) {
  return new Intl.NumberFormat('pt-AO').format(value || 0);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-AO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function getCategoryName(catId) {
  const cat = AppState.categorias.find(c => c.id === catId);
  return cat ? cat.nome : catId;
}

function getCategoryColor(catId) {
  const cat = AppState.categorias.find(c => c.id === catId);
  return cat ? cat.cor : '#6b7280';
}

// ============================================================
// MODULE: DASHBOARD
// ============================================================

function renderDashboard(container) {
  const today = getToday();
  const todayVendas = AppState.vendas.filter(v => (v.data || '').startsWith(today));
  const totalVendas = todayVendas.reduce((s, v) => s + (parseFloat(v.total) || 0), 0);
  const totalLucro = todayVendas.reduce((s, v) => s + (parseFloat(v.lucro) || 0), 0);

  const armazemCount = AppState.produtos.filter(p => p.local === 'armazem' || !p.local).length;
  const lojaCount = AppState.produtos.filter(p => p.local === 'loja').length;
  const lowStock = AppState.produtos.filter(p => (p.quantidade || 0) <= 5).length;
  const totalValor = AppState.produtos.reduce((s, p) => s + ((parseFloat(p.quantidade) || 0) * (parseFloat(p.preco_venda || p.precoVenda || 0))), 0);

  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Dashboard</h1>
        <p>Visao geral do seu negocio em tempo real</p>
      </div>

      <div class="card-grid">
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Vendas Hoje</span>
            <div class="stat-card-icon accent">${Icons.dollar}</div>
          </div>
          <div class="stat-card-value">${formatCurrency(totalVendas)}</div>
          <div class="stat-card-change positive">${todayVendas.length} transacoes</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Lucro Hoje</span>
            <div class="stat-card-icon success">${Icons.trendUp}</div>
          </div>
          <div class="stat-card-value">${formatCurrency(totalLucro)}</div>
          <div class="stat-card-change positive">${totalVendas > 0 ? ((totalLucro/totalVendas)*100).toFixed(1) : 0}% margem</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Produtos Armazem</span>
            <div class="stat-card-icon primary">${Icons.warehouse}</div>
          </div>
          <div class="stat-card-value">${formatNumber(armazemCount)}</div>
          <div class="stat-card-change neutral">em estoque</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Produtos Loja</span>
            <div class="stat-card-icon warning">${Icons.store}</div>
          </div>
          <div class="stat-card-value">${formatNumber(lojaCount)}</div>
          <div class="stat-card-change neutral">disponiveis</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Estoque Baixo</span>
            <div class="stat-card-icon danger">${Icons.alert}</div>
          </div>
          <div class="stat-card-value">${formatNumber(lowStock)}</div>
          <div class="stat-card-change ${lowStock > 0 ? 'negative' : 'positive'}">${lowStock > 0 ? 'Necessita atencao' : 'Tudo OK'}</div>
        </div>

        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Valor Total Stock</span>
            <div class="stat-card-icon success">${Icons.package}</div>
          </div>
          <div class="stat-card-value">${formatCurrency(totalValor)}</div>
          <div class="stat-card-change neutral">todos os produtos</div>
        </div>
      </div>

      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Acoes Rapidas</span>
        </div>
        <div class="content-card-body">
          <div class="btn-group">
            <button class="btn btn-primary" onclick="navigate('adicionarProduto')">${Icons.add} Novo Produto</button>
            <button class="btn btn-success" onclick="navigate('transferirLoja')">${Icons.transfer} Transferir Loja</button>
            <button class="btn btn-warning" onclick="navigate('combustiveis')">${Icons.fuel} Vender Combustivel</button>
            <button class="btn btn-outline" onclick="navigate('relatorios')">${Icons.reports} Ver Relatorios</button>
            <button class="btn btn-outline" onclick="navigate('reconciliacao')">${Icons.transfer} Reconciliar Caixa</button>
          </div>
        </div>
      </div>

      ${renderLowStockWidget()}

      ${renderRecentSalesWidget()}
    </div>
  `;
}

function renderLowStockWidget() {
  const lowStock = AppState.produtos
    .filter(p => (p.quantidade || 0) <= 5)
    .slice(0, 5);

  if (lowStock.length === 0) return '';

  return `
    <div class="content-card">
      <div class="content-card-header">
        <span class="content-card-title">Alertas de Estoque Baixo</span>
        <button class="btn btn-ghost btn-sm" onclick="navigate('inventario')">Ver todos</button>
      </div>
      <div class="content-card-body">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>Produto</th><th>Categoria</th><th>Local</th><th>Quantidade</th><th>Status</th></tr>
            </thead>
            <tbody>
              ${lowStock.map(p => `
                <tr>
                  <td><strong>${escapeHtml(p.nome)}</strong></td>
                  <td><span class="badge badge-neutral">${escapeHtml(getCategoryName(p.categoria))}</span></td>
                  <td>${p.local === 'loja' ? 'Loja' : 'Armazem'}</td>
                  <td>${p.quantidade || 0}</td>
                  <td><span class="badge badge-danger">Critico</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderRecentSalesWidget() {
  const recent = [...AppState.vendas].sort((a, b) => new Date(b.created_at || b.data) - new Date(a.created_at || a.data)).slice(0, 5);

  if (recent.length === 0) return '';

  return `
    <div class="content-card">
      <div class="content-card-header">
        <span class="content-card-title">Vendas Recentes</span>
        <button class="btn btn-ghost btn-sm" onclick="navigate('relatorios')">Ver todas</button>
      </div>
      <div class="content-card-body">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>Data</th><th>Produto</th><th>Qtd</th><th>Total</th><th>Lucro</th></tr>
            </thead>
            <tbody>
              ${recent.map(v => `
                <tr>
                  <td>${formatDate(v.created_at || v.data)}</td>
                  <td><strong>${escapeHtml(v.produto_nome || v.produto)}</strong></td>
                  <td>${v.quantidade}</td>
                  <td>${formatCurrency(v.total)}</td>
                  <td class="positive" style="color:var(--success)">${formatCurrency(v.lucro)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// MODULE: LOJA (STORE)
// ============================================================

function renderLoja(container) {
  const produtosLoja = AppState.produtos.filter(p => p.local === 'loja');
  const categoriasComProdutos = [...new Set(produtosLoja.map(p => p.categoria))];

  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Loja</h1>
        <p>Produtos disponiveis para venda</p>
      </div>

      <div class="filter-bar">
        <div class="search-input">
          ${Icons.search}
          <input type="text" id="lojaSearch" placeholder="Buscar produtos..." onkeyup="filterLoja()">
        </div>
        <div class="btn-group">
          <button class="btn btn-success" onclick="navigate('transferirLoja')">${Icons.transfer} Transferir</button>
          <button class="btn btn-outline" onclick="exportLoja()">${Icons.export} Exportar</button>
        </div>
      </div>

      <div class="tabs">
        <button class="tab active" onclick="filterLojaCategoria('all', this)">Todos</button>
        ${categoriasComProdutos.map(cat => `
          <button class="tab" onclick="filterLojaCategoria('${cat}', this)">${escapeHtml(getCategoryName(cat))}</button>
        `).join('')}
      </div>

      <div id="loja-products" class="product-grid">
        ${renderLojaProducts(produtosLoja)}
      </div>

      ${produtosLoja.length === 0 ? renderEmptyState('Nenhum produto na loja', 'Transfira produtos do armazem para comecar a vender.') : ''}
    </div>
  `;
}

function renderLojaProducts(produtos) {
  if (produtos.length === 0) return '';

  return produtos.map(p => {
    const lucro = (parseFloat(p.preco_venda || p.precoVenda || 0)) - (parseFloat(p.preco_aquisicao || p.precoAquisicao || 0));
    const isLow = (p.quantidade || 0) <= 5;

    return `
      <div class="product-card" data-categoria="${p.categoria}" data-nome="${escapeHtml(p.nome).toLowerCase()}">
        <div class="product-card-image" style="background:linear-gradient(135deg, ${getCategoryColor(p.categoria)}20, ${getCategoryColor(p.categoria)}10)">
          <span style="font-size:2rem">${getCategoryEmoji(p.categoria)}</span>
        </div>
        <div class="product-card-body">
          <div class="product-card-name">${escapeHtml(p.nome)}</div>
          <div class="product-card-category">${escapeHtml(getCategoryName(p.categoria))}</div>
          <div class="product-card-price">${formatCurrency(p.preco_venda || p.precoVenda || 0)}</div>
          <div class="product-card-stock">
            <span style="color:${isLow ? 'var(--danger)' : 'var(--success)'}">
              ${p.quantidade || 0} em stock ${isLow ? '(Baixo!)' : ''}
            </span>
          </div>
          <div style="margin-top:8px;display:flex;gap:8px;">
            <button class="btn btn-success btn-sm" style="flex:1" onclick="venderProduto('${p.id}')">Vender</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function getCategoryEmoji(catId) {
  const emojis = {
    'cat-1': '\uD83E\uDD64', 'cat-2': '\uD83C\uDF6A', 'cat-3': '\uD83D\uDE97', 'cat-4': '\uD83E\uDDFC',
    'cat-5': '\uD83C\uDF72', 'cat-6': '\u26FD', 'cat-7': '\uD83D\uDCE6'
  };
  return emojis[catId] || '\uD83D\uDCE6';
}

function filterLoja() {
  const search = document.getElementById('lojaSearch')?.value.toLowerCase() || '';
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const nome = card.dataset.nome || '';
    card.style.display = nome.includes(search) ? '' : 'none';
  });
}

function filterLojaCategoria(cat, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');

  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    if (cat === 'all') {
      card.style.display = '';
    } else {
      card.style.display = card.dataset.categoria === cat ? '' : 'none';
    }
  });
}

function venderProduto(id) {
  const p = AppState.produtos.find(x => x.id === id);
  if (!p) return;

  const content = `
    <form id="vendaForm">
      <div class="form-group">
        <label class="form-label">Produto</label>
        <input type="text" class="form-input" value="${escapeHtml(p.nome)}" disabled>
      </div>
      <div class="form-group">
        <label class="form-label">Preco Unitario</label>
        <input type="text" class="form-input" value="${formatCurrency(p.preco_venda || p.precoVenda || 0)}" disabled>
      </div>
      <div class="form-group">
        <label class="form-label">Quantidade Disponivel</label>
        <input type="text" class="form-input" value="${p.quantidade || 0}" disabled>
      </div>
      <div class="form-group">
        <label class="form-label">Quantidade a Vender <span class="required">*</span></label>
        <input type="number" class="form-input" id="vendaQtd" min="1" max="${p.quantidade || 0}" value="1" required>
      </div>
      <div class="form-group">
        <label class="form-label">Total Estimado</label>
        <input type="text" class="form-input" id="vendaTotal" value="${formatCurrency(p.preco_venda || p.precoVenda || 0)}" disabled>
      </div>
    </form>
    <script>
      (function(){
        const qtdInput = document.getElementById('vendaQtd');
        const totalInput = document.getElementById('vendaTotal');
        if(qtdInput) {
          qtdInput.oninput = function() {
            const qtd = parseInt(this.value) || 0;
            const preco = ${parseFloat(p.preco_venda || p.precoVenda || 0)};
            if(totalInput) totalInput.value = new Intl.NumberFormat('pt-AO', {style:'currency', currency:'AOA'}).format(qtd * preco);
          };
        }
      })();
    <\/script>
  `;

  const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-success" onclick="confirmarVenda('${p.id}')">Confirmar Venda</button>
  `;

  openModal('Vender Produto', content, footer);
}

function confirmarVenda(id) {
  const qtd = parseInt(document.getElementById('vendaQtd')?.value) || 0;
  if (qtd <= 0) {
    showToast('Quantidade invalida!', 'error');
    return;
  }

  const p = AppState.produtos.find(x => x.id === id);
  if (!p || (p.quantidade || 0) < qtd) {
    showToast('Quantidade insuficiente em stock!', 'error');
    return;
  }

  const precoVenda = parseFloat(p.preco_venda || p.precoVenda || 0);
  const precoAquisicao = parseFloat(p.preco_aquisicao || p.precoAquisicao || 0);
  const total = qtd * precoVenda;
  const lucro = qtd * (precoVenda - precoAquisicao);

  p.quantidade = (p.quantidade || 0) - qtd;
  p.updated_at = new Date().toISOString();

  const venda = {
    id: generateId(),
    produto_id: p.id,
    produto_nome: p.nome,
    categoria: p.categoria,
    quantidade: qtd,
    preco_unitario: precoVenda,
    total: total,
    lucro: lucro,
    local: p.local,
    data: getToday(),
    created_at: new Date().toISOString()
  };

  const mov = {
    id: generateId(),
    tipo: 'venda',
    produto_id: p.id,
    produto_nome: p.nome,
    quantidade: qtd,
    local_origem: p.local,
    local_destino: 'cliente',
    valor: total,
    data: getToday(),
    created_at: new Date().toISOString()
  };

  AppState.vendas.push(venda);
  AppState.movimentacoes.push(mov);

  const idx = AppState.produtos.findIndex(x => x.id === id);
  AppState.produtos[idx] = p;

  AppState.save('produtos');
  AppState.save('vendas');
  AppState.save('movimentacoes');

  closeModal();
  showToast(`Venda de ${qtd}x ${p.nome} realizada! Lucro: ${formatCurrency(lucro)}`, 'success');
  refreshCurrentPage();
}

function exportLoja() {
  const produtos = AppState.produtos.filter(p => p.local === 'loja');
  const data = produtos.map(p => ({
    Nome: p.nome,
    Categoria: getCategoryName(p.categoria),
    Quantidade: p.quantidade,
    'Preco Unitario': p.preco_venda || p.precoVenda,
    'Preco Aquisicao': p.preco_aquisicao || p.precoAquisicao,
    Local: p.local,
    'Data Atualizacao': p.updated_at
  }));
  exportData(data, 'loja-produtos', 'xlsx');
}

// ============================================================
// MODULE: ARMAZEM (WAREHOUSE)
// ============================================================

function renderArmazem(container) {
  const produtosArmazem = AppState.produtos.filter(p => p.local === 'armazem' || !p.local);

  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Armazem</h1>
        <p>Gestao de produtos em armazem</p>
      </div>

      <div class="filter-bar">
        <div class="search-input">
          ${Icons.search}
          <input type="text" id="armazemSearch" placeholder="Buscar produtos..." onkeyup="filterArmazem()">
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="navigate('adicionarProduto')">${Icons.add} Adicionar</button>
          <button class="btn btn-success" onclick="navigate('transferirLoja')">${Icons.transfer} Transferir</button>
          <button class="btn btn-outline" onclick="exportArmazem()">${Icons.export} Exportar</button>
        </div>
      </div>

      <div class="content-card">
        <div class="content-card-body">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Qtd</th>
                  <th>Preco Aquisicao</th>
                  <th>Percentual</th>
                  <th>Preco Venda</th>
                  <th>Lucro/Un</th>
                  <th>Valor Total</th>
                  <th>Acao</th>
                </tr>
              </thead>
              <tbody id="armazemTable">
                ${renderArmazemRows(produtosArmazem)}
              </tbody>
            </table>
          </div>
          ${produtosArmazem.length === 0 ? renderEmptyState('Nenhum produto no armazem', 'Adicione produtos para comecar.') : ''}
        </div>
      </div>
    </div>
  `;
}

function renderArmazemRows(produtos) {
  if (produtos.length === 0) return '';

  return produtos.map(p => {
    const precoAquisicao = parseFloat(p.preco_aquisicao || p.precoAquisicao || 0);
    const percentual = parseFloat(p.percentual_lucro || p.percentualLucro || 0);
    const precoVenda = parseFloat(p.preco_venda || p.precoVenda || 0);
    const lucroUn = precoVenda - precoAquisicao;
    const valorTotal = (p.quantidade || 0) * precoVenda;
    const isLow = (p.quantidade || 0) <= 5;

    return `
      <tr data-nome="${escapeHtml(p.nome).toLowerCase()}">
        <td><code>${escapeHtml(p.codigo || p.id?.substr(-8) || '-')}</code></td>
        <td><strong>${escapeHtml(p.nome)}</strong></td>
        <td><span class="badge badge-neutral">${escapeHtml(getCategoryName(p.categoria))}</span></td>
        <td style="color:${isLow ? 'var(--danger)' : 'inherit'};font-weight:${isLow ? '600' : 'normal'}">${p.quantidade || 0}</td>
        <td>${formatCurrency(precoAquisicao)}</td>
        <td>${percentual}%</td>
        <td>${formatCurrency(precoVenda)}</td>
        <td style="color:var(--success)">${formatCurrency(lucroUn)}</td>
        <td>${formatCurrency(valorTotal)}</td>
        <td>
          <div class="btn-group">
            <button class="btn btn-ghost btn-sm btn-icon" onclick="editarProduto('${p.id}')" title="Editar">${Icons.edit}</button>
            <button class="btn btn-ghost btn-sm btn-icon" onclick="entradaStock('${p.id}')" title="Entrada">${Icons.add}</button>
            <button class="btn btn-ghost btn-sm btn-icon" style="color:var(--danger)" onclick="removerProduto('${p.id}')" title="Remover">${Icons.trash}</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterArmazem() {
  const search = document.getElementById('armazemSearch')?.value.toLowerCase() || '';
  const rows = document.querySelectorAll('#armazemTable tr');
  rows.forEach(row => {
    const nome = row.dataset.nome || '';
    row.style.display = nome.includes(search) ? '' : 'none';
  });
}

function entradaStock(id) {
  const p = AppState.produtos.find(x => x.id === id);
  if (!p) return;

  const content = `
    <form id="entradaForm">
      <div class="form-group">
        <label class="form-label">Produto</label>
        <input type="text" class="form-input" value="${escapeHtml(p.nome)}" disabled>
      </div>
      <div class="form-group">
        <label class="form-label">Stock Atual</label>
        <input type="text" class="form-input" value="${p.quantidade || 0}" disabled>
      </div>
      <div class="form-group">
        <label class="form-label">Quantidade de Entrada <span class="required">*</span></label>
        <input type="number" class="form-input" id="entradaQtd" min="1" value="1" required>
      </div>
      <div class="form-group">
        <label class="form-label">Observacao</label>
        <input type="text" class="form-input" id="entradaObs" placeholder="Fornecedor, nota fiscal, etc.">
      </div>
    </form>
  `;

  const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-success" onclick="confirmarEntrada('${p.id}')">Registrar Entrada</button>
  `;

  openModal('Entrada de Stock', content, footer);
}

function confirmarEntrada(id) {
  const qtd = parseInt(document.getElementById('entradaQtd')?.value) || 0;
  const obs = document.getElementById('entradaObs')?.value || '';

  if (qtd <= 0) {
    showToast('Quantidade invalida!', 'error');
    return;
  }

  const p = AppState.produtos.find(x => x.id === id);
  if (!p) return;

  p.quantidade = (p.quantidade || 0) + qtd;
  p.updated_at = new Date().toISOString();

  const mov = {
    id: generateId(),
    tipo: 'entrada',
    produto_id: p.id,
    produto_nome: p.nome,
    quantidade: qtd,
    local_origem: 'fornecedor',
    local_destino: p.local || 'armazem',
    observacao: obs,
    valor: qtd * parseFloat(p.preco_aquisicao || p.precoAquisicao || 0),
    data: getToday(),
    created_at: new Date().toISOString()
  };

  const idx = AppState.produtos.findIndex(x => x.id === id);
  AppState.produtos[idx] = p;
  AppState.movimentacoes.push(mov);

  AppState.save('produtos');
  AppState.save('movimentacoes');

  closeModal();
  showToast(`Entrada de ${qtd} unidades de ${p.nome} registrada!`, 'success');
  refreshCurrentPage();
}

function editarProduto(id) {
  const p = AppState.produtos.find(x => x.id === id);
  if (!p) return;

  const catOptions = AppState.categorias.map(c => 
    `<option value="${c.id}" ${c.id === p.categoria ? 'selected' : ''}>${escapeHtml(c.nome)}</option>`
  ).join('');

  const content = `
    <form id="editForm">
      <input type="hidden" id="editId" value="${p.id}">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Nome <span class="required">*</span></label>
          <input type="text" class="form-input" id="editNome" value="${escapeHtml(p.nome)}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Categoria</label>
          <select class="form-select" id="editCategoria">${catOptions}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Preco de Aquisicao <span class="required">*</span></label>
          <input type="number" class="form-input" id="editPrecoAquisicao" value="${p.preco_aquisicao || p.precoAquisicao || 0}" min="0" step="0.01" required>
        </div>
        <div class="form-group">
          <label class="form-label">Percentual de Lucro (%)</label>
          <input type="number" class="form-input" id="editPercentual" value="${p.percentual_lucro || p.percentualLucro || 0}" min="0" step="0.1">
        </div>
        <div class="form-group">
          <label class="form-label">Preco de Venda</label>
          <input type="number" class="form-input" id="editPrecoVenda" value="${p.preco_venda || p.precoVenda || 0}" min="0" step="0.01">
        </div>
        <div class="form-group">
          <label class="form-label">Quantidade</label>
          <input type="number" class="form-input" id="editQuantidade" value="${p.quantidade || 0}" min="0">
        </div>
      </div>
    </form>
  `;

  const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="salvarEdicao()">Salvar Alteracoes</button>
  `;

  openModal('Editar Produto', content, footer);
}

function salvarEdicao() {
  const id = document.getElementById('editId')?.value;
  const nome = document.getElementById('editNome')?.value;
  const categoria = document.getElementById('editCategoria')?.value;
  const precoAquisicao = parseFloat(document.getElementById('editPrecoAquisicao')?.value) || 0;
  const percentual = parseFloat(document.getElementById('editPercentual')?.value) || 0;
  const precoVenda = parseFloat(document.getElementById('editPrecoVenda')?.value) || 0;
  const quantidade = parseInt(document.getElementById('editQuantidade')?.value) || 0;

  if (!nome || precoAquisicao <= 0) {
    showToast('Preencha todos os campos obrigatorios!', 'error');
    return;
  }

  const idx = AppState.produtos.findIndex(x => x.id === id);
  if (idx === -1) return;

  AppState.produtos[idx] = {
    ...AppState.produtos[idx],
    nome,
    categoria,
    preco_aquisicao: precoAquisicao,
    precoAquisicao: precoAquisicao,
    percentual_lucro: percentual,
    percentualLucro: percentual,
    preco_venda: precoVenda || calcularPrecoVenda(precoAquisicao, percentual),
    precoVenda: precoVenda || calcularPrecoVenda(precoAquisicao, percentual),
    quantidade,
    updated_at: new Date().toISOString()
  };

  AppState.save('produtos');
  closeModal();
  showToast('Produto atualizado com sucesso!', 'success');
  refreshCurrentPage();
}

function removerProduto(id) {
  confirmDialog('Tem certeza que deseja remover este produto? Esta acao nao pode ser desfeita.', 
    () => {
      AppState.produtos = AppState.produtos.filter(p => p.id !== id);
      AppState.save('produtos');
      showToast('Produto removido!', 'warning');
      refreshCurrentPage();
    }
  );
}

function exportArmazem() {
  const produtos = AppState.produtos.filter(p => p.local === 'armazem' || !p.local);
  const data = produtos.map(p => ({
    Codigo: p.codigo || p.id?.substr(-8),
    Nome: p.nome,
    Categoria: getCategoryName(p.categoria),
    Quantidade: p.quantidade,
    'Preco Aquisicao': p.preco_aquisicao || p.precoAquisicao,
    'Percentual Lucro': p.percentual_lucro || p.percentualLucro,
    'Preco Venda': p.preco_venda || p.precoVenda,
    'Valor Total': (p.quantidade || 0) * (parseFloat(p.preco_venda || p.precoVenda || 0)),
    Local: p.local || 'armazem',
    'Data Atualizacao': p.updated_at
  }));
  exportData(data, 'armazem-produtos', 'xlsx');
}

function calcularPrecoVenda(precoAquisicao, percentual) {
  const p = percentual > 1 ? percentual / 100 : percentual;
  return precoAquisicao + (precoAquisicao * p);
}

// ============================================================
// MODULE: INVENTARIO (INVENTORY)
// ============================================================

function renderInventario(container) {
  const totalProdutos = AppState.produtos.length;
  const totalUnidades = AppState.produtos.reduce((s, p) => s + (parseFloat(p.quantidade) || 0), 0);
  const valorTotal = AppState.produtos.reduce((s, p) => {
    const preco = parseFloat(p.preco_venda || p.precoVenda || 0);
    const qtd = parseFloat(p.quantidade || 0);
    return s + (preco * qtd);
  }, 0);
  const lucroPotencial = AppState.produtos.reduce((s, p) => {
    const aquisicao = parseFloat(p.preco_aquisicao || p.precoAquisicao || 0);
    const venda = parseFloat(p.preco_venda || p.precoVenda || 0);
    const qtd = parseFloat(p.quantidade || 0);
    return s + ((venda - aquisicao) * qtd);
  }, 0);
  const estoqueBaixo = AppState.produtos.filter(p => (p.quantidade || 0) <= 5).length;

  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Inventario</h1>
        <p>Visao consolidada de todos os produtos</p>
      </div>

      <div class="card-grid">
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Total Produtos</span>
            <div class="stat-card-icon primary">${Icons.box}</div>
          </div>
          <div class="stat-card-value">${formatNumber(totalProdutos)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Unidades</span>
            <div class="stat-card-icon accent">${Icons.package}</div>
          </div>
          <div class="stat-card-value">${formatNumber(totalUnidades)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Valor Stock</span>
            <div class="stat-card-icon success">${Icons.dollar}</div>
          </div>
          <div class="stat-card-value">${formatCurrency(valorTotal)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Lucro Potencial</span>
            <div class="stat-card-icon warning">${Icons.trendUp}</div>
          </div>
          <div class="stat-card-value">${formatCurrency(lucroPotencial)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Estoque Baixo</span>
            <div class="stat-card-icon danger">${Icons.alert}</div>
          </div>
          <div class="stat-card-value">${formatNumber(estoqueBaixo)}</div>
        </div>
      </div>

      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Todos os Produtos</span>
          <div class="btn-group">
            <button class="btn btn-outline btn-sm" onclick="exportInventario('todos')">${Icons.export} Exportar</button>
          </div>
        </div>
        <div class="content-card-body">
          <div class="filter-bar">
            <div class="search-input">
              ${Icons.search}
              <input type="text" id="inventSearch" placeholder="Buscar produtos..." onkeyup="filterInventario()">
            </div>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr><th>Codigo</th><th>Produto</th><th>Categoria</th><th>Local</th><th>Qtd</th><th>Preco Venda</th><th>Valor Total</th><th>Status</th></tr>
              </thead>
              <tbody id="inventTable">
                ${renderInventarioRows(AppState.produtos)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderInventarioRows(produtos) {
  if (produtos.length === 0) return '';

  return produtos.map(p => {
    const valorTotal = (parseFloat(p.quantidade) || 0) * (parseFloat(p.preco_venda || p.precoVenda || 0));
    const isLow = (p.quantidade || 0) <= 5;

    return `
      <tr data-nome="${escapeHtml(p.nome).toLowerCase()}">
        <td><code>${escapeHtml(p.codigo || p.id?.substr(-8) || '-')}</code></td>
        <td><strong>${escapeHtml(p.nome)}</strong></td>
        <td><span class="badge badge-neutral">${escapeHtml(getCategoryName(p.categoria))}</span></td>
        <td>${p.local === 'loja' ? 'Loja' : 'Armazem'}</td>
        <td style="color:${isLow ? 'var(--danger)' : 'inherit'};font-weight:${isLow ? '600' : 'normal'}">${p.quantidade || 0}</td>
        <td>${formatCurrency(p.preco_venda || p.precoVenda || 0)}</td>
        <td>${formatCurrency(valorTotal)}</td>
        <td><span class="badge ${isLow ? 'badge-danger' : 'badge-success'}">${isLow ? 'Critico' : 'OK'}</span></td>
      </tr>
    `;
  }).join('');
}

function filterInventario() {
  const search = document.getElementById('inventSearch')?.value.toLowerCase() || '';
  const rows = document.querySelectorAll('#inventTable tr');
  rows.forEach(row => {
    const nome = row.dataset.nome || '';
    row.style.display = nome.includes(search) ? '' : 'none';
  });
}

function exportInventario(tipo) {
  let produtos = AppState.produtos;
  if (tipo === 'armazem') produtos = produtos.filter(p => p.local === 'armazem' || !p.local);
  if (tipo === 'loja') produtos = produtos.filter(p => p.local === 'loja');
  if (tipo === 'baixo') produtos = produtos.filter(p => (p.quantidade || 0) <= 5);

  const data = produtos.map(p => ({
    Codigo: p.codigo || p.id?.substr(-8),
    Nome: p.nome,
    Categoria: getCategoryName(p.categoria),
    Local: p.local || 'armazem',
    Quantidade: p.quantidade,
    'Preco Aquisicao': p.preco_aquisicao || p.precoAquisicao,
    'Preco Venda': p.preco_venda || p.precoVenda,
    'Valor Total': (p.quantidade || 0) * (parseFloat(p.preco_venda || p.precoVenda || 0)),
    Status: (p.quantidade || 0) <= 5 ? 'Critico' : 'OK'
  }));
  exportData(data, `inventario-${tipo}`, 'xlsx');
}

// ============================================================
// MODULE: COMBUSTIVEIS (FUEL)
// ============================================================

function renderCombustiveis(container) {
  const tipos = ['Gasolina', 'Diesel', 'Petroleo', 'Lubrificante'];
  const hoje = getToday();

  const stats = tipos.map(tipo => {
    const vendas = AppState.combustiveis.filter(c => c.tipo === tipo && !c.is_entrada);
    const entradas = AppState.combustiveis.filter(c => c.tipo === tipo && c.is_entrada);
    const litrosVendidos = vendas.reduce((s, c) => s + (parseFloat(c.litros) || 0), 0);
    const receita = vendas.reduce((s, c) => s + (parseFloat(c.total_venda) || 0), 0);
    const lucro = vendas.reduce((s, c) => s + (parseFloat(c.lucro) || 0), 0);
    const litrosEntrada = entradas.reduce((s, c) => s + (parseFloat(c.litros) || 0), 0);

    return { tipo, litrosVendidos, receita, lucro, litrosEntrada, transacoes: vendas.length };
  });

  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Combustiveis</h1>
        <p>Gestao de combustiveis e lubrificantes</p>
      </div>

      <div class="fuel-grid">
        ${stats.map(s => `
          <div class="fuel-card">
            <div class="fuel-card-header">
              <div class="fuel-icon" style="background:linear-gradient(135deg, var(--warning)20, var(--warning)10)">
                <span style="font-size:1.5rem">\u26FD</span>
              </div>
              <div class="fuel-info">
                <h3>${s.tipo}</h3>
                <p>${s.transacoes} transacoes hoje</p>
              </div>
            </div>
            <div class="fuel-card-body">
              <div class="fuel-stats">
                <div class="fuel-stat">
                  <div class="fuel-stat-value">${formatNumber(s.litrosVendidos)}</div>
                  <div class="fuel-stat-label">Litros Vendidos</div>
                </div>
                <div class="fuel-stat">
                  <div class="fuel-stat-value">${formatCurrency(s.receita)}</div>
                  <div class="fuel-stat-label">Receita</div>
                </div>
                <div class="fuel-stat">
                  <div class="fuel-stat-value">${formatCurrency(s.lucro)}</div>
                  <div class="fuel-stat-label">Lucro</div>
                </div>
                <div class="fuel-stat">
                  <div class="fuel-stat-value">${formatNumber(s.litrosEntrada)}</div>
                  <div class="fuel-stat-label">Stock Entrada</div>
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Operacoes</span>
        </div>
        <div class="content-card-body">
          <div class="btn-group">
            <button class="btn btn-success" onclick="venderCombustivel()">${Icons.fuel} Vender Combustivel</button>
            <button class="btn btn-primary" onclick="entradaCombustivel()">${Icons.add} Entrada de Combustivel</button>
            <button class="btn btn-outline" onclick="exportCombustiveis()">${Icons.export} Exportar</button>
          </div>
        </div>
      </div>

      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Historico de Vendas</span>
        </div>
        <div class="content-card-body">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr><th>Data</th><th>Tipo</th><th>Bomba</th><th>Litros</th><th>Preco/L</th><th>Total</th><th>Lucro</th></tr>
              </thead>
              <tbody>
                ${AppState.combustiveis.filter(c => !c.is_entrada).slice(-50).reverse().map(c => `
                  <tr>
                    <td>${formatDate(c.created_at || c.data)}</td>
                    <td>${c.tipo}</td>
                    <td>${c.bomba || '-'}</td>
                    <td>${formatNumber(c.litros)}</td>
                    <td>${formatCurrency(c.preco_venda || 0)}</td>
                    <td>${formatCurrency(c.total_venda || 0)}</td>
                    <td style="color:var(--success)">${formatCurrency(c.lucro || 0)}</td>
                  </tr>
                `).join('') || '<tr><td colspan="7" style="text-align:center">Nenhuma venda registrada</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

function venderCombustivel() {
  const content = `
    <form id="combForm">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Tipo de Combustivel <span class="required">*</span></label>
          <select class="form-select" id="combTipo" required>
            <option value="">Selecione...</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diesel">Diesel</option>
            <option value="Petroleo">Petroleo</option>
            <option value="Lubrificante">Lubrificante</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Bomba</label>
          <input type="text" class="form-input" id="combBomba" placeholder="Ex: Bomba 1">
        </div>
        <div class="form-group">
          <label class="form-label">Litros <span class="required">*</span></label>
          <input type="number" class="form-input" id="combLitros" min="0.01" step="0.01" required>
        </div>
        <div class="form-group">
          <label class="form-label">Preco Venda/L <span class="required">*</span></label>
          <input type="number" class="form-input" id="combPrecoVenda" min="0.01" step="0.01" required>
        </div>
        <div class="form-group">
          <label class="form-label">Preco Compra/L <span class="required">*</span></label>
          <input type="number" class="form-input" id="combPrecoCompra" min="0.01" step="0.01" required>
        </div>
        <div class="form-group">
          <label class="form-label">Total Venda</label>
          <input type="text" class="form-input" id="combTotal" disabled>
        </div>
      </div>
    </form>
    <script>
      (function(){
        const litros = document.getElementById('combLitros');
        const precoVenda = document.getElementById('combPrecoVenda');
        const total = document.getElementById('combTotal');
        function calc() {
          const l = parseFloat(litros?.value) || 0;
          const pv = parseFloat(precoVenda?.value) || 0;
          if(total) total.value = new Intl.NumberFormat('pt-AO', {style:'currency', currency:'AOA'}).format(l * pv);
        }
        if(litros) litros.oninput = calc;
        if(precoVenda) precoVenda.oninput = calc;
      })();
    <\/script>
  `;

  const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-success" onclick="confirmarVendaCombustivel()">Confirmar Venda</button>
  `;

  openModal('Vender Combustivel', content, footer);
}

function confirmarVendaCombustivel() {
  const tipo = document.getElementById('combTipo')?.value;
  const bomba = document.getElementById('combBomba')?.value || '';
  const litros = parseFloat(document.getElementById('combLitros')?.value) || 0;
  const precoVenda = parseFloat(document.getElementById('combPrecoVenda')?.value) || 0;
  const precoCompra = parseFloat(document.getElementById('combPrecoCompra')?.value) || 0;

  if (!tipo || litros <= 0 || precoVenda <= 0 || precoCompra <= 0) {
    showToast('Preencha todos os campos obrigatorios!', 'error');
    return;
  }

  const totalVenda = litros * precoVenda;
  const lucro = litros * (precoVenda - precoCompra);

  const registro = {
    id: generateId(),
    tipo,
    bomba,
    litros,
    preco_venda: precoVenda,
    preco_compra: precoCompra,
    total_venda: totalVenda,
    lucro,
    is_entrada: false,
    data: getToday(),
    created_at: new Date().toISOString()
  };

  AppState.combustiveis.push(registro);
  AppState.save('combustiveis');

  closeModal();
  showToast(`Venda de ${litros}L de ${tipo} registrada! Lucro: ${formatCurrency(lucro)}`, 'success');
  refreshCurrentPage();
}

function entradaCombustivel() {
  const content = `
    <form id="combEntradaForm">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Tipo de Combustivel <span class="required">*</span></label>
          <select class="form-select" id="combEntradaTipo" required>
            <option value="">Selecione...</option>
            <option value="Gasolina">Gasolina</option>
            <option value="Diesel">Diesel</option>
            <option value="Petroleo">Petroleo</option>
            <option value="Lubrificante">Lubrificante</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Litros <span class="required">*</span></label>
          <input type="number" class="form-input" id="combEntradaLitros" min="0.01" step="0.01" required>
        </div>
        <div class="form-group">
          <label class="form-label">Preco Compra/L <span class="required">*</span></label>
          <input type="number" class="form-input" id="combEntradaPreco" min="0.01" step="0.01" required>
        </div>
        <div class="form-group">
          <label class="form-label">Fornecedor</label>
          <input type="text" class="form-input" id="combEntradaFornecedor" placeholder="Nome do fornecedor">
        </div>
      </div>
    </form>
  `;

  const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="confirmarEntradaCombustivel()">Registrar Entrada</button>
  `;

  openModal('Entrada de Combustivel', content, footer);
}

function confirmarEntradaCombustivel() {
  const tipo = document.getElementById('combEntradaTipo')?.value;
  const litros = parseFloat(document.getElementById('combEntradaLitros')?.value) || 0;
  const preco = parseFloat(document.getElementById('combEntradaPreco')?.value) || 0;
  const fornecedor = document.getElementById('combEntradaFornecedor')?.value || '';

  if (!tipo || litros <= 0 || preco <= 0) {
    showToast('Preencha todos os campos obrigatorios!', 'error');
    return;
  }

  const registro = {
    id: generateId(),
    tipo,
    litros,
    preco_compra: preco,
    fornecedor,
    is_entrada: true,
    data: getToday(),
    created_at: new Date().toISOString()
  };

  AppState.combustiveis.push(registro);
  AppState.save('combustiveis');

  closeModal();
  showToast(`Entrada de ${litros}L de ${tipo} registrada!`, 'success');
  refreshCurrentPage();
}

function exportCombustiveis() {
  const data = AppState.combustiveis.map(c => ({
    Data: c.created_at || c.data,
    Tipo: c.tipo,
    Bomba: c.bomba || '-',
    Litros: c.litros,
    'Preco Venda': c.preco_venda || 0,
    'Preco Compra': c.preco_compra || 0,
    'Total Venda': c.total_venda || 0,
    Lucro: c.lucro || 0,
    Fornecedor: c.fornecedor || '-',
    Tipo_Operacao: c.is_entrada ? 'Entrada' : 'Venda'
  }));
  exportData(data, 'combustiveis', 'xlsx');
}

// ============================================================
// MODULE: RELATORIOS (REPORTS)
// ============================================================

function renderRelatorios(container) {
  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Relatorios</h1>
        <p>Analise e exporte dados do seu negocio</p>
      </div>

      <div class="tabs">
        <button class="tab active" onclick="switchRelatorioTab('vendas', this)">Vendas</button>
        <button class="tab" onclick="switchRelatorioTab('financeiro', this)">Financeiro</button>
        <button class="tab" onclick="switchRelatorioTab('combustiveis', this)">Combustiveis</button>
        <button class="tab" onclick="switchRelatorioTab('inventario', this)">Inventario</button>
        <button class="tab" onclick="switchRelatorioTab('fechamento', this)">Fechamento</button>
      </div>

      <div id="relatorio-content">
        ${renderRelatorioVendas()}
      </div>
    </div>
  `;
}

function switchRelatorioTab(tab, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');

  const content = document.getElementById('relatorio-content');
  if (!content) return;

  switch(tab) {
    case 'vendas': content.innerHTML = renderRelatorioVendas(); break;
    case 'financeiro': content.innerHTML = renderRelatorioFinanceiro(); break;
    case 'combustiveis': content.innerHTML = renderRelatorioCombustiveis(); break;
    case 'inventario': content.innerHTML = renderRelatorioInventario(); break;
    case 'fechamento': content.innerHTML = renderRelatorioFechamento(); break;
  }
}

function renderRelatorioVendas() {
  const relatorio = Formulas.gerarRelatorioVendas(AppState.vendas, 'mes');

  return `
    <div class="content-card">
      <div class="content-card-header">
        <span class="content-card-title">Relatorio de Vendas - ${relatorio.periodo}</span>
        <div class="btn-group">
          <button class="btn btn-outline btn-sm" onclick="exportRelatorio('vendas')">${Icons.export} Exportar</button>
        </div>
      </div>
      <div class="content-card-body">
        <div class="card-grid" style="margin-bottom:20px">
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Total Vendas</span>
              <div class="stat-card-icon primary">${Icons.dollar}</div>
            </div>
            <div class="stat-card-value">${formatCurrency(relatorio.totalVendido)}</div>
            <div class="stat-card-change neutral">${relatorio.totalVendas} transacoes</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Lucro Total</span>
              <div class="stat-card-icon success">${Icons.trendUp}</div>
            </div>
            <div class="stat-card-value">${formatCurrency(relatorio.totalLucro)}</div>
            <div class="stat-card-change positive">${relatorio.margemLucro.toFixed(1)}% margem</div>
          </div>
        </div>

        <h4 style="margin-bottom:12px">Por Categoria</h4>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>Categoria</th><th>Quantidade</th><th>Total</th><th>Lucro</th></tr>
            </thead>
            <tbody>
              ${Object.entries(relatorio.porCategoria).map(([cat, data]) => `
                <tr>
                  <td><strong>${escapeHtml(getCategoryName(cat))}</strong></td>
                  <td>${data.quantidade}</td>
                  <td>${formatCurrency(data.total)}</td>
                  <td style="color:var(--success)">${formatCurrency(data.lucro)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <h4 style="margin:20px 0 12px">Top Produtos</h4>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>Produto</th><th>Quantidade</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${relatorio.topProdutos.map(p => `
                <tr>
                  <td><strong>${escapeHtml(p.nome)}</strong></td>
                  <td>${p.quantidade}</td>
                  <td>${formatCurrency(p.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderRelatorioFinanceiro() {
  const vendasTotal = AppState.vendas.reduce((s, v) => s + (parseFloat(v.total) || 0), 0);
  const lucroTotal = AppState.vendas.reduce((s, v) => s + (parseFloat(v.lucro) || 0), 0);
  const combustivelTotal = AppState.combustiveis.filter(c => !c.is_entrada).reduce((s, c) => s + (parseFloat(c.total_venda) || 0), 0);
  const combustivelLucro = AppState.combustiveis.filter(c => !c.is_entrada).reduce((s, c) => s + (parseFloat(c.lucro) || 0), 0);

  return `
    <div class="content-card">
      <div class="content-card-header">
        <span class="content-card-title">Relatorio Financeiro</span>
        <button class="btn btn-outline btn-sm" onclick="exportRelatorio('financeiro')">${Icons.export} Exportar</button>
      </div>
      <div class="content-card-body">
        <div class="close-summary">
          <h3>Resumo Financeiro</h3>
          <div class="close-grid">
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(vendasTotal)}</div>
              <div class="close-item-label">Receita Loja</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(lucroTotal)}</div>
              <div class="close-item-label">Lucro Loja</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(combustivelTotal)}</div>
              <div class="close-item-label">Receita Combustivel</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(combustivelLucro)}</div>
              <div class="close-item-label">Lucro Combustivel</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(vendasTotal + combustivelTotal)}</div>
              <div class="close-item-label">Receita Total</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(lucroTotal + combustivelLucro)}</div>
              <div class="close-item-label">Lucro Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRelatorioCombustiveis() {
  const relatorio = Formulas.gerarRelatorioCombustivel(AppState.combustiveis.filter(c => !c.is_entrada));

  return `
    <div class="content-card">
      <div class="content-card-header">
        <span class="content-card-title">Relatorio de Combustiveis</span>
        <button class="btn btn-outline btn-sm" onclick="exportRelatorio('combustiveis')">${Icons.export} Exportar</button>
      </div>
      <div class="content-card-body">
        <div class="card-grid" style="margin-bottom:20px">
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Total Litros</span>
              <div class="stat-card-icon primary">${Icons.fuel}</div>
            </div>
            <div class="stat-card-value">${formatNumber(relatorio.totalLitros)} L</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Receita</span>
              <div class="stat-card-icon accent">${Icons.dollar}</div>
            </div>
            <div class="stat-card-value">${formatCurrency(relatorio.totalReceita)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Lucro</span>
              <div class="stat-card-icon success">${Icons.trendUp}</div>
            </div>
            <div class="stat-card-value">${formatCurrency(relatorio.totalLucro)}</div>
            <div class="stat-card-change positive">${relatorio.margemMedia.toFixed(1)}% margem</div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>Tipo</th><th>Litros</th><th>Receita</th><th>Lucro</th><th>Transacoes</th></tr>
            </thead>
            <tbody>
              ${relatorio.porTipo.map(t => `
                <tr>
                  <td><strong>${t.tipo}</strong></td>
                  <td>${formatNumber(t.litros)} L</td>
                  <td>${formatCurrency(t.receita)}</td>
                  <td style="color:var(--success)">${formatCurrency(t.lucro)}</td>
                  <td>${t.transacoes}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderRelatorioInventario() {
  const relatorio = Formulas.gerarRelatorioInventario(AppState.produtos);

  return `
    <div class="content-card">
      <div class="content-card-header">
        <span class="content-card-title">Relatorio de Inventario</span>
        <button class="btn btn-outline btn-sm" onclick="exportRelatorio('inventario')">${Icons.export} Exportar</button>
      </div>
      <div class="content-card-body">
        <div class="card-grid" style="margin-bottom:20px">
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Armazem</span>
              <div class="stat-card-icon primary">${Icons.warehouse}</div>
            </div>
            <div class="stat-card-value">${formatNumber(relatorio.armazem.quantidadeProdutos)}</div>
            <div class="stat-card-change neutral">${formatCurrency(relatorio.armazem.valorTotal)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Loja</span>
              <div class="stat-card-icon warning">${Icons.store}</div>
            </div>
            <div class="stat-card-value">${formatNumber(relatorio.loja.quantidadeProdutos)}</div>
            <div class="stat-card-change neutral">${formatCurrency(relatorio.loja.valorTotal)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Lucro Potencial</span>
              <div class="stat-card-icon success">${Icons.trendUp}</div>
            </div>
            <div class="stat-card-value">${formatCurrency(relatorio.geral.lucroPotencial)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Estoque Baixo</span>
              <div class="stat-card-icon danger">${Icons.alert}</div>
            </div>
            <div class="stat-card-value">${formatNumber(relatorio.geral.produtosEstoqueBaixo)}</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRelatorioFechamento() {
  const today = getToday();
  const todayVendas = AppState.vendas.filter(v => (v.data || '').startsWith(today));
  const todayComb = AppState.combustiveis.filter(c => !c.is_entrada && (c.data || '').startsWith(today));

  const totalVendas = todayVendas.reduce((s, v) => s + (parseFloat(v.total) || 0), 0);
  const lucroVendas = todayVendas.reduce((s, v) => s + (parseFloat(v.lucro) || 0), 0);
  const totalComb = todayComb.reduce((s, c) => s + (parseFloat(c.total_venda) || 0), 0);
  const lucroComb = todayComb.reduce((s, c) => s + (parseFloat(c.lucro) || 0), 0);

  return `
    <div class="content-card">
      <div class="content-card-header">
        <span class="content-card-title">Fechamento do Dia - ${today}</span>
        <div class="btn-group">
          <button class="btn btn-primary btn-sm" onclick="encerrarDia()">${Icons.check} Encerrar Dia</button>
          <button class="btn btn-outline btn-sm" onclick="exportRelatorio('fechamento')">${Icons.export} Exportar</button>
        </div>
      </div>
      <div class="content-card-body">
        <div class="close-summary">
          <h3>Resumo do Dia</h3>
          <div class="close-grid">
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(totalVendas)}</div>
              <div class="close-item-label">Vendas Loja</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(lucroVendas)}</div>
              <div class="close-item-label">Lucro Loja</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(totalComb)}</div>
              <div class="close-item-label">Vendas Combustivel</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(lucroComb)}</div>
              <div class="close-item-label">Lucro Combustivel</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(totalVendas + totalComb)}</div>
              <div class="close-item-label">Total Geral</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(lucroVendas + lucroComb)}</div>
              <div class="close-item-label">Lucro Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function encerrarDia() {
  const today = getToday();
  const todayVendas = AppState.vendas.filter(v => (v.data || '').startsWith(today));
  const todayComb = AppState.combustiveis.filter(c => !c.is_entrada && (c.data || '').startsWith(today));

  const fechamento = {
    id: generateId(),
    data: today,
    vendas_loja: {
      quantidade: todayVendas.length,
      total: todayVendas.reduce((s, v) => s + (parseFloat(v.total) || 0), 0),
      lucro: todayVendas.reduce((s, v) => s + (parseFloat(v.lucro) || 0), 0)
    },
    vendas_combustivel: {
      quantidade: todayComb.length,
      total: todayComb.reduce((s, c) => s + (parseFloat(c.total_venda) || 0), 0),
      lucro: todayComb.reduce((s, c) => s + (parseFloat(c.lucro) || 0), 0)
    },
    created_at: new Date().toISOString()
  };

  AppState.relatorios.push(fechamento);
  AppState.save('relatorios');

  showToast('Dia encerrado com sucesso!', 'success');
  refreshCurrentPage();
}

function exportRelatorio(tipo) {
  let data = [];

  if (tipo === 'vendas') {
    data = AppState.vendas.map(v => ({
      Data: v.created_at || v.data,
      Produto: v.produto_nome || v.produto,
      Quantidade: v.quantidade,
      'Preco Unitario': v.preco_unitario,
      Total: v.total,
      Lucro: v.lucro
    }));
  } else if (tipo === 'financeiro') {
    data = AppState.vendas.map(v => ({
      Data: v.created_at || v.data,
      Produto: v.produto_nome || v.produto,
      Total: v.total,
      Lucro: v.lucro
    }));
  } else if (tipo === 'combustiveis') {
    data = AppState.combustiveis.map(c => ({
      Data: c.created_at || c.data,
      Tipo: c.tipo,
      Litros: c.litros,
      'Total Venda': c.total_venda,
      Lucro: c.lucro
    }));
  } else if (tipo === 'inventario') {
    data = AppState.produtos.map(p => ({
      Nome: p.nome,
      Categoria: getCategoryName(p.categoria),
      Quantidade: p.quantidade,
      'Preco Venda': p.preco_venda || p.precoVenda,
      'Valor Total': (p.quantidade || 0) * (parseFloat(p.preco_venda || p.precoVenda || 0))
    }));
  } else if (tipo === 'fechamento') {
    data = AppState.relatorios.map(r => ({
      Data: r.data,
      'Vendas Loja Qtd': r.vendas_loja?.quantidade,
      'Vendas Loja Total': r.vendas_loja?.total,
      'Vendas Loja Lucro': r.vendas_loja?.lucro,
      'Combustivel Qtd': r.vendas_combustivel?.quantidade,
      'Combustivel Total': r.vendas_combustivel?.total,
      'Combustivel Lucro': r.vendas_combustivel?.lucro,
      'Total Geral': (r.vendas_loja?.total || 0) + (r.vendas_combustivel?.total || 0)
    }));
  }

  exportData(data, `relatorio-${tipo}`, 'xlsx');
}

// ============================================================
// MODULE: RECONCILIACAO - 30 FORMATOS
// ============================================================

const FORMATOS_SUPORTADOS = [
  { ext: 'csv', parser: 'csv', delimiter: ',' },
  { ext: 'csv', parser: 'csv', delimiter: ';' },
  { ext: 'tsv', parser: 'csv', delimiter: '	' },
  { ext: 'txt', parser: 'csv', delimiter: ',' },
  { ext: 'txt', parser: 'csv', delimiter: ';' },
  { ext: 'txt', parser: 'csv', delimiter: '	' },
  { ext: 'txt', parser: 'csv', delimiter: '|' },
  { ext: 'xlsx', parser: 'excel' },
  { ext: 'xls', parser: 'excel' },
  { ext: 'xlsm', parser: 'excel' },
  { ext: 'xlsb', parser: 'excel' },
  { ext: 'ods', parser: 'excel' },
  { ext: 'fods', parser: 'excel' },
  { ext: 'json', parser: 'json' },
  { ext: 'jsonl', parser: 'jsonl' },
  { ext: 'xml', parser: 'xml' },
  { ext: 'html', parser: 'html' },
  { ext: 'htm', parser: 'html' },
  { ext: 'yaml', parser: 'yaml' },
  { ext: 'yml', parser: 'yaml' },
  { ext: 'sql', parser: 'sql' },
  { ext: 'pos', parser: 'csv', delimiter: ',' },
  { ext: 'pos', parser: 'csv', delimiter: ';' },
  { ext: 'dat', parser: 'csv', delimiter: ',' },
  { ext: 'dat', parser: 'csv', delimiter: ';' },
  { ext: 'dat', parser: 'csv', delimiter: '|' },
  { ext: 'prn', parser: 'csv', delimiter: ',' },
  { ext: 'prn', parser: 'csv', delimiter: ';' }
];

const MAPEAMENTO_COLUNAS = {
  nome: ['nome', 'produto', 'product', 'descricao', 'description', 'item', 'artigo', 'mercadoria', 'designacao', 'denominacao', 'art', 'desc', 'merc', 'prod'],
  quantidade: ['quantidade', 'qtd', 'qty', 'quantity', 'quant', 'qtdade', 'unidades', 'units', 'uni', 'qt', 'qtds'],
  preco_unitario: ['preco_unitario', 'preco_un', 'unit_price', 'price', 'preco', 'valor_unitario', 'vlr_unit', 'p_unit', 'unit', 'precounitario', 'valorunidade'],
  total: ['total', 'valor_total', 'total_venda', 'amount', 'value', 'vlr_total', 'total_venda', 'valortotal', 'montante', 'importe'],
  data: ['data', 'date', 'data_venda', 'sale_date', 'dt', 'dia', 'datahora', 'datetime', 'timestamp'],
  hora: ['hora', 'time', 'hora_venda', 'hr', 'horario'],
  pagamento: ['pagamento', 'payment', 'forma_pagamento', 'payment_method', 'fpagto', 'meio_pagamento', 'modo_pagamento'],
  documento: ['documento', 'doc', 'recibo', 'receipt', 'invoice', 'fatura', 'numero', 'num', 'n_doc', 'ndoc', 'ticket', 'comprovativo'],
  vendedor: ['vendedor', 'seller', 'cashier', 'caixa', 'operator', 'operador', 'funcionario', 'colaborador', 'user', 'usuario'],
  categoria: ['categoria', 'category', 'tipo', 'type', 'grupo', 'group', 'familia', 'fam', 'secao']
};

let reconciliacaoData = {
  vendasCaixa: [],
  vendasERP: [],
  diferencas: [],
  periodo: 'dia'
};

function renderReconciliacao(container) {
  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Reconciliacao de Vendas</h1>
        <p>Compare vendas do caixa com o sistema e sincronize</p>
      </div>

      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Importar Relatorio do Caixa</span>
          <span class="badge badge-info">30 formatos suportados</span>
        </div>
        <div class="content-card-body">
          <div class="upload-area" onclick="document.getElementById('reconcImport').click()" 
               ondragover="event.preventDefault();this.classList.add('dragover')" 
               ondragleave="this.classList.remove('dragover')"
               ondrop="handleReconcDrop(event)">
            ${Icons.upload}
            <h3>Importar vendas do caixa</h3>
            <p>Arraste ou clique para selecionar (CSV, XLSX, XLS, ODS, JSON, XML, HTML, TXT, SQL, YAML, TSV, DAT, POS, PRN)</p>
            <input type="file" id="reconcImport" style="display:none" 
                   accept=".csv,.xlsx,.xls,.xlsm,.xlsb,.ods,.fods,.json,.jsonl,.xml,.html,.htm,.txt,.sql,.yaml,.yml,.tsv,.dat,.pos,.prn" 
                   onchange="handleReconcImport(this)" multiple>
          </div>

          <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px">
            ${[...new Set(FORMATOS_SUPORTADOS.map(f => f.ext))].map(ext => `<span class="badge badge-neutral" style="font-size:0.7rem">.${ext}</span>`).join('')}
          </div>

          <div id="reconcPreview" style="margin-top:16px"></div>
        </div>
      </div>

      <div id="reconcResultado" style="display:none">
        <div class="card-grid" style="margin-bottom:20px">
          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Total Caixa</span>
              <div class="stat-card-icon accent">${Icons.dollar}</div>
            </div>
            <div class="stat-card-value" id="recTotalCaixa">0,00 AOA</div>
            <div class="stat-card-change neutral" id="recQtdCaixa">0 vendas</div>
          </div>

          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Total ERP</span>
              <div class="stat-card-icon primary">${Icons.store}</div>
            </div>
            <div class="stat-card-value" id="recTotalERP">0,00 AOA</div>
            <div class="stat-card-change neutral" id="recQtdERP">0 vendas</div>
          </div>

          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Diferenca</span>
              <div class="stat-card-icon danger" id="recIconDiff">${Icons.alert}</div>
            </div>
            <div class="stat-card-value" id="recDiferenca" style="color:var(--danger)">0,00 AOA</div>
            <div class="stat-card-change" id="recStatusDiff">Verificando...</div>
          </div>

          <div class="stat-card">
            <div class="stat-card-header">
              <span class="stat-card-title">Taxa de Acerto</span>
              <div class="stat-card-icon success">${Icons.check}</div>
            </div>
            <div class="stat-card-value" id="recTaxa">0%</div>
            <div class="stat-card-change" id="recTaxaStatus">Vendas coincidentes</div>
          </div>
        </div>

        <div class="content-card">
          <div class="content-card-header">
            <span class="content-card-title">Diferencas Encontradas</span>
            <div class="btn-group">
              <button class="btn btn-success btn-sm" onclick="sincronizarTudo()">${Icons.check} Sincronizar Tudo</button>
              <button class="btn btn-outline btn-sm" onclick="exportarReconciliacao()">${Icons.export} Exportar</button>
            </div>
          </div>
          <div class="content-card-body">
            <div class="table-responsive">
              <table class="data-table" id="reconcTable">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Produto</th>
                    <th>Qtd Caixa</th>
                    <th>Qtd ERP</th>
                    <th>Total Caixa</th>
                    <th>Total ERP</th>
                    <th>Diferenca</th>
                    <th>Acao</th>
                  </tr>
                </thead>
                <tbody id="reconcTableBody"></tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="content-card" style="margin-top:20px">
        <div class="content-card-header">
          <span class="content-card-title">Historico de Encerramento</span>
          <div class="btn-group">
            <button class="btn btn-sm btn-primary" onclick="mudarPeriodoEncerramento('dia', this)">Diario</button>
            <button class="btn btn-sm btn-ghost" onclick="mudarPeriodoEncerramento('mes', this)">Mensal</button>
            <button class="btn btn-sm btn-ghost" onclick="mudarPeriodoEncerramento('ano', this)">Anual</button>
          </div>
        </div>
        <div class="content-card-body" id="encerramentoContent">
          ${renderEncerramentos('dia')}
        </div>
      </div>
    </div>
  `;
}

function detectarColunas(headers) {
  const mapa = {};
  headers.forEach((header, index) => {
    const h = header.toLowerCase().trim().replace(/[_\-\s]/g, '');
    for (const [campo, sinonimos] of Object.entries(MAPEAMENTO_COLUNAS)) {
      for (const sinonimo of sinonimos) {
        const s = sinonimo.toLowerCase().replace(/[_\-\s]/g, '');
        if (h === s || h.includes(s) || s.includes(h)) {
          mapa[campo] = index;
          break;
        }
      }
    }
  });
  return mapa;
}

function parseReconciliacao(content, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const formatos = FORMATOS_SUPORTADOS.filter(f => f.ext === ext);

  if (formatos.length === 0) {
    throw new Error(`Formato .${ext} nao suportado`);
  }

  for (const formato of formatos) {
    try {
      switch (formato.parser) {
        case 'csv': return parseCSVReconciliacao(content, formato.delimiter);
        case 'json': return parseJSONReconciliacao(content);
        case 'jsonl': return parseJSONLReconciliacao(content);
        case 'xml': return parseXMLReconciliacao(content);
        case 'html': return parseHTMLReconciliacao(content);
        case 'yaml': return parseYAMLReconciliacao(content);
        case 'sql': return parseSQLReconciliacao(content);
        case 'excel': return parseCSVReconciliacao(content, ',');
        default: continue;
      }
    } catch (e) { continue; }
  }

  throw new Error('Nao foi possivel parsear o arquivo');
}

function parseCSVReconciliacao(content, delimiter = ',') {
  const lines = content.split(/?
/).filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
  const mapa = detectarColunas(headers);

  if (!mapa.nome || !mapa.total) {
    throw new Error('Colunas obrigatorias nao encontradas: nome/produto e total');
  }

  const results = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
    if (values.length < 2) continue;

    const qtd = mapa.quantidade !== undefined ? parseFloat(values[mapa.quantidade]) || 1 : 1;
    const total = parseFloat(values[mapa.total].replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    const precoUnit = mapa.preco_unitario !== undefined 
      ? parseFloat(values[mapa.preco_unitario].replace(/[^\d.,]/g, '').replace(',', '.')) || 0
      : total / qtd;

    const row = {
      produto: values[mapa.nome] || 'Desconhecido',
      qtd: qtd,
      preco_unitario: precoUnit,
      total: total,
      data: mapa.data !== undefined ? values[mapa.data] : getToday(),
      hora: mapa.hora !== undefined ? values[mapa.hora] : '',
      pagamento: mapa.pagamento !== undefined ? values[mapa.pagamento] : '',
      documento: mapa.documento !== undefined ? values[mapa.documento] : '',
      vendedor: mapa.vendedor !== undefined ? values[mapa.vendedor] : '',
      categoria: mapa.categoria !== undefined ? values[mapa.categoria] : ''
    };

    if (row.produto && row.total > 0) results.push(row);
  }

  return results;
}

function parseJSONReconciliacao(content) {
  const data = JSON.parse(content);
  const array = Array.isArray(data) ? data : (data.vendas || data.data || data.items || []);

  return array.map(item => ({
    produto: item.nome || item.produto || item.product || item.descricao || 'Desconhecido',
    qtd: parseFloat(item.quantidade || item.qtd || item.quantity || item.qty || 1),
    preco_unitario: parseFloat(item.preco_unitario || item.unit_price || item.preco || item.price || 0),
    total: parseFloat(item.total || item.valor_total || item.amount || item.value || 0),
    data: item.data || item.date || item.data_venda || getToday(),
    hora: item.hora || item.time || '',
    pagamento: item.pagamento || item.payment || item.forma_pagamento || '',
    documento: item.documento || item.doc || item.recibo || item.receipt || '',
    vendedor: item.vendedor || item.seller || item.caixa || item.cashier || '',
    categoria: item.categoria || item.category || item.tipo || ''
  })).filter(r => r.produto && r.total > 0);
}

function parseJSONLReconciliacao(content) {
  const lines = content.split('
').filter(l => l.trim());
  const results = [];
  for (const line of lines) {
    try {
      const item = JSON.parse(line);
      results.push({
        produto: item.nome || item.produto || item.product || 'Desconhecido',
        qtd: parseFloat(item.quantidade || item.qtd || 1),
        preco_unitario: parseFloat(item.preco_unitario || item.preco || 0),
        total: parseFloat(item.total || item.valor || 0),
        data: item.data || item.date || getToday(),
        hora: item.hora || '',
        pagamento: item.pagamento || '',
        documento: item.documento || '',
        vendedor: item.vendedor || '',
        categoria: item.categoria || ''
      });
    } catch (e) { continue; }
  }
  return results.filter(r => r.produto && r.total > 0);
}

function parseXMLReconciliacao(content) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(content, 'text/xml');
  const items = xml.querySelectorAll('venda, sale, item, produto, product, row, record');

  return Array.from(items).map(item => {
    const getText = (tags) => {
      for (const tag of tags) {
        const el = item.querySelector(tag);
        if (el) return el.textContent.trim();
      }
      return '';
    };

    return {
      produto: getText(['nome', 'produto', 'product', 'descricao', 'description']),
      qtd: parseFloat(getText(['quantidade', 'qtd', 'quantity', 'qty'])) || 1,
      preco_unitario: parseFloat(getText(['preco_unitario', 'unit_price', 'price', 'preco'])) || 0,
      total: parseFloat(getText(['total', 'valor_total', 'amount', 'value'])) || 0,
      data: getText(['data', 'date', 'data_venda']) || getToday(),
      hora: getText(['hora', 'time']),
      pagamento: getText(['pagamento', 'payment']),
      documento: getText(['documento', 'doc', 'recibo', 'receipt']),
      vendedor: getText(['vendedor', 'seller', 'caixa']),
      categoria: getText(['categoria', 'category'])
    };
  }).filter(r => r.produto && r.total > 0);
}

function parseHTMLReconciliacao(content) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const tables = doc.querySelectorAll('table');
  const results = [];

  for (const table of tables) {
    const rows = table.querySelectorAll('tr');
    if (rows.length < 2) continue;

    const headers = Array.from(rows[0].querySelectorAll('th, td')).map(h => h.textContent.trim());
    const mapa = detectarColunas(headers);

    if (!mapa.nome || !mapa.total) continue;

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('td');
      if (cells.length < 2) continue;

      const getCell = (idx) => idx !== undefined && cells[idx] ? cells[idx].textContent.trim() : '';

      results.push({
        produto: getCell(mapa.nome) || 'Desconhecido',
        qtd: parseFloat(getCell(mapa.quantidade)) || 1,
        preco_unitario: parseFloat(getCell(mapa.preco_unitario)) || 0,
        total: parseFloat(getCell(mapa.total).replace(/[^\d.,]/g, '').replace(',', '.')) || 0,
        data: getCell(mapa.data) || getToday(),
        hora: getCell(mapa.hora),
        pagamento: getCell(mapa.pagamento),
        documento: getCell(mapa.documento),
        vendedor: getCell(mapa.vendedor),
        categoria: getCell(mapa.categoria)
      });
    }
  }

  return results.filter(r => r.produto && r.total > 0);
}

function parseYAMLReconciliacao(content) {
  const lines = content.split('
');
  const results = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('-')) {
      if (current && current.produto) results.push(current);
      current = {};
    }

    const match = trimmed.match(/^(\w+):\s*(.*)$/);
    if (match && current) {
      const key = match[1].toLowerCase();
      const val = match[2].trim();

      if (['nome', 'produto', 'product'].includes(key)) current.produto = val;
      if (['quantidade', 'qtd', 'qty', 'quantity'].includes(key)) current.qtd = parseFloat(val) || 1;
      if (['preco_unitario', 'unit_price', 'price', 'preco'].includes(key)) current.preco_unitario = parseFloat(val) || 0;
      if (['total', 'valor_total', 'amount', 'value'].includes(key)) current.total = parseFloat(val) || 0;
      if (['data', 'date'].includes(key)) current.data = val;
      if (['hora', 'time'].includes(key)) current.hora = val;
      if (['pagamento', 'payment'].includes(key)) current.pagamento = val;
      if (['documento', 'doc', 'recibo'].includes(key)) current.documento = val;
      if (['vendedor', 'seller', 'caixa'].includes(key)) current.vendedor = val;
      if (['categoria', 'category'].includes(key)) current.categoria = val;
    }
  }

  if (current && current.produto) results.push(current);
  return results.filter(r => r.produto && r.total > 0);
}

function parseSQLReconciliacao(content) {
  const insertRegex = /INSERT\s+INTO\s+\w+\s*\([^)]+\)\s*VALUES\s*\(([^)]+)\)/gi;
  const results = [];
  let match;

  while ((match = insertRegex.exec(content)) !== null) {
    const values = match[1].split(',').map(v => v.trim().replace(/^['"]|['"]$/g, ''));
    if (values.length >= 2) {
      results.push({
        produto: values[0] || 'Desconhecido',
        qtd: parseFloat(values[1]) || 1,
        preco_unitario: parseFloat(values[2]) || 0,
        total: parseFloat(values[3]) || 0,
        data: values[4] || getToday(),
        hora: values[5] || '',
        pagamento: values[6] || '',
        documento: values[7] || '',
        vendedor: values[8] || '',
        categoria: values[9] || ''
      });
    }
  }

  return results.filter(r => r.produto && r.total > 0);
}

function handleReconcImport(input) {
  const files = Array.from(input.files);
  const preview = document.getElementById('reconcPreview');
  if (!preview) return;

  preview.innerHTML = '<div class="loading-spinner" style="margin:20px auto"></div>';

  let allData = [];
  let processed = 0;

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = parseReconciliacao(e.target.result, file.name);
        allData = allData.concat(data);
        processed++;

        if (processed === files.length) {
          reconciliacaoData.vendasCaixa = allData;
          mostrarPreviewReconciliacao(allData, files.length);
        }
      } catch (err) {
        preview.innerHTML = `<div class="badge badge-danger" style="padding:12px">Erro em ${file.name}: ${err.message}</div>`;
      }
    };
    reader.readAsText(file);
  });
}

function handleReconcDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('dragover');

  const files = Array.from(event.dataTransfer.files);
  const input = document.getElementById('reconcImport');

  const dt = new DataTransfer();
  files.forEach(f => dt.items.add(f));
  input.files = dt.files;

  handleReconcImport(input);
}

function mostrarPreviewReconciliacao(data, fileCount) {
  const preview = document.getElementById('reconcPreview');
  const sample = data.slice(0, 5);

  preview.innerHTML = `
    <div style="padding:16px;background:var(--success-bg);border-radius:var(--border-radius);margin-bottom:12px">
      <strong>${data.length} vendas</strong> importadas de <code>${fileCount} ficheiro(s)</code>
      <span class="badge badge-success" style="margin-left:8px">Pronto para reconciliar</span>
    </div>

    <div class="table-responsive" style="margin-bottom:16px">
      <table class="data-table">
        <thead>
          <tr><th>Produto</th><th>Qtd</th><th>P. Unit</th><th>Total</th><th>Data</th></tr>
        </thead>
        <tbody>
          ${sample.map(d => `
            <tr>
              <td>${escapeHtml(d.produto)}</td>
              <td>${d.qtd}</td>
              <td>${formatCurrency(d.preco_unitario)}</td>
              <td>${formatCurrency(d.total)}</td>
              <td>${d.data}</td>
            </tr>
          `).join('')}
          ${data.length > 5 ? `<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">... e mais ${data.length - 5} vendas</td></tr>` : ''}
        </tbody>
      </table>
    </div>

    <button class="btn btn-primary btn-lg" onclick="executarReconciliacao()">
      ${Icons.check} Reconciliar Agora
    </button>
  `;
}

function executarReconciliacao() {
  const vendasCaixa = reconciliacaoData.vendasCaixa;

  const dataRef = vendasCaixa[0]?.data || getToday();
  const vendasERP = AppState.vendas.filter(v => {
    const vData = (v.created_at || v.data || '').substring(0, 10);
    return vData === dataRef || vData.startsWith(dataRef.substring(0, 7));
  });

  reconciliacaoData.vendasERP = vendasERP;

  const totalCaixa = vendasCaixa.reduce((s, v) => s + v.total, 0);
  const totalERP = vendasERP.reduce((s, v) => s + (parseFloat(v.total) || 0), 0);
  const qtdCaixa = vendasCaixa.length;
  const qtdERP = vendasERP.length;

  const diferenca = Formulas.calcularDiferencaReconciliacao(totalCaixa, totalERP);
  const taxa = Formulas.calcularTaxaConciliacao(vendasCaixa, vendasERP);

  const diferencas = [];

  vendasCaixa.forEach(vc => {
    const matchERP = vendasERP.find(ve => 
      (ve.produto_nome || '').toLowerCase().trim() === vc.produto.toLowerCase().trim()
    );

    if (!matchERP) {
      diferencas.push({
        tipo: 'falta_erp',
        produto: vc.produto,
        qtdCaixa: vc.qtd,
        qtdERP: 0,
        totalCaixa: vc.total,
        totalERP: 0,
        diferenca: vc.total,
        categoria: vc.categoria
      });
    } else if (Math.abs((matchERP.quantidade || 0) - vc.qtd) > 0.01 || Math.abs((parseFloat(matchERP.total) || 0) - vc.total) > 0.01) {
      diferencas.push({
        tipo: 'diferente',
        produto: vc.produto,
        qtdCaixa: vc.qtd,
        qtdERP: matchERP.quantidade || 0,
        totalCaixa: vc.total,
        totalERP: parseFloat(matchERP.total) || 0,
        diferenca: vc.total - (parseFloat(matchERP.total) || 0),
        categoria: vc.categoria
      });
    }
  });

  vendasERP.forEach(ve => {
    const matchCaixa = vendasCaixa.find(vc => 
      vc.produto.toLowerCase().trim() === (ve.produto_nome || '').toLowerCase().trim()
    );

    if (!matchCaixa) {
      diferencas.push({
        tipo: 'sobra_erp',
        produto: ve.produto_nome || 'Desconhecido',
        qtdCaixa: 0,
        qtdERP: ve.quantidade || 0,
        totalCaixa: 0,
        totalERP: parseFloat(ve.total) || 0,
        diferenca: -(parseFloat(ve.total) || 0),
        categoria: ve.categoria
      });
    }
  });

  reconciliacaoData.diferencas = diferencas;

  document.getElementById('reconcResultado').style.display = 'block';

  document.getElementById('recTotalCaixa').textContent = formatCurrency(totalCaixa);
  document.getElementById('recQtdCaixa').textContent = `${qtdCaixa} vendas`;
  document.getElementById('recTotalERP').textContent = formatCurrency(totalERP);
  document.getElementById('recQtdERP').textContent = `${qtdERP} vendas`;

  const diffEl = document.getElementById('recDiferenca');
  const diffStatus = document.getElementById('recStatusDiff');
  const diffIcon = document.getElementById('recIconDiff');

  if (Math.abs(diferenca) < 0.01) {
    diffEl.style.color = 'var(--success)';
    diffEl.textContent = formatCurrency(0);
    diffStatus.textContent = 'Tudo OK - Caixa bate com ERP';
    diffStatus.className = 'stat-card-change positive';
    diffIcon.className = 'stat-card-icon success';
    diffIcon.innerHTML = Icons.check;
  } else if (diferenca > 0) {
    diffEl.style.color = 'var(--warning)';
    diffEl.textContent = `+${formatCurrency(diferenca)}`;
    diffStatus.textContent = 'Caixa > ERP - Faltam vendas no sistema';
    diffStatus.className = 'stat-card-change negative';
    diffIcon.className = 'stat-card-icon warning';
    diffIcon.innerHTML = Icons.alert;
  } else {
    diffEl.style.color = 'var(--danger)';
    diffEl.textContent = formatCurrency(diferenca);
    diffStatus.textContent = 'ERP > Caixa - Verificar vendas extra';
    diffStatus.className = 'stat-card-change negative';
    diffIcon.className = 'stat-card-icon danger';
    diffIcon.innerHTML = Icons.alert;
  }

  document.getElementById('recTaxa').textContent = `${taxa}%`;
  document.getElementById('recTaxaStatus').textContent = taxa >= 95 ? 'Excelente' : taxa >= 80 ? 'Bom' : 'Necessita atencao';

  renderTabelaDiferencas(diferencas);
  document.getElementById('reconcResultado').scrollIntoView({ behavior: 'smooth' });
}

function renderTabelaDiferencas(diferencas) {
  const tbody = document.getElementById('reconcTableBody');
  if (!tbody) return;

  if (diferencas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:24px;color:var(--success)">
      ${Icons.check} Tudo OK! Nenhuma diferenca encontrada.
    </td></tr>`;
    return;
  }

  tbody.innerHTML = diferencas.map(d => {
    const statusConfig = {
      falta_erp: { label: 'Falta no ERP', badge: 'badge-warning', acao: 'Adicionar', btn: 'btn-success' },
      sobra_erp: { label: 'Sobra no ERP', badge: 'badge-danger', acao: 'Verificar', btn: 'btn-warning' },
      diferente: { label: 'Diferente', badge: 'badge-info', acao: 'Ajustar', btn: 'btn-primary' }
    };
    const cfg = statusConfig[d.tipo];

    return `
      <tr>
        <td><span class="badge ${cfg.badge}">${cfg.label}</span></td>
        <td><strong>${escapeHtml(d.produto)}</strong></td>
        <td>${d.qtdCaixa}</td>
        <td>${d.qtdERP}</td>
        <td>${formatCurrency(d.totalCaixa)}</td>
        <td>${formatCurrency(d.totalERP)}</td>
        <td style="color:${d.diferenca > 0 ? 'var(--warning)' : 'var(--danger)'};font-weight:600">
          ${d.diferenca > 0 ? '+' : ''}${formatCurrency(d.diferenca)}
        </td>
        <td>
          <button class="btn ${cfg.btn} btn-sm" onclick="sincronizarItem('${d.tipo}', '${escapeHtml(d.produto).replace(/'/g, "\'")}', ${d.qtdCaixa}, ${d.totalCaixa})">
            ${cfg.acao}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function sincronizarItem(tipo, produto, qtd, total) {
  if (tipo === 'falta_erp') {
    const produtoERP = AppState.produtos.find(p => p.nome.toLowerCase().trim() === produto.toLowerCase().trim());
    const precoAquisicao = produtoERP ? parseFloat(produtoERP.preco_aquisicao || produtoERP.precoAquisicao || 0) : 0;
    const precoVenda = total / (qtd || 1);
    const lucro = (precoVenda - precoAquisicao) * qtd;

    const venda = {
      id: generateId(),
      produto_nome: produto,
      produto: produto,
      categoria: produtoERP?.categoria || 'cat-7',
      quantidade: qtd,
      preco_unitario: precoVenda,
      total: total,
      lucro: lucro,
      local: 'loja',
      data: getToday(),
      created_at: new Date().toISOString(),
      origem: 'reconciliacao_caixa'
    };

    AppState.vendas.push(venda);
    AppState.save('vendas');

    showToast(`Venda de ${produto} adicionada ao ERP!`, 'success');
    executarReconciliacao();
  }
}

function sincronizarTudo() {
  const faltantes = reconciliacaoData.diferencas.filter(d => d.tipo === 'falta_erp');
  let count = 0;

  faltantes.forEach(d => {
    sincronizarItem('falta_erp', d.produto, d.qtdCaixa, d.totalCaixa);
    count++;
  });

  showToast(`${count} vendas sincronizadas!`, 'success');
}

function exportarReconciliacao() {
  const data = reconciliacaoData.diferencas.map(d => ({
    Status: d.tipo === 'falta_erp' ? 'Falta no ERP' : d.tipo === 'sobra_erp' ? 'Sobra no ERP' : 'Diferente',
    Produto: d.produto,
    'Qtd Caixa': d.qtdCaixa,
    'Qtd ERP': d.qtdERP,
    'Total Caixa': d.totalCaixa,
    'Total ERP': d.totalERP,
    Diferenca: d.diferenca,
    Data: getToday()
  }));

  exportData(data, `reconciliacao-${getToday()}`, 'csv');
}

// ============================================================
// HISTORICO DE ENCERRAMENTO
// ============================================================

function renderEncerramentos(periodo) {
  const vendas = AppState.vendas;
  const combustiveis = AppState.combustiveis.filter(c => !c.is_entrada);

  const gruposVendas = Formulas.agruparVendasPorPeriodo(vendas, periodo);
  const gruposComb = Formulas.agruparVendasPorPeriodo(combustiveis.map(c => ({
    ...c,
    total: c.total_venda,
    lucro: c.lucro,
    quantidade: c.litros,
    created_at: c.created_at || c.data
  })), periodo);

  if (gruposVendas.length === 0 && gruposComb.length === 0) {
    return renderEmptyState('Nenhum encerramento encontrado', 'As vendas aparecerao aqui apos reconciliacao.');
  }

  const todosPeriodos = [...new Set([...gruposVendas.map(g => g.periodo), ...gruposComb.map(g => g.periodo)])].sort().reverse();

  return `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>${periodo === 'dia' ? 'Data' : periodo === 'mes' ? 'Mes' : 'Ano'}</th>
            <th>Vendas Loja</th>
            <th>Receita Loja</th>
            <th>Lucro Loja</th>
            <th>Combustivel</th>
            <th>Receita Comb.</th>
            <th>Lucro Comb.</th>
            <th>Total Geral</th>
            <th>Lucro Geral</th>
            <th>Acao</th>
          </tr>
        </thead>
        <tbody>
          ${todosPeriodos.map(per => {
            const v = gruposVendas.find(g => g.periodo === per) || { total: 0, lucro: 0, quantidade: 0 };
            const c = gruposComb.find(g => g.periodo === per) || { total: 0, lucro: 0, quantidade: 0 };
            const totalGeral = v.total + c.total;
            const lucroGeral = v.lucro + c.lucro;

            const labelPeriodo = periodo === 'dia' 
              ? new Date(per).toLocaleDateString('pt-AO')
              : periodo === 'mes'
                ? `${per.split('-')[1]}/${per.split('-')[0]}`
                : per;

            return `
              <tr>
                <td><strong>${labelPeriodo}</strong></td>
                <td>${v.quantidade}</td>
                <td>${formatCurrency(v.total)}</td>
                <td style="color:var(--success)">${formatCurrency(v.lucro)}</td>
                <td>${formatNumber(c.quantidade)} L</td>
                <td>${formatCurrency(c.total)}</td>
                <td style="color:var(--success)">${formatCurrency(c.lucro)}</td>
                <td style="font-weight:700">${formatCurrency(totalGeral)}</td>
                <td style="color:var(--success);font-weight:700">${formatCurrency(lucroGeral)}</td>
                <td>
                  <button class="btn btn-ghost btn-sm btn-icon" onclick="verDetalhesEncerramento('${per}', '${periodo}')" title="Ver detalhes">
                    ${Icons.eye}
                  </button>
                  <button class="btn btn-ghost btn-sm btn-icon" onclick="exportarEncerramento('${per}', '${periodo}')" title="Exportar">
                    ${Icons.export}
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function mudarPeriodoEncerramento(periodo, el) {
  reconciliacaoData.periodo = periodo;

  el.parentElement.querySelectorAll('.btn').forEach(b => {
    b.classList.remove('btn-primary');
    b.classList.add('btn-ghost');
  });
  el.classList.remove('btn-ghost');
  el.classList.add('btn-primary');

  document.getElementById('encerramentoContent').innerHTML = renderEncerramentos(periodo);
}

function verDetalhesEncerramento(periodo, tipo) {
  const vendas = AppState.vendas.filter(v => {
    const vData = (v.created_at || v.data || '').substring(0, tipo === 'dia' ? 10 : tipo === 'mes' ? 7 : 4);
    return vData === periodo;
  });

  const content = `
    <div style="max-height:60vh;overflow-y:auto">
      <h4 style="margin-bottom:12px">Vendas do Periodo: ${periodo}</h4>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr><th>Data</th><th>Produto</th><th>Qtd</th><th>Total</th><th>Lucro</th></tr>
          </thead>
          <tbody>
            ${vendas.map(v => `
              <tr>
                <td>${formatDate(v.created_at || v.data)}</td>
                <td>${escapeHtml(v.produto_nome || v.produto)}</td>
                <td>${v.quantidade}</td>
                <td>${formatCurrency(v.total)}</td>
                <td style="color:var(--success)">${formatCurrency(v.lucro)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  openModal(`Detalhes - ${periodo}`, content);
}

function exportarEncerramento(periodo, tipo) {
  const vendas = AppState.vendas.filter(v => {
    const vData = (v.created_at || v.data || '').substring(0, tipo === 'dia' ? 10 : tipo === 'mes' ? 7 : 4);
    return vData === periodo;
  });

  const data = vendas.map(v => ({
    Data: v.created_at || v.data,
    Produto: v.produto_nome || v.produto,
    Quantidade: v.quantidade,
    'Preco Unitario': v.preco_unitario,
    Total: v.total,
    Lucro: v.lucro,
    Local: v.local || 'loja'
  }));

  exportData(data, `encerramento-${periodo}`, 'csv');
}

// ============================================================
// MODULE: CONFIGURACOES (SETTINGS)
// ============================================================

function renderConfiguracoes(container) {
  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Configuracoes</h1>
        <p>Personalize o sistema para o seu negocio</p>
      </div>

      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Configuracoes Gerais</span>
        </div>
        <div class="content-card-body">
          <form id="configForm">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nome da Empresa</label>
                <input type="text" class="form-input" id="configNome" value="${escapeHtml(AppState.configs.nomeEmpresa || '')}">
              </div>
              <div class="form-group">
                <label class="form-label">Moeda</label>
                <select class="form-select" id="configMoeda">
                  <option value="AOA" ${AppState.configs.moeda === 'AOA' ? 'selected' : ''}>AOA (Kwanza)</option>
                  <option value="USD" ${AppState.configs.moeda === 'USD' ? 'selected' : ''}>USD (Dolar)</option>
                  <option value="EUR" ${AppState.configs.moeda === 'EUR' ? 'selected' : ''}>EUR (Euro)</option>
                  <option value="BRL" ${AppState.configs.moeda === 'BRL' ? 'selected' : ''}>BRL (Real)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Alerta de Estoque Baixo</label>
                <input type="number" class="form-input" id="configAlerta" value="${AppState.configs.alertaEstoque || 5}" min="1">
              </div>
            </div>
          </form>
          <div style="margin-top:16px">
            <button class="btn btn-primary" onclick="salvarConfiguracoes()">${Icons.check} Salvar Configuracoes</button>
          </div>
        </div>
      </div>

      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Categorias</span>
          <button class="btn btn-primary btn-sm" onclick="adicionarCategoria()">${Icons.add} Nova Categoria</button>
        </div>
        <div class="content-card-body">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr><th>Nome</th><th>Cor</th><th>Produtos</th><th>Acao</th></tr>
              </thead>
              <tbody>
                ${AppState.categorias.map(c => `
                  <tr>
                    <td><strong>${escapeHtml(c.nome)}</strong></td>
                    <td><span style="display:inline-block;width:20px;height:20px;border-radius:4px;background:${c.cor}"></span></td>
                    <td>${AppState.produtos.filter(p => p.categoria === c.id).length}</td>
                    <td>
                      <button class="btn btn-ghost btn-sm btn-icon" style="color:var(--danger)" onclick="removerCategoria('${c.id}')">${Icons.trash}</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Supabase (Cloud Sync)</span>
        </div>
        <div class="content-card-body">
          <form id="supabaseForm">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">URL do Projeto</label>
                <input type="url" class="form-input" id="sbUrl" value="${escapeHtml(localStorage.getItem('sb_url') || '')}" placeholder="https://seu-projeto.supabase.co">
              </div>
              <div class="form-group">
                <label class="form-label">API Key (anon/public)</label>
                <input type="text" class="form-input" id="sbKey" value="${escapeHtml(localStorage.getItem('sb_key') || '')}" placeholder="sua-chave-api">
              </div>
            </div>
          </form>
          <div style="margin-top:16px;display:flex;gap:8px">
            <button class="btn btn-primary" onclick="salvarSupabase()">${Icons.check} Salvar Configuracao</button>
            <button class="btn btn-outline" onclick="testarSupabase()">${Icons.check} Testar Conexao</button>
          </div>
        </div>
      </div>

      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Backup e Dados</span>
        </div>
        <div class="content-card-body">
          <div class="btn-group">
            <button class="btn btn-success" onclick="exportarTodosDados()">${Icons.download} Exportar Todos os Dados</button>
            <button class="btn btn-primary" onclick="importarDados()">${Icons.upload} Importar Dados</button>
            <button class="btn btn-danger" onclick="limparTodosDados()">${Icons.trash} Limpar Todos os Dados</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function salvarConfiguracoes() {
  AppState.configs = {
    nomeEmpresa: document.getElementById('configNome')?.value || 'Shop Administrator',
    moeda: document.getElementById('configMoeda')?.value || 'AOA',
    alertaEstoque: parseInt(document.getElementById('configAlerta')?.value) || 5
  };
  AppState.save('configs');
  showToast('Configuracoes salvas!', 'success');
}

function adicionarCategoria() {
  const nome = prompt('Nome da nova categoria:');
  if (!nome) return;

  const cores = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#f97316', '#6b7280', '#ec4899', '#14b8a6', '#6366f1'];
  const cor = cores[Math.floor(Math.random() * cores.length)];

  const nova = {
    id: 'cat-' + (AppState.categorias.length + 1),
    nome,
    cor
  };

  AppState.categorias.push(nova);
  AppState.save('categorias');
  showToast(`Categoria "${nome}" adicionada!`, 'success');
  refreshCurrentPage();
}

function removerCategoria(id) {
  const cat = AppState.categorias.find(c => c.id === id);
  if (!cat) return;

  const produtosNaCategoria = AppState.produtos.filter(p => p.categoria === id).length;
  if (produtosNaCategoria > 0) {
    showToast(`Nao e possivel remover: existem ${produtosNaCategoria} produtos nesta categoria.`, 'error');
    return;
  }

  AppState.categorias = AppState.categorias.filter(c => c.id !== id);
  AppState.save('categorias');
  showToast('Categoria removida!', 'warning');
  refreshCurrentPage();
}

function salvarSupabase() {
  const url = document.getElementById('sbUrl')?.value;
  const key = document.getElementById('sbKey')?.value;

  if (url && key) {
    localStorage.setItem('sb_url', url);
    localStorage.setItem('sb_key', key);
    showToast('Configuracao Supabase salva!', 'success');
  }
}

function testarSupabase() {
  if (SupabaseAPI.isConfigured()) {
    showToast('Supabase configurado corretamente!', 'success');
  } else {
    showToast('Supabase nao configurado. Preencha URL e API Key.', 'warning');
  }
}

function exportarTodosDados() {
  const dados = {
    produtos: AppState.produtos,
    categorias: AppState.categorias,
    vendas: AppState.vendas,
    movimentacoes: AppState.movimentacoes,
    combustiveis: AppState.combustiveis,
    relatorios: AppState.relatorios,
    configs: AppState.configs,
    exportado_em: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shop-admin-backup-${getToday()}.json`;
  a.click();
  URL.revokeObjectURL(url);

  showToast('Backup exportado!', 'success');
}

function importarDados() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const dados = JSON.parse(event.target.result);

        if (dados.produtos) {
          AppState.produtos = dados.produtos;
          AppState.save('produtos');
        }
        if (dados.categorias) {
          AppState.categorias = dados.categorias;
          AppState.save('categorias');
        }
        if (dados.vendas) {
          AppState.vendas = dados.vendas;
          AppState.save('vendas');
        }
        if (dados.movimentacoes) {
          AppState.movimentacoes = dados.movimentacoes;
          AppState.save('movimentacoes');
        }
        if (dados.combustiveis) {
          AppState.combustiveis = dados.combustiveis;
          AppState.save('combustiveis');
        }
        if (dados.relatorios) {
          AppState.relatorios = dados.relatorios;
          AppState.save('relatorios');
        }
        if (dados.configs) {
          AppState.configs = dados.configs;
          AppState.save('configs');
        }

        AppState.refresh();
        showToast('Dados importados com sucesso!', 'success');
        refreshCurrentPage();
      } catch (err) {
        showToast('Erro ao importar: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function limparTodosDados() {
  confirmDialog('ATENCAO! Isso apagara TODOS os dados permanentemente. Tem certeza?', () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('sb_'));
    keys.forEach(k => localStorage.removeItem(k));

    AppState.produtos = [];
    AppState.vendas = [];
    AppState.movimentacoes = [];
    AppState.combustiveis = [];
    AppState.relatorios = [];

    showToast('Todos os dados foram removidos!', 'warning');
    refreshCurrentPage();
  });
}

// ============================================================
// MODULE: ADICIONAR PRODUTO
// ============================================================

function renderAdicionarProduto(container) {
  const catOptions = AppState.categorias.map(c => `<option value="${c.id}">${escapeHtml(c.nome)}</option>`).join('');
  const percentuaisSalvos = [...new Set(AppState.produtos.map(p => p.percentual_lucro || p.percentualLucro || 30).filter(p => p > 0))];

  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Adicionar Produto</h1>
        <p>Cadastre novos produtos no sistema</p>
      </div>

      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Formulario de Cadastro</span>
        </div>
        <div class="content-card-body">
          <form id="produtoForm">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nome do Produto <span class="required">*</span></label>
                <input type="text" class="form-input" id="prodNome" required>
              </div>
              <div class="form-group">
                <label class="form-label">Categoria</label>
                <select class="form-select" id="prodCategoria">${catOptions}</select>
              </div>
              <div class="form-group">
                <label class="form-label">Quantidade Inicial</label>
                <input type="number" class="form-input" id="prodQuantidade" min="0" value="0">
              </div>
              <div class="form-group">
                <label class="form-label">Preco de Aquisicao <span class="required">*</span></label>
                <input type="number" class="form-input" id="prodPrecoAquisicao" min="0" step="0.01" required>
              </div>
              <div class="form-group">
                <label class="form-label">Percentual de Lucro (%)</label>
                <div style="display:flex;gap:8px">
                  <input type="number" class="form-input" id="prodPercentual" min="0" step="0.1" value="30" style="flex:1">
                  <select class="form-select" id="prodPercentualSelect" style="width:auto" onchange="document.getElementById('prodPercentual').value=this.value">
                    <option value="">Salvos</option>
                    ${percentuaisSalvos.map(p => `<option value="${p}">${p}%</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Preco de Venda (calculado)</label>
                <input type="number" class="form-input" id="prodPrecoVenda" min="0" step="0.01">
                <div class="form-hint">Deixe em branco para calcular automaticamente</div>
              </div>
            </div>
          </form>
          <div style="margin-top:16px">
            <button class="btn btn-primary" onclick="salvarProduto()">${Icons.check} Salvar Produto</button>
            <button class="btn btn-outline" onclick="navigate('armazem')">Cancelar</button>
          </div>
        </div>
      </div>

      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Importacao em Massa</span>
          <span class="badge badge-info">30 formatos</span>
        </div>
        <div class="content-card-body">
          <div class="upload-area" onclick="document.getElementById('massImport').click()"
               ondragover="event.preventDefault();this.classList.add('dragover')"
               ondragleave="this.classList.remove('dragover')"
               ondrop="handleMassDrop(event)">
            ${Icons.upload}
            <h3>Importar produtos em massa</h3>
            <p>CSV, XLSX, XLS, JSON, TXT, XML, ODS, TSV e mais</p>
            <input type="file" id="massImport" style="display:none" accept=".csv,.xlsx,.xls,.json,.txt,.xml,.ods,.tsv" onchange="handleMassImport(this)">
          </div>
          <div id="massPreview" style="margin-top:16px"></div>
        </div>
      </div>
    </div>
  `;
}

function salvarProduto() {
  const nome = document.getElementById('prodNome')?.value;
  const categoria = document.getElementById('prodCategoria')?.value;
  const quantidade = parseInt(document.getElementById('prodQuantidade')?.value) || 0;
  const precoAquisicao = parseFloat(document.getElementById('prodPrecoAquisicao')?.value) || 0;
  const percentual = parseFloat(document.getElementById('prodPercentual')?.value) || 0;
  const precoVendaManual = parseFloat(document.getElementById('prodPrecoVenda')?.value) || 0;

  if (!nome || precoAquisicao <= 0) {
    showToast('Preencha nome e preco de aquisicao!', 'error');
    return;
  }

  const precoVenda = precoVendaManual > 0 ? precoVendaManual : calcularPrecoVenda(precoAquisicao, percentual);

  const produto = {
    id: generateId(),
    codigo: gerarCodigoProduto(nome, categoria),
    nome,
    categoria,
    quantidade,
    preco_aquisicao: precoAquisicao,
    precoAquisicao: precoAquisicao,
    percentual_lucro: percentual,
    percentualLucro: percentual,
    preco_venda: precoVenda,
    precoVenda: precoVenda,
    local: 'armazem',
    data: getToday(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  AppState.produtos.push(produto);
  AppState.save('produtos');

  const mov = {
    id: generateId(),
    tipo: 'entrada',
    produto_id: produto.id,
    produto_nome: nome,
    quantidade,
    local_origem: 'cadastro',
    local_destino: 'armazem',
    valor: quantidade * precoAquisicao,
    data: getToday(),
    created_at: new Date().toISOString()
  };

  AppState.movimentacoes.push(mov);
  AppState.save('movimentacoes');

  showToast(`Produto "${nome}" cadastrado com sucesso!`, 'success');
  navigate('armazem');
}

function handleMassDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove('dragover');
  const files = Array.from(event.dataTransfer.files);
  const input = document.getElementById('massImport');
  const dt = new DataTransfer();
  files.forEach(f => dt.items.add(f));
  input.files = dt.files;
  handleMassImport(input);
}

function handleMassImport(input) {
  const file = input.files[0];
  if (!file) return;

  const preview = document.getElementById('massPreview');
  preview.innerHTML = '<div class="loading-spinner" style="margin:20px auto"></div>';

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = parseReconciliacao(e.target.result, file.name);
      mostrarPreviewMassa(data);
    } catch (err) {
      preview.innerHTML = `<div class="badge badge-danger" style="padding:12px">Erro: ${err.message}</div>`;
    }
  };
  reader.readAsText(file);
}

function mostrarPreviewMassa(data) {
  const preview = document.getElementById('massPreview');
  const sample = data.slice(0, 5);

  preview.innerHTML = `
    <div style="padding:16px;background:var(--success-bg);border-radius:var(--border-radius);margin-bottom:12px">
      <strong>${data.length} produtos</strong> detectados para importacao
    </div>
    <div class="table-responsive" style="margin-bottom:16px">
      <table class="data-table">
        <thead><tr><th>Produto</th><th>Qtd</th><th>Total</th></tr></thead>
        <tbody>
          ${sample.map(d => `<tr><td>${escapeHtml(d.produto)}</td><td>${d.qtd}</td><td>${formatCurrency(d.total)}</td></tr>`).join('')}
          ${data.length > 5 ? `<tr><td colspan="3" style="text-align:center">... e mais ${data.length - 5}</td></tr>` : ''}
        </tbody>
      </table>
    </div>
    <button class="btn btn-success" onclick="confirmarImportacaoMassa()">${Icons.check} Importar ${data.length} Produtos</button>
  `;

  window.massaData = data;
}

function confirmarImportacaoMassa() {
  const data = window.massaData || [];
  let count = 0;

  data.forEach(d => {
    const precoAquisicao = d.preco_unitario || (d.total / (d.qtd || 1)) * 0.7;
    const precoVenda = d.total / (d.qtd || 1);
    const percentual = ((precoVenda - precoAquisicao) / precoAquisicao) * 100;

    const produto = {
      id: generateId(),
      codigo: gerarCodigoProduto(d.produto, d.categoria || 'cat-7'),
      nome: d.produto,
      categoria: d.categoria || 'cat-7',
      quantidade: d.qtd,
      preco_aquisicao: precoAquisicao,
      precoAquisicao: precoAquisicao,
      percentual_lucro: percentual,
      percentualLucro: percentual,
      preco_venda: precoVenda,
      precoVenda: precoVenda,
      local: 'armazem',
      data: getToday(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    AppState.produtos.push(produto);
    count++;
  });

  AppState.save('produtos');
  showToast(`${count} produtos importados!`, 'success');
  navigate('armazem');
}

function gerarCodigoProduto(nome, categoria) {
  const prefix = (categoria || 'PRD').substring(0, 3).toUpperCase();
  const namePart = (nome || 'XXX').substring(0, 3).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  const timestamp = Date.now().toString(36).substring(-4).toUpperCase();
  return `${prefix}-${namePart}-${random}${timestamp}`;
}

// ============================================================
// MODULE: TRANSFERIR PARA LOJA
// ============================================================

function renderTransferirLoja(container) {
  const produtosArmazem = AppState.produtos.filter(p => p.local === 'armazem' || !p.local);

  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Transferir para Loja</h1>
        <p>Mova produtos do armazem para a loja</p>
      </div>

      <div class="filter-bar">
        <div class="search-input">
          ${Icons.search}
          <input type="text" id="transferSearch" placeholder="Buscar produtos..." onkeyup="filterTransferencia()">
        </div>
        <button class="btn btn-success" onclick="transferirSelecionados()">${Icons.transfer} Transferir Selecionados</button>
      </div>

      <div class="content-card">
        <div class="content-card-body">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr><th>Produto</th><th>Categoria</th><th>Stock Armazem</th><th>Qtd a Transferir</th><th>Acao</th></tr>
              </thead>
              <tbody id="transferTable">
                ${renderTransferenciaRows(produtosArmazem)}
              </tbody>
            </table>
          </div>
          ${produtosArmazem.length === 0 ? renderEmptyState('Nenhum produto no armazem', 'Adicione produtos primeiro.') : ''}
        </div>
      </div>
    </div>
  `;
}

function renderTransferenciaRows(produtos) {
  if (produtos.length === 0) return '';

  return produtos.map(p => `
    <tr data-nome="${escapeHtml(p.nome).toLowerCase()}">
      <td><strong>${escapeHtml(p.nome)}</strong></td>
      <td><span class="badge badge-neutral">${escapeHtml(getCategoryName(p.categoria))}</span></td>
      <td>${p.quantidade || 0}</td>
      <td>
        <input type="number" class="form-input" id="transferQtd-${p.id}" min="1" max="${p.quantidade || 0}" value="1" style="width:80px">
      </td>
      <td>
        <button class="btn btn-success btn-sm" onclick="transferirProduto('${p.id}')">${Icons.transfer} Transferir</button>
      </td>
    </tr>
  `).join('');
}

function filterTransferencia() {
  const search = document.getElementById('transferSearch')?.value.toLowerCase() || '';
  const rows = document.querySelectorAll('#transferTable tr');
  rows.forEach(row => {
    const nome = row.dataset.nome || '';
    row.style.display = nome.includes(search) ? '' : 'none';
  });
}

function transferirProduto(id) {
  const qtd = parseInt(document.getElementById(`transferQtd-${id}`)?.value) || 0;
  if (qtd <= 0) {
    showToast('Quantidade invalida!', 'error');
    return;
  }

  const p = AppState.produtos.find(x => x.id === id);
  if (!p || (p.quantidade || 0) < qtd) {
    showToast('Quantidade insuficiente!', 'error');
    return;
  }

  p.quantidade = (p.quantidade || 0) - qtd;
  p.updated_at = new Date().toISOString();

  const existenteLoja = AppState.produtos.find(x => x.nome === p.nome && x.local === 'loja');

  if (existenteLoja) {
    existenteLoja.quantidade = (existenteLoja.quantidade || 0) + qtd;
    existenteLoja.updated_at = new Date().toISOString();
  } else {
    const novoProdutoLoja = {
      ...p,
      id: generateId(),
      local: 'loja',
      quantidade: qtd,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    AppState.produtos.push(novoProdutoLoja);
  }

  const mov = {
    id: generateId(),
    tipo: 'transferencia',
    produto_id: p.id,
    produto_nome: p.nome,
    quantidade: qtd,
    local_origem: 'armazem',
    local_destino: 'loja',
    valor: qtd * parseFloat(p.preco_aquisicao || p.precoAquisicao || 0),
    data: getToday(),
    created_at: new Date().toISOString()
  };

  AppState.movimentacoes.push(mov);
  AppState.save('produtos');
  AppState.save('movimentacoes');

  showToast(`${qtd}x ${p.nome} transferido para loja!`, 'success');
  refreshCurrentPage();
}

function transferirSelecionados() {
  showToast('Selecione produtos individuais para transferir.', 'info');
}

// ============================================================
// EXPORT DATA HELPER
// ============================================================

function exportData(data, filename, format = 'csv') {
  if (!data || data.length === 0) {
    showToast('Nenhum dado para exportar!', 'warning');
    return;
  }

  const headers = Object.keys(data[0]);
  let content = '';

  if (format === 'csv' || format === 'xlsx') {
    content = headers.join('\t') + '\n';
    data.forEach(row => {
      content += headers.map(h => {
        const val = row[h] !== undefined ? row[h] : '';
        return String(val).replace(/\t/g, ' ').replace(/\n/g, ' ');
      }).join('\t') + '\n';
    });
  } else if (format === 'json') {
    content = JSON.stringify(data, null, 2);
  }

  const blob = new Blob([content], { type: 'text/tab-separated-values' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.xls`;
  a.click();
  URL.revokeObjectURL(url);

  showToast(`Dados exportados: ${filename}.${format}`, 'success');
}

// ============================================================
// EMPTY STATE HELPER
// ============================================================

function renderEmptyState(title, description) {
  return `
    <div class="empty-state">
      ${Icons.box}
      <h3>${title}</h3>
      <p>${description}</p>
    </div>
  `;
}
