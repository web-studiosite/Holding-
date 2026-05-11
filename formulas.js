/**
 * FINANCIAL FORMULAS & CALCULATIONS
 * Shop Administrator - ERP System
 * 
 * All financial calculations, profit formulas, and report generators
 * Separated from UI for easy maintenance and editing
 */

// ============================================================
// CORE PRICE & PROFIT CALCULATIONS
// ============================================================

/**
 * Calculate selling price from acquisition cost and profit percentage
 * @param {number} precoAquisicao - Acquisition price
 * @param {number} percentualLucro - Profit percentage (0-100 or 0-1)
 * @returns {number} Selling price
 */
function calcularPrecoVenda(precoAquisicao, percentualLucro) {
  const lucro = percentualLucro > 1 ? percentualLucro / 100 : percentualLucro;
  return precoAquisicao + (precoAquisicao * lucro);
}

/**
 * Calculate profit amount per unit
 * @param {number} precoAquisicao - Acquisition price
 * @param {number} precoVenda - Selling price
 * @returns {number} Profit per unit
 */
function calcularLucroUnidade(precoAquisicao, precoVenda) {
  return precoVenda - precoAquisicao;
}

/**
 * Calculate profit percentage from prices
 * @param {number} precoAquisicao - Acquisition price
 * @param {number} precoVenda - Selling price
 * @returns {number} Profit percentage (0-100)
 */
function calcularPercentualLucro(precoAquisicao, precoVenda) {
  if (precoAquisicao === 0) return 0;
  return ((precoVenda - precoAquisicao) / precoAquisicao) * 100;
}

/**
 * Calculate total profit for a quantity
 * @param {number} lucroUnidade - Profit per unit
 * @param {number} quantidade - Quantity sold
 * @returns {number} Total profit
 */
function calcularLucroTotal(lucroUnidade, quantidade) {
  return lucroUnidade * quantidade;
}

/**
 * Calculate total stock value
 * @param {number} quantidade - Quantity in stock
 * @param {number} preco - Price per unit
 * @returns {number} Total value
 */
function calcularValorEstoque(quantidade, preco) {
  return quantidade * preco;
}

// ============================================================
// STOCK & INVENTORY CALCULATIONS
// ============================================================

/**
 * Check if stock is low (below threshold)
 * @param {number} quantidadeAtual - Current stock
 * @param {number} quantidadeMinima - Minimum threshold
 * @returns {boolean} Is stock low
 */
function isEstoqueBaixo(quantidadeAtual, quantidadeMinima = 5) {
  return quantidadeAtual <= quantidadeMinima;
}

/**
 * Calculate stock status percentage
 * @param {number} quantidadeAtual - Current stock
 * @param {number} quantidadeMaxima - Maximum capacity
 * @returns {number} Percentage filled
 */
function calcularNivelEstoque(quantidadeAtual, quantidadeMaxima) {
  if (quantidadeMaxima === 0) return 0;
  return Math.min((quantidadeAtual / quantidadeMaxima) * 100, 100);
}

// ============================================================
// FUEL STATION CALCULATIONS
// ============================================================

/**
 * Calculate fuel profit per liter
 * @param {number} precoCompra - Purchase price per liter
 * @param {number} precoVenda - Selling price per liter
 * @returns {number} Profit per liter
 */
function calcularLucroCombustivel(precoCompra, precoVenda) {
  return precoVenda - precoCompra;
}

/**
 * Calculate daily fuel revenue
 * @param {number} litrosVendidos - Liters sold
 * @param {number} precoVenda - Selling price per liter
 * @returns {number} Daily revenue
 */
function calcularReceitaDiariaCombustivel(litrosVendidos, precoVenda) {
  return litrosVendidos * precoVenda;
}

/**
 * Calculate daily fuel profit
 * @param {number} litrosVendidos - Liters sold
 * @param {number} lucroPorLitro - Profit per liter
 * @returns {number} Daily profit
 */
function calcularLucroDiarioCombustivel(litrosVendidos, lucroPorLitro) {
  return litrosVendidos * lucroPorLitro;
}

// ============================================================
// CASH FLOW CALCULATIONS
// ============================================================

/**
 * Calculate cash flow for a period
 * @param {array} transactions - Array of transactions
 * @returns {object} Cash flow summary
 */
function calcularFluxoCaixa(transactions) {
  let entradas = 0;
  let saidas = 0;
  
  transactions.forEach(t => {
    if (t.tipo === 'entrada' || t.tipo === 'venda') {
      entradas += parseFloat(t.valor) || 0;
    } else if (t.tipo === 'saida' || t.tipo === 'despesa') {
      saidas += parseFloat(t.valor) || 0;
    }
  });
  
  return {
    entradas,
    saidas,
    saldo: entradas - saidas
  };
}

// ============================================================
// REPORT GENERATORS
// ============================================================

/**
 * Generate sales report
 * @param {array} vendas - Sales array
 * @param {string} periodo - Period: 'dia', 'semana', 'mes', 'trimestre'
 * @returns {object} Sales report
 */
function gerarRelatorioVendas(vendas, periodo = 'dia') {
  const now = new Date();
  let startDate;
  
  switch (periodo) {
    case 'dia':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'semana':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'mes':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'trimestre':
      startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
      break;
    default:
      startDate = new Date(0);
  }
  
  const vendasFiltradas = vendas.filter(v => {
    const vDate = new Date(v.created_at || v.data);
    return vDate >= startDate;
  });
  
  const totalVendido = vendasFiltradas.reduce((sum, v) => sum + (parseFloat(v.total) || 0), 0);
  const totalLucro = vendasFiltradas.reduce((sum, v) => sum + (parseFloat(v.lucro) || 0), 0);
  
  // Group by category
  const porCategoria = {};
  vendasFiltradas.forEach(v => {
    const cat = v.categoria || 'Outros';
    if (!porCategoria[cat]) porCategoria[cat] = { quantidade: 0, total: 0, lucro: 0 };
    porCategoria[cat].quantidade += parseInt(v.quantidade) || 0;
    porCategoria[cat].total += parseFloat(v.total) || 0;
    porCategoria[cat].lucro += parseFloat(v.lucro) || 0;
  });
  
  // Top products
  const produtosMap = {};
  vendasFiltradas.forEach(v => {
    const nome = v.produto_nome || v.produto || 'Desconhecido';
    if (!produtosMap[nome]) produtosMap[nome] = { nome, quantidade: 0, total: 0 };
    produtosMap[nome].quantidade += parseInt(v.quantidade) || 0;
    produtosMap[nome].total += parseFloat(v.total) || 0;
  });
  
  const topProdutos = Object.values(produtosMap)
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10);
  
  return {
    periodo,
    totalVendas: vendasFiltradas.length,
    totalVendido,
    totalLucro,
    margemLucro: totalVendido > 0 ? (totalLucro / totalVendido) * 100 : 0,
    porCategoria,
    topProdutos,
    vendas: vendasFiltradas
  };
}

/**
 * Generate inventory report
 * @param {array} produtos - Products array
 * @returns {object} Inventory report
 */
function gerarRelatorioInventario(produtos) {
  const armazem = produtos.filter(p => p.local === 'armazem' || !p.local);
  const loja = produtos.filter(p => p.local === 'loja');
  
  const totalArmazem = armazem.reduce((sum, p) => sum + (parseFloat(p.quantidade) || 0), 0);
  const valorArmazem = armazem.reduce((sum, p) => {
    const preco = parseFloat(p.preco_aquisicao || p.precoAquisicao || 0);
    const qtd = parseFloat(p.quantidade || 0);
    return sum + (preco * qtd);
  }, 0);
  
  const totalLoja = loja.reduce((sum, p) => sum + (parseFloat(p.quantidade) || 0), 0);
  const valorLoja = loja.reduce((sum, p) => {
    const preco = parseFloat(p.preco_venda || p.precoVenda || 0);
    const qtd = parseFloat(p.quantidade || 0);
    return sum + (preco * qtd);
  }, 0);
  
  const estoqueBaixo = produtos.filter(p => isEstoqueBaixo(parseFloat(p.quantidade || 0), parseFloat(p.quantidade_minima || 5)));
  
  const lucroPotencial = produtos.reduce((sum, p) => {
    const aquisicao = parseFloat(p.preco_aquisicao || p.precoAquisicao || 0);
    const venda = parseFloat(p.preco_venda || p.precoVenda || 0);
    const qtd = parseFloat(p.quantidade || 0);
    return sum + ((venda - aquisicao) * qtd);
  }, 0);
  
  return {
    armazem: {
      quantidadeProdutos: armazem.length,
      totalUnidades: totalArmazem,
      valorTotal: valorArmazem
    },
    loja: {
      quantidadeProdutos: loja.length,
      totalUnidades: totalLoja,
      valorTotal: valorLoja
    },
    geral: {
      quantidadeTotalProdutos: produtos.length,
      quantidadeTotalUnidades: totalArmazem + totalLoja,
      valorTotal: valorArmazem + valorLoja,
      lucroPotencial,
      produtosEstoqueBaixo: estoqueBaixo.length,
      listaEstoqueBaixo: estoqueBaixo
    }
  };
}

/**
 * Generate fuel report
 * @param {array} combustiveis - Fuel records
 * @returns {object} Fuel report
 */
function gerarRelatorioCombustivel(combustiveis) {
  const hoje = new Date().toISOString().split('T')[0];
  
  const porTipo = {};
  let totalLitros = 0;
  let totalReceita = 0;
  let totalLucro = 0;
  
  combustiveis.forEach(c => {
    const tipo = c.tipo || 'Outro';
    if (!porTipo[tipo]) {
      porTipo[tipo] = { tipo, litros: 0, receita: 0, lucro: 0, transacoes: 0 };
    }
    
    const litros = parseFloat(c.litros) || 0;
    const receita = parseFloat(c.total_venda) || (litros * parseFloat(c.preco_venda || 0));
    const lucro = parseFloat(c.lucro) || (litros * (parseFloat(c.preco_venda || 0) - parseFloat(c.preco_compra || 0)));
    
    porTipo[tipo].litros += litros;
    porTipo[tipo].receita += receita;
    porTipo[tipo].lucro += lucro;
    porTipo[tipo].transacoes++;
    
    totalLitros += litros;
    totalReceita += receita;
    totalLucro += lucro;
  });
  
  return {
    totalLitros,
    totalReceita,
    totalLucro,
    margemMedia: totalReceita > 0 ? (totalLucro / totalReceita) * 100 : 0,
    porTipo: Object.values(porTipo),
    transacoesHoje: combustiveis.filter(c => (c.data || '').startsWith(hoje)).length
  };
}

// ============================================================
// DATA TRANSFORMATION HELPERS
// ============================================================

/**
 * Format number as currency (Kwanza/AOA)
 * @param {number} value - Value to format
 * @returns {string} Formatted currency
 */
function formatarMoeda(value) {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 2
  }).format(value || 0);
}

/**
 * Format number with thousands separator
 * @param {number} value - Value to format
 * @returns {string} Formatted number
 */
function formatarNumero(value) {
  return new Intl.NumberFormat('pt-AO').format(value || 0);
}

/**
 * Format date to Portuguese
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
function formatarData(date) {
  const d = new Date(date);
  return d.toLocaleDateString('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Generate product code automatically
 * @param {string} nome - Product name
 * @param {string} categoria - Category
 * @returns {string} Generated code
 */
function gerarCodigoProduto(nome, categoria) {
  const prefix = (categoria || 'PRD').substring(0, 3).toUpperCase();
  const namePart = (nome || 'XXX').substring(0, 3).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  const timestamp = Date.now().toString(36).substring(-4).toUpperCase();
  return `${prefix}-${namePart}-${random}${timestamp}`;
}

// ============================================================
// EXPORT ALL FUNCTIONS
// ============================================================

window.Formulas = {
  // Price & Profit
  calcularPrecoVenda,
  calcularLucroUnidade,
  calcularPercentualLucro,
  calcularLucroTotal,
  calcularValorEstoque,
  
  // Stock
  isEstoqueBaixo,
  calcularNivelEstoque,
  
  // Fuel
  calcularLucroCombustivel,
  calcularReceitaDiariaCombustivel,
  calcularLucroDiarioCombustivel,
  
  // Cash Flow
  calcularFluxoCaixa,
  
  // Reports
  gerarRelatorioVendas,
  gerarRelatorioInventario,
  gerarRelatorioCombustivel,
  
  // Formatters
  formatarMoeda,
  formatarNumero,
  formatarData,
  gerarCodigoProduto
};
