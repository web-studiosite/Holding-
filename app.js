/**
 * SHOP ADMINISTRATOR - MAIN APPLICATION
 * ERP System - Single Page Application
 * 
 * All modules, routing, state management and UI logic
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
  // Menu toggle
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
  
  // Responsive
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
  
  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });
  
  renderHeader();
  
  const container = document.getElementById('page-content');
  if (!container) return;
  
  // Refresh data
  AppState.refresh();
  
  // Render page
  switch (page) {
    case 'dashboard': renderDashboard(container); break;
    case 'loja': renderLoja(container); break;
    case 'armazem': renderArmazem(container); break;
    case 'inventario': renderInventario(container); break;
    case 'combustiveis': renderCombustiveis(container); break;
    case 'relatorios': renderRelatorios(container); break;
    case 'configuracoes': renderConfiguracoes(container); break;
    case 'adicionarProduto': renderAdicionarProduto(container); break;
    case 'transferirLoja': renderTransferirLoja(container); break;
    default: renderDashboard(container);
  }
  
  // Close mobile sidebar
  if (window.innerWidth <= 768) {
    document.querySelector('.sidebar')?.classList.remove('open');
    document.querySelector('.sidebar-overlay')?.classList.remove('active');
  }
}

// ============================================================
// REAL-TIME UPDATES (Simulated)
// ============================================================

function setupRealtimeUpdates() {
  // Listen for storage changes from other tabs
  window.addEventListener('storage', (e) => {
    if (e.key?.startsWith('sb_')) {
      AppState.refresh();
      // Re-render current page without full reload
      const container = document.getElementById('page-content');
      if (container && AppState.currentPage) {
        navigate(AppState.currentPage);
      }
    }
  });
}

// Force re-render
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
    'cat-1': '🥤', 'cat-2': '🍪', 'cat-3': '🚗', 'cat-4': '🧼',
    'cat-5': '🍲', 'cat-6': '⛽', 'cat-7': '📦'
  };
  return emojis[catId] || '📦';
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
  
  // Update product quantity
  p.quantidade = (p.quantidade || 0) - qtd;
  p.updated_at = new Date().toISOString();
  
  // Create sale record
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
  
  // Create movement record
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
  
  // Save everything
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

function saidaStock(id) {
  const p = AppState.produtos.find(x => x.id === id);
  if (!p) return;
  
  const content = `
    <form id="saidaForm">
      <div class="form-group">
        <label class="form-label">Produto</label>
        <input type="text" class="form-input" value="${escapeHtml(p.nome)}" disabled>
      </div>
      <div class="form-group">
        <label class="form-label">Stock Atual</label>
        <input type="text" class="form-input" value="${p.quantidade || 0}" disabled>
      </div>
      <div class="form-group">
        <label class="form-label">Quantidade de Saida <span class="required">*</span></label>
        <input type="number" class="form-input" id="saidaQtd" min="1" max="${p.quantidade || 0}" value="1" required>
      </div>
      <div class="form-group">
        <label class="form-label">Motivo</label>
        <select class="form-select" id="saidaMotivo">
          <option value="avaria">Avaria</option>
          <option value="perda">Perda</option>
          <option value="uso_interno">Uso Interno</option>
          <option value="devolucao">Devolucao</option>
          <option value="outro">Outro</option>
        </select>
      </div>
    </form>
  `;
  
  const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="confirmarSaida('${p.id}')">Registrar Saida</button>
  `;
  
  openModal('Saida de Stock', content, footer);
}

function confirmarSaida(id) {
  const qtd = parseInt(document.getElementById('saidaQtd')?.value) || 0;
  const motivo = document.getElementById('saidaMotivo')?.value || 'outro';
  
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
  
  const mov = {
    id: generateId(),
    tipo: 'saida',
    produto_id: p.id,
    produto_nome: p.nome,
    quantidade: qtd,
    local_origem: p.local || 'armazem',
    local_destino: motivo,
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
  showToast(`Saida de ${qtd} unidades de ${p.nome} registrada!`, 'warning');
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
  const produtosArmazem = AppState.produtos.filter(p => p.local === 'armazem' || !p.local);
  const produtosLoja = AppState.produtos.filter(p => p.local === 'loja');
  const lowStock = AppState.produtos.filter(p => (p.quantidade || 0) <= (AppState.configs.alertaEstoque || 5));
  
  const totalQtd = AppState.produtos.reduce((s, p) => s + (parseInt(p.quantidade) || 0), 0);
  const valorTotal = AppState.produtos.reduce((s, p) => {
    return s + ((parseInt(p.quantidade) || 0) * (parseFloat(p.preco_venda || p.precoVenda || 0)));
  }, 0);
  const lucroPotencial = AppState.produtos.reduce((s, p) => {
    const aquisicao = parseFloat(p.preco_aquisicao || p.precoAquisicao || 0);
    const venda = parseFloat(p.preco_venda || p.precoVenda || 0);
    return s + ((parseInt(p.quantidade) || 0) * (venda - aquisicao));
  }, 0);
  
  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Inventario</h1>
        <p>Controle completo de estoque e movimentacoes</p>
      </div>
      
      <div class="filter-bar">
        <div class="search-input">
          ${Icons.search}
          <input type="text" id="invSearch" placeholder="Buscar produtos..." onkeyup="filterInventario()">
        </div>
        <div class="btn-group">
          <button class="btn btn-primary" onclick="navigate('adicionarProduto')">${Icons.add} Adicionar</button>
          <button class="btn btn-outline" onclick="exportInventario('completo')">${Icons.export} Exportar</button>
          <button class="btn btn-outline" onclick="window.print()">${Icons.print} Imprimir</button>
        </div>
      </div>
      
      <div class="card-grid">
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Total Produtos</span>
            <div class="stat-card-icon primary">${Icons.package}</div>
          </div>
          <div class="stat-card-value">${formatNumber(AppState.produtos.length)}</div>
          <div class="stat-card-change neutral">${formatNumber(produtosArmazem.length)} armazem + ${formatNumber(produtosLoja.length)} loja</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Total Unidades</span>
            <div class="stat-card-icon success">${Icons.box}</div>
          </div>
          <div class="stat-card-value">${formatNumber(totalQtd)}</div>
          <div class="stat-card-change neutral">em todo o sistema</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Valor Total Stock</span>
            <div class="stat-card-icon accent">${Icons.dollar}</div>
          </div>
          <div class="stat-card-value">${formatCurrency(valorTotal)}</div>
          <div class="stat-card-change neutral">preco de venda</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Lucro Potencial</span>
            <div class="stat-card-icon success">${Icons.trendUp}</div>
          </div>
          <div class="stat-card-value">${formatCurrency(lucroPotencial)}</div>
          <div class="stat-card-change positive">estimado</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-card-header">
            <span class="stat-card-title">Estoque Baixo</span>
            <div class="stat-card-icon ${lowStock.length > 0 ? 'danger' : 'success'}">${Icons.alert}</div>
          </div>
          <div class="stat-card-value" style="color:${lowStock.length > 0 ? 'var(--danger)' : 'var(--success)'}">${formatNumber(lowStock.length)}</div>
          <div class="stat-card-change ${lowStock.length > 0 ? 'negative' : 'positive'}">${lowStock.length > 0 ? 'Necessita reposicao' : 'Tudo OK'}</div>
        </div>
      </div>
      
      <div class="tabs">
        <button class="tab active" onclick="showInvTab('todos', this)">Todos os Produtos</button>
        <button class="tab" onclick="showInvTab('armazem', this)">Armazem</button>
        <button class="tab" onclick="showInvTab('loja', this)">Loja</button>
        <button class="tab" onclick="showInvTab('baixo', this)">Estoque Baixo</button>
        <button class="tab" onclick="showInvTab('movimentacoes', this)">Movimentacoes</button>
      </div>
      
      <div id="inv-todos" class="tab-content active">
        <div class="content-card">
          <div class="content-card-body">
            ${renderInventoryTable(AppState.produtos)}
          </div>
        </div>
      </div>
      
      <div id="inv-armazem" class="tab-content">
        <div class="content-card">
          <div class="content-card-header">
            <span class="content-card-title">Produtos no Armazem</span>
            <button class="btn btn-ghost btn-sm" onclick="exportInventario('armazem')">${Icons.export}</button>
          </div>
          <div class="content-card-body">${renderInventoryTable(produtosArmazem)}</div>
        </div>
      </div>
      
      <div id="inv-loja" class="tab-content">
        <div class="content-card">
          <div class="content-card-header">
            <span class="content-card-title">Produtos na Loja</span>
            <button class="btn btn-ghost btn-sm" onclick="exportInventario('loja')">${Icons.export}</button>
          </div>
          <div class="content-card-body">${renderInventoryTable(produtosLoja)}</div>
        </div>
      </div>
      
      <div id="inv-baixo" class="tab-content">
        <div class="content-card">
          <div class="content-card-header">
            <span class="content-card-title">Produtos com Estoque Baixo</span>
            <button class="btn btn-ghost btn-sm" onclick="exportInventario('baixo')">${Icons.export}</button>
          </div>
          <div class="content-card-body">
            ${lowStock.length > 0 ? renderInventoryTable(lowStock) : renderEmptyState('Nenhum produto com estoque baixo', 'Todos os produtos estao com niveis adequados.')}
          </div>
        </div>
      </div>
      
      <div id="inv-movimentacoes" class="tab-content">
        <div class="content-card">
          <div class="content-card-header">
            <span class="content-card-title">Historico de Movimentacoes</span>
            <button class="btn btn-ghost btn-sm" onclick="exportMovimentacoes()">${Icons.export}</button>
          </div>
          <div class="content-card-body">
            ${renderMovimentacoesTable()}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderInventoryTable(produtos) {
  if (produtos.length === 0) return renderEmptyState('Nenhum produto encontrado', '');
  
  return `
    <div class="table-responsive">
      <table class="data-table" id="invTable">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Local</th>
            <th>Qtd</th>
            <th>P. Aquisicao</th>
            <th>P. Venda</th>
            <th>Lucro/Un</th>
            <th>Valor Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${produtos.map(p => {
            const isLow = (p.quantidade || 0) <= 5;
            const lucroUn = (parseFloat(p.preco_venda || p.precoVenda || 0)) - (parseFloat(p.preco_aquisicao || p.precoAquisicao || 0));
            const valStock = (p.quantidade || 0) * (parseFloat(p.preco_venda || p.precoVenda || 0));
            return `
              <tr data-nome="${escapeHtml(p.nome).toLowerCase()}">
                <td><strong>${escapeHtml(p.nome)}</strong></td>
                <td><span class="badge badge-neutral">${escapeHtml(getCategoryName(p.categoria))}</span></td>
                <td>${p.local === 'loja' ? 'Loja' : 'Armazem'}</td>
                <td style="font-weight:${isLow ? '600' : 'normal'};color:${isLow ? 'var(--danger)' : 'inherit'}">${p.quantidade || 0}</td>
                <td>${formatCurrency(p.preco_aquisicao || p.precoAquisicao || 0)}</td>
                <td>${formatCurrency(p.preco_venda || p.precoVenda || 0)}</td>
                <td style="color:var(--success)">${formatCurrency(lucroUn)}</td>
                <td>${formatCurrency(valStock)}</td>
                <td>${isLow ? '<span class="badge badge-danger">Critico</span>' : '<span class="badge badge-success">OK</span>'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderMovimentacoesTable() {
  const movs = [...AppState.movimentacoes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 100);
  
  if (movs.length === 0) return renderEmptyState('Nenhuma movimentacao registrada', 'As movimentacoes aparecerao aqui.');
  
  const tipoLabels = { entrada: 'Entrada', saida: 'Saida', venda: 'Venda', transferencia: 'Transferencia' };
  const tipoBadges = { entrada: 'badge-success', saida: 'badge-danger', venda: 'badge-info', transferencia: 'badge-warning' };
  
  return `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr><th>Data</th><th>Tipo</th><th>Produto</th><th>Qtd</th><th>Origem</th><th>Destino</th><th>Valor</th></tr>
        </thead>
        <tbody>
          ${movs.map(m => `
            <tr>
              <td>${formatDate(m.created_at || m.data)}</td>
              <td><span class="badge ${tipoBadges[m.tipo] || 'badge-neutral'}">${tipoLabels[m.tipo] || m.tipo}</span></td>
              <td><strong>${escapeHtml(m.produto_nome)}</strong></td>
              <td>${m.quantidade}</td>
              <td>${m.local_origem}</td>
              <td>${m.local_destino}</td>
              <td>${formatCurrency(m.valor)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function showInvTab(tab, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const content = document.getElementById(`inv-${tab}`);
  if (content) content.classList.add('active');
}

function filterInventario() {
  const search = document.getElementById('invSearch')?.value.toLowerCase() || '';
  const table = document.getElementById('invTable');
  if (!table) return;
  
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const nome = row.dataset.nome || '';
    row.style.display = nome.includes(search) ? '' : 'none';
  });
}

function exportInventario(tipo) {
  let produtos = [];
  switch (tipo) {
    case 'armazem': produtos = AppState.produtos.filter(p => p.local === 'armazem' || !p.local); break;
    case 'loja': produtos = AppState.produtos.filter(p => p.local === 'loja'); break;
    case 'baixo': produtos = AppState.produtos.filter(p => (p.quantidade || 0) <= 5); break;
    default: produtos = AppState.produtos;
  }
  
  const data = produtos.map(p => ({
    Nome: p.nome,
    Categoria: getCategoryName(p.categoria),
    Local: p.local || 'armazem',
    Quantidade: p.quantidade,
    'Preco Aquisicao': p.preco_aquisicao || p.precoAquisicao,
    'Preco Venda': p.preco_venda || p.precoVenda,
    'Lucro Estimado': (parseFloat(p.preco_venda || p.precoVenda || 0) - parseFloat(p.preco_aquisicao || p.precoAquisicao || 0)) * (p.quantidade || 0),
    'Valor Total': (p.quantidade || 0) * parseFloat(p.preco_venda || p.precoVenda || 0),
    'Data Atualizacao': p.updated_at
  }));
  
  exportData(data, `inventario-${tipo}`, 'xlsx');
}

function exportMovimentacoes() {
  const data = AppState.movimentacoes.map(m => ({
    Data: m.created_at || m.data,
    Tipo: m.tipo,
    Produto: m.produto_nome,
    Quantidade: m.quantidade,
    Origem: m.local_origem,
    Destino: m.local_destino,
    Valor: m.valor,
    Observacao: m.observacao || ''
  }));
  exportData(data, 'movimentacoes', 'xlsx');
}

// ============================================================
// MODULE: COMBUSTIVEIS (FUEL)
// ============================================================

function renderCombustiveis(container) {
  const combustiveis = AppState.combustiveis;
  const todayComb = combustiveis.filter(c => (c.data || '').startsWith(getToday()));
  
  const tipos = ['Gasolina', 'Diesel', 'Petroleo', 'Lubrificante'];
  const tipoConfig = {
    'Gasolina': { emoji: '⛽', color: '#ef4444' },
    'Diesel': { emoji: '🛢️', color: '#f59e0b' },
    'Petroleo': { emoji: '🏭', color: '#6b7280' },
    'Lubrificante': { emoji: '🛢️', color: '#3b82f6' }
  };
  
  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Combustiveis</h1>
        <p>Controle de posto de combustivel e lubrificantes</p>
      </div>
      
      <div class="filter-bar">
        <div class="btn-group">
          <button class="btn btn-primary" onclick="venderCombustivel()">${Icons.add} Nova Venda</button>
          <button class="btn btn-success" onclick="entradaCombustivel()">${Icons.add} Entrada</button>
          <button class="btn btn-outline" onclick="exportCombustiveis()">${Icons.export} Exportar</button>
        </div>
      </div>
      
      <div class="card-grid">
        ${tipos.map(tipo => {
          const tipoData = combustiveis.filter(c => (c.tipo || '').toLowerCase() === tipo.toLowerCase());
          const todayData = tipoData.filter(c => (c.data || '').startsWith(getToday()));
          const totalLitros = todayData.reduce((s, c) => s + (parseFloat(c.litros) || 0), 0);
          const totalReceita = todayData.reduce((s, c) => s + (parseFloat(c.total_venda) || 0), 0);
          const totalLucro = todayData.reduce((s, c) => s + (parseFloat(c.lucro) || 0), 0);
          
          return `
            <div class="stat-card">
              <div class="stat-card-header">
                <span class="stat-card-title">${tipo} Hoje</span>
                <div class="stat-card-icon" style="background:${tipoConfig[tipo]?.color || '#666'}20;color:${tipoConfig[tipo]?.color || '#666'}">
                  ${Icons.fuel}
                </div>
              </div>
              <div class="stat-card-value">${formatNumber(totalLitros)} L</div>
              <div class="stat-card-change positive">${formatCurrency(totalReceita)} receita</div>
            </div>
          `;
        }).join('')}
      </div>
      
      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Historico de Vendas</span>
        </div>
        <div class="content-card-body">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr><th>Data</th><th>Tipo</th><th>Bomba</th><th>Litros</th><th>P. Venda/L</th><th>Total</th><th>Lucro</th></tr>
              </thead>
              <tbody>
                ${combustiveis.length > 0 ? [...combustiveis].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 50).map(c => `
                  <tr>
                    <td>${formatDate(c.created_at || c.data)}</td>
                    <td><span class="badge badge-neutral">${c.tipo || '-'}</span></td>
                    <td>${c.bomba || '-'}</td>
                    <td>${formatNumber(c.litros)} L</td>
                    <td>${formatCurrency(c.preco_venda)}</td>
                    <td>${formatCurrency(c.total_venda)}</td>
                    <td style="color:var(--success)">${formatCurrency(c.lucro)}</td>
                  </tr>
                `).join('') : '<tr><td colspan="7" style="text-align:center">Nenhum registro</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

function venderCombustivel() {
  const tipos = ['Gasolina', 'Diesel', 'Petroleo', 'Lubrificante'];
  const bombaOptions = [1, 2, 3, 4, 5].map(b => `<option value="${b}">Bomba ${b}</option>`).join('');
  const tipoOptions = tipos.map(t => `<option value="${t}">${t}</option>`).join('');
  
  const content = `
    <form id="combVendaForm">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Tipo de Combustivel <span class="required">*</span></label>
          <select class="form-select" id="combTipo" required>${tipoOptions}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Bomba</label>
          <select class="form-select" id="combBomba">${bombaOptions}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Litros <span class="required">*</span></label>
          <input type="number" class="form-input" id="combLitros" min="0.1" step="0.01" required oninput="calcularCombustivel()">
        </div>
        <div class="form-group">
          <label class="form-label">Preco de Venda/Litro <span class="required">*</span></label>
          <input type="number" class="form-input" id="combPrecoVenda" min="0" step="0.01" required oninput="calcularCombustivel()">
        </div>
        <div class="form-group">
          <label class="form-label">Preco de Compra/Litro</label>
          <input type="number" class="form-input" id="combPrecoCompra" min="0" step="0.01" oninput="calcularCombustivel()">
        </div>
        <div class="form-group">
          <label class="form-label">Total Venda</label>
          <input type="text" class="form-input" id="combTotal" disabled>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Lucro Estimado</label>
        <input type="text" class="form-input" id="combLucro" disabled style="color:var(--success);font-weight:600">
      </div>
    </form>
  `;
  
  const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="confirmarVendaCombustivel()">Registrar Venda</button>
  `;
  
  openModal('Vender Combustivel', content, footer);
}

function calcularCombustivel() {
  const litros = parseFloat(document.getElementById('combLitros')?.value) || 0;
  const precoVenda = parseFloat(document.getElementById('combPrecoVenda')?.value) || 0;
  const precoCompra = parseFloat(document.getElementById('combPrecoCompra')?.value) || 0;
  
  const total = litros * precoVenda;
  const lucro = litros * (precoVenda - precoCompra);
  
  const totalInput = document.getElementById('combTotal');
  const lucroInput = document.getElementById('combLucro');
  
  if (totalInput) totalInput.value = formatCurrency(total);
  if (lucroInput) lucroInput.value = formatCurrency(lucro);
}

function confirmarVendaCombustivel() {
  const tipo = document.getElementById('combTipo')?.value;
  const bomba = document.getElementById('combBomba')?.value;
  const litros = parseFloat(document.getElementById('combLitros')?.value) || 0;
  const precoVenda = parseFloat(document.getElementById('combPrecoVenda')?.value) || 0;
  const precoCompra = parseFloat(document.getElementById('combPrecoCompra')?.value) || 0;
  
  if (!tipo || litros <= 0 || precoVenda <= 0) {
    showToast('Preencha todos os campos obrigatorios!', 'error');
    return;
  }
  
  const total = litros * precoVenda;
  const lucro = litros * (precoVenda - precoCompra);
  
  const record = {
    id: generateId(),
    tipo,
    bomba,
    litros,
    preco_venda: precoVenda,
    preco_compra: precoCompra,
    total_venda: total,
    lucro,
    data: getToday(),
    created_at: new Date().toISOString()
  };
  
  AppState.combustiveis.push(record);
  AppState.save('combustiveis');
  
  closeModal();
  showToast(`Venda de ${litros}L de ${tipo} registrada! Lucro: ${formatCurrency(lucro)}`, 'success');
  refreshCurrentPage();
}

function entradaCombustivel() {
  const tipos = ['Gasolina', 'Diesel', 'Petroleo', 'Lubrificante'];
  const tipoOptions = tipos.map(t => `<option value="${t}">${t}</option>`).join('');
  
  const content = `
    <form id="combEntradaForm">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Tipo <span class="required">*</span></label>
          <select class="form-select" id="combEntTipo" required>${tipoOptions}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Litros <span class="required">*</span></label>
          <input type="number" class="form-input" id="combEntLitros" min="0.1" step="0.01" required>
        </div>
        <div class="form-group">
          <label class="form-label">Preco de Compra/Litro</label>
          <input type="number" class="form-input" id="combEntPreco" min="0" step="0.01">
        </div>
        <div class="form-group">
          <label class="form-label">Fornecedor</label>
          <input type="text" class="form-input" id="combEntFornecedor" placeholder="Nome do fornecedor">
        </div>
      </div>
    </form>
  `;
  
  const footer = `
    <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-success" onclick="confirmarEntradaCombustivel()">Registrar Entrada</button>
  `;
  
  openModal('Entrada de Combustivel', content, footer);
}

function confirmarEntradaCombustivel() {
  const tipo = document.getElementById('combEntTipo')?.value;
  const litros = parseFloat(document.getElementById('combEntLitros')?.value) || 0;
  const preco = parseFloat(document.getElementById('combEntPreco')?.value) || 0;
  const fornecedor = document.getElementById('combEntFornecedor')?.value || '';
  
  if (!tipo || litros <= 0) {
    showToast('Preencha todos os campos obrigatorios!', 'error');
    return;
  }
  
  const record = {
    id: generateId(),
    tipo,
    litros,
    preco_compra: preco,
    fornecedor,
    total_venda: 0,
    lucro: 0,
    data: getToday(),
    created_at: new Date().toISOString(),
    is_entrada: true
  };
  
  AppState.combustiveis.push(record);
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
    'Preco Venda/L': c.preco_venda,
    'Preco Compra/L': c.preco_compra,
    'Total Venda': c.total_venda,
    Lucro: c.lucro,
    Fornecedor: c.fornecedor || '-',
    Entrada: c.is_entrada ? 'Sim' : 'Nao'
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
        <p>Relatorios inteligentes e analise de dados</p>
      </div>
      
      <div class="tabs">
        <button class="tab active" onclick="showRelTab('vendas', this)">Vendas</button>
        <button class="tab" onclick="showRelTab('financeiro', this)">Financeiro</button>
        <button class="tab" onclick="showRelTab('combustiveis', this)">Combustiveis</button>
        <button class="tab" onclick="showRelTab('inventario', this)">Inventario</button>
        <button class="tab" onclick="showRelTab('fechamento', this)">Fechar Dia</button>
      </div>
      
      <div id="rel-vendas" class="tab-content active">
        ${renderRelatorioVendas()}
      </div>
      
      <div id="rel-financeiro" class="tab-content">
        ${renderRelatorioFinanceiro()}
      </div>
      
      <div id="rel-combustiveis" class="tab-content">
        ${renderRelatorioCombustiveis()}
      </div>
      
      <div id="rel-inventario" class="tab-content">
        ${renderRelatorioInventario()}
      </div>
      
      <div id="rel-fechamento" class="tab-content">
        ${renderFechamentoDia()}
      </div>
    </div>
  `;
}

function showRelTab(tab, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const content = document.getElementById(`rel-${tab}`);
  if (content) content.classList.add('active');
}

function renderRelatorioVendas() {
  const periodos = [
    { id: 'dia', label: 'Hoje' },
    { id: 'semana', label: 'Semana' },
    { id: 'mes', label: 'Mes' },
    { id: 'trimestre', label: 'Trimestre' },
    { id: 'todos', label: 'Todos' }
  ];
  
  return `
    <div class="content-card">
      <div class="content-card-header">
        <span class="content-card-title">Relatorio de Vendas</span>
        <div class="content-card-actions">
          ${periodos.map(p => `<button class="btn btn-sm ${p.id === 'dia' ? 'btn-primary' : 'btn-ghost'}" onclick="gerarRelVendas('${p.id}', this)">${p.label}</button>`).join('')}
        </div>
      </div>
      <div class="content-card-body" id="relVendasContent">
        ${gerarRelatorioVendasHTML('dia')}
      </div>
    </div>
  `;
}

function gerarRelatorioVendasHTML(periodo) {
  const now = new Date();
  let startDate;
  
  switch (periodo) {
    case 'dia': startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); break;
    case 'semana': startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
    case 'mes': startDate = new Date(now.getFullYear(), now.getMonth(), 1); break;
    case 'trimestre': startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1); break;
    default: startDate = new Date(0);
  }
  
  const vendas = AppState.vendas.filter(v => new Date(v.created_at || v.data) >= startDate);
  const totalVendido = vendas.reduce((s, v) => s + (parseFloat(v.total) || 0), 0);
  const totalLucro = vendas.reduce((s, v) => s + (parseFloat(v.lucro) || 0), 0);
  
  // Group by category
  const porCategoria = {};
  vendas.forEach(v => {
    const cat = v.categoria || 'Outros';
    if (!porCategoria[cat]) porCategoria[cat] = { nome: getCategoryName(cat), quantidade: 0, total: 0, lucro: 0 };
    porCategoria[cat].quantidade += parseInt(v.quantidade) || 0;
    porCategoria[cat].total += parseFloat(v.total) || 0;
    porCategoria[cat].lucro += parseFloat(v.lucro) || 0;
  });
  
  // Top products
  const produtosMap = {};
  vendas.forEach(v => {
    const nome = v.produto_nome || v.produto || 'Desconhecido';
    if (!produtosMap[nome]) produtosMap[nome] = { nome, quantidade: 0, total: 0 };
    produtosMap[nome].quantidade += parseInt(v.quantidade) || 0;
    produtosMap[nome].total += parseFloat(v.total) || 0;
  });
  
  const topProdutos = Object.values(produtosMap).sort((a, b) => b.quantidade - a.quantidade).slice(0, 5);
  
  if (vendas.length === 0) {
    return renderEmptyState('Nenhuma venda no periodo', 'As vendas aparecerao aqui quando forem registradas.');
  }
  
  return `
    <div class="card-grid" style="margin-bottom:20px">
      <div class="stat-card">
        <div class="stat-card-header"><span class="stat-card-title">Total Vendas</span><div class="stat-card-icon accent">${Icons.dollar}</div></div>
        <div class="stat-card-value">${formatCurrency(totalVendido)}</div>
        <div class="stat-card-change positive">${vendas.length} transacoes</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-header"><span class="stat-card-title">Lucro Total</span><div class="stat-card-icon success">${Icons.trendUp}</div></div>
        <div class="stat-card-value">${formatCurrency(totalLucro)}</div>
        <div class="stat-card-change positive">${totalVendido > 0 ? ((totalLucro/totalVendido)*100).toFixed(1) : 0}% margem</div>
      </div>
    </div>
    
    <h3 style="margin-bottom:12px;font-size:1rem">Por Categoria</h3>
    <div class="table-responsive" style="margin-bottom:20px">
      <table class="data-table">
        <thead><tr><th>Categoria</th><th>Quantidade</th><th>Total</th><th>Lucro</th></tr></thead>
        <tbody>
          ${Object.values(porCategoria).map(c => `
            <tr><td><strong>${escapeHtml(c.nome)}</strong></td><td>${c.quantidade}</td><td>${formatCurrency(c.total)}</td><td style="color:var(--success)">${formatCurrency(c.lucro)}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <h3 style="margin-bottom:12px;font-size:1rem">Produtos Mais Vendidos</h3>
    <div class="table-responsive">
      <table class="data-table">
        <thead><tr><th>Produto</th><th>Quantidade</th><th>Total</th></tr></thead>
        <tbody>
          ${topProdutos.map(p => `
            <tr><td><strong>${escapeHtml(p.nome)}</strong></td><td>${p.quantidade}</td><td>${formatCurrency(p.total)}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function gerarRelVendas(periodo, el) {
  const container = document.getElementById('relVendasContent');
  if (container) container.innerHTML = gerarRelatorioVendasHTML(periodo);
  
  if (el) {
    el.parentElement.querySelectorAll('.btn').forEach(b => { b.classList.remove('btn-primary'); b.classList.add('btn-ghost'); });
    el.classList.remove('btn-ghost');
    el.classList.add('btn-primary');
  }
}

function renderRelatorioFinanceiro() {
  const entradas = AppState.vendas.reduce((s, v) => s + (parseFloat(v.total) || 0), 0);
  const lucroTotal = AppState.vendas.reduce((s, v) => s + (parseFloat(v.lucro) || 0), 0);
  const combustivelReceita = AppState.combustiveis.filter(c => !c.is_entrada).reduce((s, c) => s + (parseFloat(c.total_venda) || 0), 0);
  const combustivelLucro = AppState.combustiveis.filter(c => !c.is_entrada).reduce((s, c) => s + (parseFloat(c.lucro) || 0), 0);
  
  return `
    <div class="content-card">
      <div class="content-card-header">
        <span class="content-card-title">Resumo Financeiro Geral</span>
      </div>
      <div class="content-card-body">
        <div class="card-grid">
          <div class="stat-card">
            <div class="stat-card-header"><span class="stat-card-title">Receita Loja</span><div class="stat-card-icon accent">${Icons.store}</div></div>
            <div class="stat-card-value">${formatCurrency(entradas)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header"><span class="stat-card-title">Lucro Loja</span><div class="stat-card-icon success">${Icons.trendUp}</div></div>
            <div class="stat-card-value">${formatCurrency(lucroTotal)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header"><span class="stat-card-title">Receita Combustivel</span><div class="stat-card-icon warning">${Icons.fuel}</div></div>
            <div class="stat-card-value">${formatCurrency(combustivelReceita)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header"><span class="stat-card-title">Lucro Combustivel</span><div class="stat-card-icon success">${Icons.trendUp}</div></div>
            <div class="stat-card-value">${formatCurrency(combustivelLucro)}</div>
          </div>
        </div>
        
        <div style="margin-top:20px;padding:20px;background:linear-gradient(135deg, var(--primary), var(--primary-light));border-radius:var(--border-radius);color:#fff">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-size:0.875rem;opacity:0.8">RECEITA TOTAL ACUMULADA</div>
              <div style="font-size:2rem;font-weight:700">${formatCurrency(entradas + combustivelReceita)}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:0.875rem;opacity:0.8">LUCRO TOTAL</div>
              <div style="font-size:1.5rem;font-weight:700">${formatCurrency(lucroTotal + combustivelLucro)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderRelatorioCombustiveis() {
  const report = Formulas.gerarRelatorioCombustivel(AppState.combustiveis.filter(c => !c.is_entrada));
  
  return `
    <div class="content-card">
      <div class="content-card-header">
        <span class="content-card-title">Relatorio de Combustiveis</span>
      </div>
      <div class="content-card-body">
        <div class="card-grid">
          <div class="stat-card">
            <div class="stat-card-header"><span class="stat-card-title">Total Litros</span><div class="stat-card-icon primary">${Icons.fuel}</div></div>
            <div class="stat-card-value">${formatNumber(report.totalLitros)} L</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header"><span class="stat-card-title">Receita Total</span><div class="stat-card-icon accent">${Icons.dollar}</div></div>
            <div class="stat-card-value">${formatCurrency(report.totalReceita)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header"><span class="stat-card-title">Lucro Total</span><div class="stat-card-icon success">${Icons.trendUp}</div></div>
            <div class="stat-card-value">${formatCurrency(report.totalLucro)}</div>
          </div>
        </div>
        
        ${report.porTipo.length > 0 ? `
          <h3 style="margin:20px 0 12px;font-size:1rem">Por Tipo</h3>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Tipo</th><th>Litros</th><th>Transacoes</th><th>Receita</th><th>Lucro</th></tr></thead>
              <tbody>
                ${report.porTipo.map(t => `
                  <tr><td><strong>${t.tipo}</strong></td><td>${formatNumber(t.litros)} L</td><td>${t.transacoes}</td><td>${formatCurrency(t.receita)}</td><td style="color:var(--success)">${formatCurrency(t.lucro)}</td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : renderEmptyState('Nenhum dado de combustivel', '')}
      </div>
    </div>
  `;
}

function renderRelatorioInventario() {
  const report = Formulas.gerarRelatorioInventario(AppState.produtos);
  const lowStock = report.geral.listaEstoqueBaixo.slice(0, 10);
  
  return `
    <div class="content-card">
      <div class="content-card-header">
        <span class="content-card-title">Relatorio de Inventario</span>
        <button class="btn btn-outline btn-sm" onclick="exportInventario('completo')">${Icons.export} Exportar</button>
      </div>
      <div class="content-card-body">
        <div class="card-grid">
          <div class="stat-card">
            <div class="stat-card-header"><span class="stat-card-title">Produtos Totais</span><div class="stat-card-icon primary">${Icons.package}</div></div>
            <div class="stat-card-value">${report.geral.quantidadeTotalProdutos}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header"><span class="stat-card-title">Valor Armazem</span><div class="stat-card-icon warning">${Icons.warehouse}</div></div>
            <div class="stat-card-value">${formatCurrency(report.armazem.valorTotal)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header"><span class="stat-card-title">Valor Loja</span><div class="stat-card-icon accent">${Icons.store}</div></div>
            <div class="stat-card-value">${formatCurrency(report.loja.valorTotal)}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-header"><span class="stat-card-title">Lucro Potencial</span><div class="stat-card-icon success">${Icons.trendUp}</div></div>
            <div class="stat-card-value">${formatCurrency(report.geral.lucroPotencial)}</div>
          </div>
        </div>
        
        ${lowStock.length > 0 ? `
          <h3 style="margin:20px 0 12px;font-size:1rem">Produtos com Estoque Baixo</h3>
          <div class="table-responsive">
            <table class="data-table">
              <thead><tr><th>Produto</th><th>Categoria</th><th>Local</th><th>Quantidade</th></tr></thead>
              <tbody>
                ${lowStock.map(p => `
                  <tr><td><strong>${escapeHtml(p.nome)}</strong></td><td>${escapeHtml(getCategoryName(p.categoria))}</td><td>${p.local === 'loja' ? 'Loja' : 'Armazem'}</td><td style="color:var(--danger);font-weight:600">${p.quantidade || 0}</td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderFechamentoDia() {
  const today = getToday();
  const todayVendas = AppState.vendas.filter(v => (v.created_at || v.data || '').startsWith(today));
  const todayComb = AppState.combustiveis.filter(c => !c.is_entrada && (c.created_at || c.data || '').startsWith(today));
  
  const totalVendas = todayVendas.reduce((s, v) => s + (parseFloat(v.total) || 0), 0);
  const totalLucro = todayVendas.reduce((s, v) => s + (parseFloat(v.lucro) || 0), 0);
  const totalComb = todayComb.reduce((s, c) => s + (parseFloat(c.total_venda) || 0), 0);
  const lucroComb = todayComb.reduce((s, c) => s + (parseFloat(c.lucro) || 0), 0);
  
  return `
    <div class="content-card">
      <div class="content-card-header">
        <span class="content-card-title">Encerramento do Dia - ${new Date().toLocaleDateString('pt-AO')}</span>
      </div>
      <div class="content-card-body">
        <div class="close-summary">
          <h3>Resumo do Dia</h3>
          <div class="close-grid">
            <div class="close-item">
              <div class="close-item-value">${todayVendas.length}</div>
              <div class="close-item-label">Vendas Loja</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(totalVendas)}</div>
              <div class="close-item-label">Receita Loja</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(totalLucro)}</div>
              <div class="close-item-label">Lucro Loja</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${todayComb.length}</div>
              <div class="close-item-label">Vendas Combustivel</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(totalComb)}</div>
              <div class="close-item-label">Receita Combustivel</div>
            </div>
            <div class="close-item">
              <div class="close-item-value">${formatCurrency(lucroComb)}</div>
              <div class="close-item-label">Lucro Combustivel</div>
            </div>
          </div>
        </div>
        
        <div style="margin-top:20px">
          <h3 style="margin-bottom:12px;font-size:1rem">Vendas do Dia</h3>
          ${todayVendas.length > 0 ? `
            <div class="table-responsive">
              <table class="data-table">
                <thead><tr><th>Produto</th><th>Qtd</th><th>Total</th><th>Lucro</th></tr></thead>
                <tbody>
                  ${todayVendas.map(v => `
                    <tr><td>${escapeHtml(v.produto_nome || v.produto)}</td><td>${v.quantidade}</td><td>${formatCurrency(v.total)}</td><td style="color:var(--success)">${formatCurrency(v.lucro)}</td></tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : '<p style="color:var(--text-muted)">Nenhuma venda hoje</p>'}
        </div>
        
        <div style="margin-top:24px;text-align:center">
          <button class="btn btn-primary btn-lg" onclick="executarFechamento()">${Icons.check} Encerrar Dia e Gerar Relatorio</button>
        </div>
      </div>
    </div>
  `;
}

function executarFechamento() {
  const today = getToday();
  const todayVendas = AppState.vendas.filter(v => (v.created_at || v.data || '').startsWith(today));
  const todayComb = AppState.combustiveis.filter(c => !c.is_entrada && (c.created_at || c.data || '').startsWith(today));
  
  const relatorio = {
    id: generateId(),
    tipo: 'fechamento_diario',
    data: today,
    total_vendas_loja: todayVendas.reduce((s, v) => s + (parseFloat(v.total) || 0), 0),
    total_lucro_loja: todayVendas.reduce((s, v) => s + (parseFloat(v.lucro) || 0), 0),
    total_vendas_combustivel: todayComb.reduce((s, c) => s + (parseFloat(c.total_venda) || 0), 0),
    total_lucro_combustivel: todayComb.reduce((s, c) => s + (parseFloat(c.lucro) || 0), 0),
    quantidade_vendas_loja: todayVendas.length,
    quantidade_vendas_combustivel: todayComb.length,
    created_at: new Date().toISOString()
  };
  
  AppState.relatorios.push(relatorio);
  AppState.save('relatorios');
  
  showToast('Dia encerrado com sucesso! Relatorio gerado.', 'success');
  refreshCurrentPage();
}

// ============================================================
// MODULE: CONFIGURACOES (SETTINGS)
// ============================================================

function renderConfiguracoes(container) {
  const cfg = AppState.configs;
  
  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Configuracoes</h1>
        <p>Configuracoes do sistema e banco de dados</p>
      </div>
      
      <div class="tabs">
        <button class="tab active" onclick="showConfigTab('geral', this)">Geral</button>
        <button class="tab" onclick="showConfigTab('supabase', this)">Supabase</button>
        <button class="tab" onclick="showConfigTab('dados', this)">Dados</button>
      </div>
      
      <div id="cfg-geral" class="tab-content active">
        <div class="content-card">
          <div class="content-card-header">
            <span class="content-card-title">Configuracoes Gerais</span>
          </div>
          <div class="content-card-body">
            <form id="configForm">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Nome da Empresa</label>
                  <input type="text" class="form-input" id="cfgEmpresa" value="${escapeHtml(cfg.nomeEmpresa || 'Shop Administrator')}">
                </div>
                <div class="form-group">
                  <label class="form-label">Moeda</label>
                  <select class="form-select" id="cfgMoeda">
                    <option value="AOA" ${(cfg.moeda || 'AOA') === 'AOA' ? 'selected' : ''}>Kwanza (AOA)</option>
                    <option value="USD" ${cfg.moeda === 'USD' ? 'selected' : ''}>Dolar (USD)</option>
                    <option value="EUR" ${cfg.moeda === 'EUR' ? 'selected' : ''}>Euro (EUR)</option>
                    <option value="BRL" ${cfg.moeda === 'BRL' ? 'selected' : ''}>Real (BRL)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Alerta de Estoque Baixo</label>
                  <input type="number" class="form-input" id="cfgAlerta" value="${cfg.alertaEstoque || 5}" min="1">
                  <div class="form-hint">Quantidade minima antes de alertar</div>
                </div>
              </div>
              <div style="margin-top:16px">
                <button type="button" class="btn btn-primary" onclick="salvarConfiguracoes()">${Icons.check} Salvar Configuracoes</button>
              </div>
            </form>
          </div>
        </div>
        
        <div class="content-card">
          <div class="content-card-header">
            <span class="content-card-title">Gerenciar Categorias</span>
          </div>
          <div class="content-card-body">
            <div class="form-group">
              <label class="form-label">Nova Categoria</label>
              <div class="input-group">
                <input type="text" class="form-input" id="novaCategoria" placeholder="Nome da categoria">
                <button class="btn btn-success" onclick="adicionarCategoria()">${Icons.add} Adicionar</button>
              </div>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
              ${AppState.categorias.map(c => `
                <span class="category-tag badge-neutral" style="display:flex;align-items:center;gap:8px;padding:8px 16px">
                  ${escapeHtml(c.nome)}
                  <button onclick="removerCategoria('${c.id}')" style="background:none;border:none;cursor:pointer;color:var(--danger);padding:0">${Icons.close}</button>
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
      
      <div id="cfg-supabase" class="tab-content">
        <div class="content-card">
          <div class="content-card-header">
            <span class="content-card-title">Configuracao do Supabase</span>
          </div>
          <div class="content-card-body">
            <form id="supabaseForm">
              <div class="form-group">
                <label class="form-label">URL do Projeto Supabase</label>
                <input type="url" class="form-input" id="sbUrl" placeholder="https://seu-projeto.supabase.co" value="${localStorage.getItem('sb_url') || ''}">
              </div>
              <div class="form-group">
                <label class="form-label">API Key (anon/public)</label>
                <input type="password" class="form-input" id="sbKey" placeholder="sua-chave-anon" value="${localStorage.getItem('sb_key') || ''}">
              </div>
              <div class="form-hint">Deixe em branco para usar armazenamento local (dados ficam no navegador)</div>
              <div style="margin-top:16px">
                <button type="button" class="btn btn-primary" onclick="salvarSupabase()">${Icons.check} Salvar e Conectar</button>
                <button type="button" class="btn btn-outline" onclick="testarSupabase()">${Icons.check} Testar Conexao</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div id="cfg-dados" class="tab-content">
        <div class="content-card">
          <div class="content-card-header">
            <span class="content-card-title">Gerenciamento de Dados</span>
          </div>
          <div class="content-card-body">
            <div style="display:grid;gap:16px">
              <div style="padding:16px;border:1px solid var(--border);border-radius:var(--border-radius)">
                <h4 style="margin-bottom:8px">Exportar Dados</h4>
                <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:12px">Exporte todos os dados do sistema para backup</p>
                <button class="btn btn-success" onclick="exportarTodosDados()">${Icons.export} Exportar Todos os Dados (JSON)</button>
              </div>
              
              <div style="padding:16px;border:1px solid var(--border);border-radius:var(--border-radius)">
                <h4 style="margin-bottom:8px">Importar Dados</h4>
                <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:12px">Importe dados de um arquivo JSON de backup</p>
                <input type="file" id="importFile" accept=".json" onchange="importarDados(this)" style="margin-bottom:8px">
                <div class="form-hint">Apenas arquivos JSON exportados deste sistema</div>
              </div>
              
              <div style="padding:16px;border:1px solid var(--border);border-radius:var(--border-radius);border-color:var(--danger)">
                <h4 style="margin-bottom:8px;color:var(--danger)">Zona de Perigo</h4>
                <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:12px">Estas acoes nao podem ser desfeitas!</p>
                <button class="btn btn-danger" onclick="limparTodosDados()">${Icons.trash} Limpar Todos os Dados</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function showConfigTab(tab, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  const content = document.getElementById(`cfg-${tab}`);
  if (content) content.classList.add('active');
}

function salvarConfiguracoes() {
  AppState.configs = {
    nomeEmpresa: document.getElementById('cfgEmpresa')?.value || 'Shop Administrator',
    moeda: document.getElementById('cfgMoeda')?.value || 'AOA',
    alertaEstoque: parseInt(document.getElementById('cfgAlerta')?.value) || 5
  };
  AppState.save('configs');
  showToast('Configuracoes salvas!', 'success');
  refreshCurrentPage();
}

function adicionarCategoria() {
  const nome = document.getElementById('novaCategoria')?.value?.trim();
  if (!nome) return;
  
  const cores = ['#3b82f6', '#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#f97316', '#6b7280', '#ec4899', '#14b8a6'];
  const nova = {
    id: generateId(),
    nome,
    cor: cores[Math.floor(Math.random() * cores.length)]
  };
  
  AppState.categorias.push(nova);
  AppState.save('categorias');
  showToast(`Categoria "${nome}" adicionada!`, 'success');
  refreshCurrentPage();
}

function removerCategoria(id) {
  confirmDialog('Remover esta categoria?', () => {
    AppState.categorias = AppState.categorias.filter(c => c.id !== id);
    AppState.save('categorias');
    showToast('Categoria removida!', 'warning');
    refreshCurrentPage();
  });
}

function salvarSupabase() {
  const url = document.getElementById('sbUrl')?.value?.trim();
  const key = document.getElementById('sbKey')?.value?.trim();
  
  if (url && key) {
    SupabaseAPI.setConfig(url, key);
    showToast('Configuracao do Supabase salva!', 'success');
  } else {
    localStorage.removeItem('sb_url');
    localStorage.removeItem('sb_key');
    showToast('Usando armazenamento local', 'info');
  }
}

function testarSupabase() {
  showToast('Testando conexao...', 'info');
  setTimeout(() => {
    if (SupabaseAPI.isConfigured()) {
      showToast('Conexao configurada! (Teste real requer servidor)', 'success');
    } else {
      showToast('Usando armazenamento local', 'info');
    }
  }, 1000);
}

function exportarTodosDados() {
  const data = {
    exportDate: new Date().toISOString(),
    version: '2.0',
    produtos: AppState.produtos,
    categorias: AppState.categorias,
    vendas: AppState.vendas,
    movimentacoes: AppState.movimentacoes,
    combustiveis: AppState.combustiveis,
    relatorios: AppState.relatorios,
    configs: AppState.configs
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shop-admin-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup exportado!', 'success');
}

function importarDados(input) {
  const file = input.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.produtos) { AppState.produtos = data.produtos; AppState.save('produtos'); }
      if (data.categorias) { AppState.categorias = data.categorias; AppState.save('categorias'); }
      if (data.vendas) { AppState.vendas = data.vendas; AppState.save('vendas'); }
      if (data.movimentacoes) { AppState.movimentacoes = data.movimentacoes; AppState.save('movimentacoes'); }
      if (data.combustiveis) { AppState.combustiveis = data.combustiveis; AppState.save('combustiveis'); }
      if (data.relatorios) { AppState.relatorios = data.relatorios; AppState.save('relatorios'); }
      if (data.configs) { AppState.configs = data.configs; AppState.save('configs'); }
      
      showToast('Dados importados com sucesso!', 'success');
      refreshCurrentPage();
    } catch (err) {
      showToast('Erro ao importar: arquivo invalido', 'error');
    }
  };
  reader.readAsText(file);
  input.value = '';
}

function limparTodosDados() {
  confirmDialog('ATENCAO: Todos os dados serao apagados permanentemente! Deseja continuar?', () => {
    ['produtos', 'vendas', 'movimentacoes', 'combustiveis', 'relatorios'].forEach(t => {
      localStorage.removeItem(`sb_${t}`);
      AppState[t] = [];
    });
    showToast('Todos os dados foram removidos!', 'warning');
    refreshCurrentPage();
  });
}


// ============================================================
// MODULE: ADICIONAR PRODUTO
// ============================================================

function renderAdicionarProduto(container) {
  const catOptions = AppState.categorias.map(c => `<option value="${c.id}">${escapeHtml(c.nome)}</option>`).join('');
  const percentuais = [...new Set(AppState.produtos.map(p => p.percentual_lucro || p.percentualLucro).filter(p => p))];
  
  container.innerHTML = `
    <div class="animate-slide-up">
      <div class="page-header">
        <h1>Adicionar Produto ao Armazem</h1>
        <p>Cadastre novos produtos no sistema</p>
      </div>
      
      <div class="content-card">
        <div class="content-card-body">
          <form id="addProdutoForm" onsubmit="event.preventDefault(); salvarProduto();">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nome do Produto <span class="required">*</span></label>
                <input type="text" class="form-input" id="addNome" required placeholder="Ex: Coca-Cola 350ml">
              </div>
              
              <div class="form-group">
                <label class="form-label">Categoria</label>
                <select class="form-select" id="addCategoria">${catOptions}</select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Quantidade <span class="required">*</span></label>
                <input type="number" class="form-input" id="addQuantidade" min="1" value="1" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Preco de Aquisicao <span class="required">*</span></label>
                <input type="number" class="form-input" id="addPrecoAquisicao" min="0" step="0.01" required placeholder="0.00" oninput="calcularPrecoVendaAuto()">
              </div>
              
              <div class="form-group">
                <label class="form-label">Percentual de Lucro (%)</label>
                <div style="display:flex;gap:8px">
                  <input type="number" class="form-input" id="addPercentual" min="0" step="0.1" value="30" oninput="calcularPrecoVendaAuto()">
                  <select class="form-select" id="addPercentualSelect" onchange="document.getElementById('addPercentual').value=this.value;calcularPrecoVendaAuto()" style="max-width:120px">
                    <option value="">Salvos</option>
                    ${percentuais.map(p => `<option value="${p}">${p}%</option>`).join('')}
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Preco de Venda (Auto)</label>
                <input type="number" class="form-input" id="addPrecoVenda" min="0" step="0.01" oninput="calcularPercentualAuto()">
                <div class="form-hint">Preenchido automaticamente ou informe manualmente</div>
              </div>
            </div>
            
            <div class="form-group" style="margin-top:16px">
              <label class="form-label">Codigo do Produto</label>
              <input type="text" class="form-input" id="addCodigo" placeholder="Gerado automaticamente" readonly>
              <div class="form-hint">O codigo e gerado automaticamente ao salvar</div>
            </div>
            
            <div style="margin-top:24px;display:flex;gap:12px">
              <button type="submit" class="btn btn-primary btn-lg">${Icons.check} Salvar Produto</button>
              <button type="button" class="btn btn-outline btn-lg" onclick="navigate('armazem')">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
      
      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Importacao em Massa</span>
        </div>
        <div class="content-card-body">
          <div class="upload-area" onclick="document.getElementById('massImport').click()" 
               ondragover="event.preventDefault();this.classList.add('dragover')" 
               ondragleave="this.classList.remove('dragover')"
               ondrop="handleMassDrop(event)">
            ${Icons.upload}
            <h3>Arraste ficheiros aqui</h3>
            <p>ou clique para selecionar (CSV, XLSX, JSON, TXT, XML, ODS, TSV)</p>
            <input type="file" id="massImport" style="display:none" accept=".csv,.xlsx,.xls,.json,.txt,.xml,.ods,.tsv" 
                   onchange="handleMassImport(this)" multiple>
          </div>
          
          <div id="importPreview" style="margin-top:16px"></div>
        </div>
      </div>
    </div>
  `;
  
  // Auto-calculate on load
  setTimeout(() => calcularPrecoVendaAuto(), 100);
}

function calcularPrecoVendaAuto() {
  const aquisicao = parseFloat(document.getElementById('addPrecoAquisicao')?.value) || 0;
  const percentual = parseFloat(document.getElementById('addPercentual')?.value) || 0;
  const vendaInput = document.getElementById('addPrecoVenda');
  
  if (aquisicao > 0 && vendaInput && !vendaInput.dataset.manual) {
    const p = percentual > 1 ? percentual / 100 : percentual;
    vendaInput.value = (aquisicao + (aquisicao * p)).toFixed(2);
  }
  
  // Generate code preview
  const nome = document.getElementById('addNome')?.value || 'PROD';
  const cat = document.getElementById('addCategoria')?.value || 'GER';
  document.getElementById('addCodigo').value = gerarCodigoProdutoPreview(nome, cat);
}

function calcularPercentualAuto() {
  const aquisicao = parseFloat(document.getElementById('addPrecoAquisicao')?.value) || 0;
  const venda = parseFloat(document.getElementById('addPrecoVenda')?.value) || 0;
  const percentualInput = document.getElementById('addPercentual');
  
  if (aquisicao > 0 && venda > 0 && percentualInput) {
    const p = ((venda - aquisicao) / aquisicao) * 100;
    percentualInput.value = p.toFixed(1);
    document.getElementById('addPrecoVenda').dataset.manual = 'true';
  }
}

function gerarCodigoProdutoPreview(nome, categoria) {
  const prefix = (categoria || 'PRD').substring(0, 3).toUpperCase();
  const namePart = (nome || 'XXX').substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString(36).substring(-4).toUpperCase();
  return `${prefix}-${namePart}-${timestamp}`;
}

function salvarProduto() {
  const nome = document.getElementById('addNome')?.value?.trim();
  const categoria = document.getElementById('addCategoria')?.value;
  const quantidade = parseInt(document.getElementById('addQuantidade')?.value) || 0;
  const precoAquisicao = parseFloat(document.getElementById('addPrecoAquisicao')?.value) || 0;
  const percentual = parseFloat(document.getElementById('addPercentual')?.value) || 0;
  const precoVenda = parseFloat(document.getElementById('addPrecoVenda')?.value) || 0;
  
  if (!nome || quantidade <= 0 || precoAquisicao <= 0) {
    showToast('Preencha todos os campos obrigatorios!', 'error');
    return;
  }
  
  const codigo = gerarCodigoProdutoPreview(nome, categoria) + Math.random().toString(36).substr(2, 3).toUpperCase();
  
  const produto = {
    id: generateId(),
    codigo,
    nome,
    categoria,
    quantidade,
    preco_aquisicao: precoAquisicao,
    precoAquisicao: precoAquisicao,
    percentual_lucro: percentual,
    percentualLucro: percentual,
    preco_venda: precoVenda || calcularPrecoVenda(precoAquisicao, percentual),
    precoVenda: precoVenda || calcularPrecoVenda(precoAquisicao, percentual),
    local: 'armazem',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Add movement record
  const mov = {
    id: generateId(),
    tipo: 'entrada',
    produto_id: produto.id,
    produto_nome: nome,
    quantidade,
    local_origem: 'fornecedor',
    local_destino: 'armazem',
    valor: quantidade * precoAquisicao,
    data: getToday(),
    created_at: new Date().toISOString()
  };
  
  AppState.produtos.push(produto);
  AppState.movimentacoes.push(mov);
  
  AppState.save('produtos');
  AppState.save('movimentacoes');
  
  showToast(`Produto "${nome}" adicionado com sucesso!`, 'success');
  
  // Reset form
  document.getElementById('addProdutoForm')?.reset();
  document.getElementById('addPrecoVenda').dataset.manual = '';
  calcularPrecoVendaAuto();
  
  // Optionally go back
  setTimeout(() => navigate('armazem'), 1000);
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
        <p>Envie produtos do armazem para a loja</p>
      </div>
      
      <div class="content-card">
        <div class="content-card-header">
          <span class="content-card-title">Selecionar Produtos</span>
          <div class="search-input" style="max-width:300px">
            ${Icons.search}
            <input type="text" id="transfSearch" placeholder="Buscar..." onkeyup="filterTransferencia()">
          </div>
        </div>
        <div class="content-card-body">
          ${produtosArmazem.length > 0 ? `
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr><th>Produto</th><th>Categoria</th><th>Armazem</th><th>Transferir</th><th></th></tr>
                </thead>
                <tbody id="transfTable">
                  ${produtosArmazem.map(p => `
                    <tr data-nome="${escapeHtml(p.nome).toLowerCase()}" data-id="${p.id}">
                      <td><strong>${escapeHtml(p.nome)}</strong></td>
                      <td><span class="badge badge-neutral">${escapeHtml(getCategoryName(p.categoria))}</span></td>
                      <td>${p.quantidade || 0}</td>
                      <td><input type="number" class="form-input" id="qtd-${p.id}" min="0" max="${p.quantidade || 0}" value="0" style="width:80px"></td>
                      <td><button class="btn btn-success btn-sm" onclick="transferirItem('${p.id}')">${Icons.transfer}</button></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <div style="margin-top:20px;display:flex;gap:12px;justify-content:flex-end">
              <button class="btn btn-outline" onclick="navigate('loja')">Ir para Loja</button>
              <button class="btn btn-primary" onclick="transferirTodos()">${Icons.check} Transferir Selecionados</button>
            </div>
          ` : renderEmptyState('Nenhum produto no armazem', 'Adicione produtos primeiro.')}
        </div>
      </div>
    </div>
  `;
}

function filterTransferencia() {
  const search = document.getElementById('transfSearch')?.value.toLowerCase() || '';
  const rows = document.querySelectorAll('#transfTable tr');
  rows.forEach(row => {
    const nome = row.dataset.nome || '';
    row.style.display = nome.includes(search) ? '' : 'none';
  });
}

function transferirItem(id) {
  const qtd = parseInt(document.getElementById(`qtd-${id}`)?.value) || 0;
  if (qtd <= 0) {
    showToast('Informe a quantidade!', 'error');
    return;
  }
  
  executarTransferencia(id, qtd);
}

function transferirTodos() {
  let transferidos = 0;
  AppState.produtos.filter(p => p.local === 'armazem' || !p.local).forEach(p => {
    const qtd = parseInt(document.getElementById(`qtd-${p.id}`)?.value) || 0;
    if (qtd > 0) {
      executarTransferencia(p.id, qtd);
      transferidos++;
    }
  });
  
  if (transferidos === 0) {
    showToast('Nenhum produto selecionado!', 'warning');
  }
}

function executarTransferencia(id, qtd) {
  const p = AppState.produtos.find(x => x.id === id);
  if (!p) return;
  
  if ((p.quantidade || 0) < qtd) {
    showToast(`Quantidade insuficiente de ${p.nome}!`, 'error');
    return;
  }
  
  // Check if product already exists in store
  const existingLoja = AppState.produtos.find(x => x.nome === p.nome && x.local === 'loja');
  
  if (existingLoja) {
    existingLoja.quantidade = (existingLoja.quantidade || 0) + qtd;
    existingLoja.updated_at = new Date().toISOString();
  } else {
    const lojaProduct = {
      ...p,
      id: generateId(),
      local: 'loja',
      quantidade: qtd,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    AppState.produtos.push(lojaProduct);
  }
  
  // Reduce warehouse quantity
  p.quantidade = (p.quantidade || 0) - qtd;
  p.updated_at = new Date().toISOString();
  
  // Movement record
  const mov = {
    id: generateId(),
    tipo: 'transferencia',
    produto_id: p.id,
    produto_nome: p.nome,
    quantidade: qtd,
    local_origem: 'armazem',
    local_destino: 'loja',
    valor: qtd * parseFloat(p.preco_venda || p.precoVenda || 0),
    data: getToday(),
    created_at: new Date().toISOString()
  };
  
  AppState.movimentacoes.push(mov);
  AppState.save('produtos');
  AppState.save('movimentacoes');
  
  showToast(`${qtd}x ${p.nome} transferido para loja!`, 'success');
  refreshCurrentPage();
}

// ============================================================
// IMPORT/EXPORT SYSTEM
// ============================================================

function handleMassImport(input) {
  const files = Array.from(input.files);
  const preview = document.getElementById('importPreview');
  if (!preview) return;
  
  preview.innerHTML = '<div class="loading-spinner" style="margin:20px auto"></div>';
  
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = parseImportFile(e.target.result, file.name);
        if (data && data.length > 0) {
          showImportPreview(data, file.name);
        } else {
          preview.innerHTML = `<div class="badge badge-warning">Nenhum dado encontrado em ${file.name}</div>`;
        }
      } catch (err) {
        preview.innerHTML = `<div class="badge badge-danger">Erro ao ler ${file.name}: ${err.message}</div>`;
      }
    };
    reader.readAsText(file);
  });
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

function parseImportFile(content, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  
  switch (ext) {
    case 'json':
      return parseJSONImport(content);
    case 'csv':
    case 'txt':
    case 'tsv':
      return parseCSVImport(content, ext === 'tsv' ? '\t' : ',');
    case 'xml':
      return parseXMLImport(content);
    case 'ods':
    case 'xlsx':
    case 'xls':
      // For these formats, we try CSV-like parsing as fallback
      return parseCSVImport(content, ',');
    default:
      return parseCSVImport(content, ',');
  }
}

function parseJSONImport(content) {
  const data = JSON.parse(content);
  if (Array.isArray(data)) return data;
  if (data.produtos && Array.isArray(data.produtos)) return data.produtos;
  return [];
}

function parseCSVImport(content, delimiter = ',') {
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
  const results = [];
  
  // Smart column detection
  const colMap = {};
  headers.forEach((h, i) => {
    if (h.includes('nome') || h.includes('produto') || h.includes('product') || h.includes('descricao')) colMap.nome = i;
    if (h.includes('quant') || h.includes('qtd') || h.includes('stock') || h.includes('qty')) colMap.quantidade = i;
    if (h.includes('preco') || h.includes('preco') || h.includes('price') || h.includes('valor') || h.includes('custo')) {
      if (h.includes('venda') || h.includes('sale') || h.includes('selling')) colMap.preco_venda = i;
      else if (h.includes('aquis') || h.includes('compra') || h.includes('custo') || h.includes('cost')) colMap.preco_aquisicao = i;
      else colMap.preco_aquisicao = i;
    }
    if (h.includes('categoria') || h.includes('category') || h.includes('tipo') || h.includes('type')) colMap.categoria = i;
    if (h.includes('codigo') || h.includes('code') || h.includes('sku') || h.includes('ref')) colMap.codigo = i;
  });
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
    if (values.length < 2) continue;
    
    const row = {};
    if (colMap.nome !== undefined) row.nome = values[colMap.nome];
    if (colMap.quantidade !== undefined) row.quantidade = parseInt(values[colMap.quantidade]) || 0;
    if (colMap.preco_aquisicao !== undefined) row.preco_aquisicao = parseFloat(values[colMap.preco_aquisicao]) || 0;
    if (colMap.preco_venda !== undefined) row.preco_venda = parseFloat(values[colMap.preco_venda]) || 0;
    if (colMap.categoria !== undefined) row.categoria = values[colMap.categoria];
    if (colMap.codigo !== undefined) row.codigo = values[colMap.codigo];
    
    if (row.nome) results.push(row);
  }
  
  return results;
}

function parseXMLImport(content) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(content, 'text/xml');
  const items = xml.querySelectorAll('produto, product, item, row');
  
  return Array.from(items).map(item => {
    const getText = (tag) => {
      const el = item.querySelector(tag);
      return el ? el.textContent.trim() : '';
    };
    
    return {
      nome: getText('nome') || getText('name') || getText('descricao') || getText('description'),
      quantidade: parseInt(getText('quantidade') || getText('quantity') || getText('qtd')) || 0,
      preco_aquisicao: parseFloat(getText('preco_aquisicao') || getText('preco') || getText('price') || getText('cost')) || 0,
      preco_venda: parseFloat(getText('preco_venda') || getText('sale_price')) || 0,
      categoria: getText('categoria') || getText('category')
    };
  }).filter(r => r.nome);
}

function showImportPreview(data, filename) {
  const preview = document.getElementById('importPreview');
  if (!preview) return;
  
  const sample = data.slice(0, 5);
  const hasValidData = data.some(d => d.nome && (d.quantidade || d.preco_aquisicao || d.preco_venda));
  
  preview.innerHTML = `
    <div style="padding:16px;background:var(--success-bg);border-radius:var(--border-radius);margin-bottom:12px">
      <strong>${data.length} registros</strong> detectados em <code>${filename}</code>
      ${hasValidData ? '<span class="badge badge-success" style="margin-left:8px">Dados validos</span>' : '<span class="badge badge-warning" style="margin-left:8px">Verifique os dados</span>'}
    </div>
    
    <div class="table-responsive" style="margin-bottom:16px">
      <table class="data-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Qtd</th>
            <th>P. Aquisicao</th>
            <th>P. Venda</th>
          </tr>
        </thead>
        <tbody>
          ${sample.map(d => `
            <tr>
              <td>${escapeHtml(d.nome || '-')}</td>
              <td>${escapeHtml(d.categoria || '-')}</td>
              <td>${d.quantidade || 0}</td>
              <td>${formatCurrency(d.preco_aquisicao || 0)}</td>
              <td>${formatCurrency(d.preco_venda || 0)}</td>
            </tr>
          `).join('')}
          ${data.length > 5 ? `<tr><td colspan="5" style="text-align:center;color:var(--text-muted)">... e mais ${data.length - 5} registros</td></tr>` : ''}
        </tbody>
      </table>
    </div>
    
    <div style="display:flex;gap:12px">
      <button class="btn btn-primary" onclick="confirmarImportacao()">${Icons.check} Importar ${data.length} Produtos</button>
      <button class="btn btn-outline" onclick="cancelarImportacao()">Cancelar</button>
    </div>
    
    <div id="importDataStore" style="display:none" data-import='${JSON.stringify(data).replace(/'/g, "&#39;")}'></div>
  `;
}

function confirmarImportacao() {
  const store = document.getElementById('importDataStore');
  if (!store) return;
  
  try {
    const data = JSON.parse(store.dataset.import);
    let count = 0;
    
    data.forEach(item => {
      if (!item.nome) return;
      
      const precoAquisicao = parseFloat(item.preco_aquisicao || item.precoAquisicao || 0);
      const precoVenda = parseFloat(item.preco_venda || item.precoVenda || 0);
      const quantidade = parseInt(item.quantidade) || 0;
      
      const percentual = precoAquisicao > 0 && precoVenda > precoAquisicao 
        ? (((precoVenda - precoAquisicao) / precoAquisicao) * 100).toFixed(1)
        : 30;
      
      const produto = {
        id: generateId(),
        codigo: item.codigo || gerarCodigoProdutoPreview(item.nome, item.categoria || 'GER'),
        nome: item.nome,
        categoria: item.categoria || AppState.categorias[0]?.id || 'cat-7',
        quantidade: quantidade || 1,
        preco_aquisicao: precoAquisicao,
        precoAquisicao: precoAquisicao,
        percentual_lucro: parseFloat(percentual),
        percentualLucro: parseFloat(percentual),
        preco_venda: precoVenda || calcularPrecoVenda(precoAquisicao, 30),
        precoVenda: precoVenda || calcularPrecoVenda(precoAquisicao, 30),
        local: 'armazem',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      AppState.produtos.push(produto);
      count++;
    });
    
    AppState.save('produtos');
    
    document.getElementById('importPreview').innerHTML = `
      <div class="badge badge-success" style="padding:12px 16px">${count} produtos importados com sucesso!</div>
    `;
    
    showToast(`${count} produtos importados!`, 'success');
    refreshCurrentPage();
  } catch (err) {
    showToast('Erro ao importar: ' + err.message, 'error');
  }
}

function cancelarImportacao() {
  document.getElementById('importPreview').innerHTML = '';
}

// Generic export function
function exportData(data, filename, format) {
  if (!data || data.length === 0) {
    showToast('Nenhum dado para exportar!', 'warning');
    return;
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  const fullname = `${filename}-${timestamp}`;
  
  switch (format) {
    case 'json': {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `${fullname}.json`);
      break;
    }
    case 'csv': {
      const headers = Object.keys(data[0]);
      const csv = [headers.join(','), ...data.map(row => headers.map(h => {
        const val = row[h] || '';
        return typeof val === 'string' && (val.includes(',') || val.includes('"')) ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(','))].join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      downloadBlob(blob, `${fullname}.csv`);
      break;
    }
    case 'xlsx':
    case 'xls': {
      // Export as CSV with .xlsx extension - will open in Excel
      const headers = Object.keys(data[0]);
      const csv = [headers.join('\t'), ...data.map(row => headers.map(h => row[h] || '').join('\t'))].join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'application/vnd.ms-excel' });
      downloadBlob(blob, `${fullname}.xls`);
      break;
    }
    default: {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      downloadBlob(blob, `${fullname}.json`);
    }
  }
  
  showToast(`Exportado: ${fullname}.${format}`, 'success');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================================
// EMPTY STATE HELPER
// ============================================================

function renderEmptyState(title, description) {
  return `
    <div class="empty-state">
      ${Icons.package}
      <h3>${escapeHtml(title)}</h3>
      ${description ? `<p>${escapeHtml(description)}</p>` : ''}
    </div>
  `;
}
