// ── 工具列自訂下拉 ──
function toggleTypeDropdown() {
  document.getElementById('stockDropdown').classList.remove('open');
  document.getElementById('typeDropdown').classList.toggle('open');
}

function toggleStockDropdown() {
  document.getElementById('typeDropdown').classList.remove('open');
  document.getElementById('stockDropdown').classList.toggle('open');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('#typeDropdown')) document.getElementById('typeDropdown').classList.remove('open');
  if (!e.target.closest('#stockDropdown')) document.getElementById('stockDropdown').classList.remove('open');
});

// ── Modal 自訂下拉 ──
function toggleModalDropdown(id) {
  document.querySelectorAll('.modal-select').forEach(function(d) {
    if (d.id !== id) d.classList.remove('open');
  });
  document.getElementById(id).classList.toggle('open');
}

function setModalDropdown(dropdownId, value) {
  const wrapper = document.getElementById(dropdownId);
  if (!wrapper) return;
  const inputId = wrapper.dataset.input;
  const labelId = wrapper.dataset.label;
  wrapper.querySelectorAll('.custom-select-option').forEach(function(o) { o.classList.remove('selected'); });
  const opt = wrapper.querySelector('.custom-select-option[data-value="' + value + '"]');
  if (opt) {
    document.getElementById(inputId).value = value;
    document.getElementById(labelId).textContent = opt.textContent.trim();
    opt.classList.add('selected');
  }
}

document.addEventListener('click', function(e) {
  const opt = e.target.closest('.modal-select .custom-select-option');
  if (!opt) return;
  const wrapper = opt.closest('.modal-select');
  document.getElementById(wrapper.dataset.input).value = opt.dataset.value;
  document.getElementById(wrapper.dataset.label).textContent = opt.textContent.trim();
  wrapper.querySelectorAll('.custom-select-option').forEach(function(o) { o.classList.remove('selected'); });
  opt.classList.add('selected');
  wrapper.classList.remove('open');
});

document.addEventListener('click', function(e) {
  if (!e.target.closest('.modal-select')) {
    document.querySelectorAll('.modal-select').forEach(function(d) { d.classList.remove('open'); });
  }
});

// ── 假資料 ──
const products = [
  { id: 1, brand: 'Paul Mitchell', name: '摩洛哥堅果修護油', type: '護髮', cost: 800, price: 1480, qty: 2, safetyStock: 5, lastChecked: '2025-05-01' },
  { id: 2, brand: 'Lebel', name: '絲滑修復洗髮露', type: '護髮', cost: 450, price: 980, qty: 8, safetyStock: 5, lastChecked: '2025-05-01' },
  { id: 3, brand: 'Paul Mitchell', name: '造型定型噴霧', type: '造型品', cost: 300, price: 680, qty: 12, safetyStock: 5, lastChecked: '2025-04-28' },
  { id: 4, brand: 'Wella', name: '染劑 #6N', type: '染劑', cost: 150, price: null, qty: 1, safetyStock: 10, lastChecked: '2025-05-01' },
  { id: 5, brand: 'Wella', name: '染劑 #8A', type: '染劑', cost: 150, price: null, qty: 15, safetyStock: 10, lastChecked: '2025-05-01' },
  { id: 6, brand: 'Lebel', name: '護髮素 500ml', type: '護髮', cost: 280, price: 680, qty: 3, safetyStock: 6, lastChecked: '2025-04-25' },
  { id: 7, brand: 'Paul Mitchell', name: '頭皮養護精華', type: '護髮', cost: 600, price: 1280, qty: 6, safetyStock: 3, lastChecked: '2025-05-02' },
];

const inventoryLogs = [
  { id: 1, productId: 1, type: '進貨', qty: 5, date: '2025-04-15', note: '向供應商訂購' },
  { id: 2, productId: 1, type: '使用', qty: -3, date: '2025-04-20', note: '護髮服務耗材' },
  { id: 3, productId: 4, type: '進貨', qty: 10, date: '2025-04-10', note: '' },
  { id: 4, productId: 4, type: '使用', qty: -9, date: '2025-04-30', note: '染髮服務耗材' },
];

let filtered = [...products];
let editingId = null;
let adjustingId = null;
let logsProductId = null;

// ── 渲染列表 ──
function renderTable() {
  const tbody = document.getElementById('inventoryTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--neutral);padding:2rem;font-style:italic;">查無庫存資料</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const isLow = p.qty <= p.safetyStock;
    return `
      <tr>
        <td>
          <div style="font-size:0.85rem;color:var(--text-dark);">${p.name}</div>
          <div style="font-size:0.72rem;color:var(--neutral);">${p.brand}</div>
        </td>
        <td><span class="badge badge-pending">${p.type}</span></td>
        <td style="text-align:center;">
          <span style="font-size:0.95rem;font-weight:500;color:${isLow ? '#c0705a' : 'var(--text-dark)'};">${p.qty}</span>
          ${isLow ? '<div style="margin-top:0.2rem;"><span class="badge badge-warning">庫存不足</span></div>' : ''}
        </td>
        <td style="font-size:0.82rem;color:var(--neutral);">${p.safetyStock}</td>
        <td style="font-size:0.82rem;">${p.cost ? `NT$ ${p.cost}` : '—'}</td>
        <td style="font-size:0.82rem;">${p.price ? `NT$ ${p.price}` : '—'}</td>
        <td style="font-size:0.75rem;color:var(--neutral);">${p.lastChecked}</td>
        <td>
          <div style="display:flex;gap:0.3rem;justify-content:center;">
            <button class="btn-icon" title="調整庫存" onclick="openAdjust(${p.id})">
              <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </button>
            <button class="btn-icon" title="異動記錄" onclick="openLogs(${p.id})">
              <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"/></svg>
            </button>
            <button class="btn-icon" title="編輯" onclick="openEdit(${p.id})">
              <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  updateStats();
}

// ── 統計 ──
function updateStats() {
  const lowCount = products.filter(p => p.qty <= p.safetyStock).length;
  const totalItems = products.reduce((sum, p) => sum + p.qty, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.cost || 0) * p.qty, 0);

  document.getElementById('statLow').textContent = lowCount;
  document.getElementById('statTotal').textContent = totalItems;
  document.getElementById('statValue').textContent = `NT$ ${totalValue.toLocaleString()}`;
  document.getElementById('statProducts').textContent = products.length;
}

// ── 篩選 ──
document.getElementById('searchInput').addEventListener('input', applyFilter);

function applyFilter() {
  const keyword = document.getElementById('searchInput').value.trim();
  const type = document.getElementById('typeFilter').value;
  const stock = document.getElementById('stockFilter').value;

  filtered = products.filter(p => {
    const matchKeyword = !keyword || p.name.includes(keyword) || p.brand.includes(keyword);
    const matchType = !type || p.type === type;
    const matchStock = stock === '' ? true : stock === 'low' ? p.qty <= p.safetyStock : p.qty > p.safetyStock;
    return matchKeyword && matchType && matchStock;
  });

  renderTable();
}

// ── 新增產品 ──
function openAdd() {
  editingId = null;
  document.getElementById('productModalTitle').textContent = '新增產品';
  document.getElementById('productForm').reset();
  setModalDropdown('fTypeDropdown', '染劑');
  document.getElementById('productModalOverlay').classList.add('show');
}

// ── 編輯產品 ──
function openEdit(id) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('productModalTitle').textContent = '編輯產品';
  document.getElementById('fName').value = p.name;
  document.getElementById('fBrand').value = p.brand;
  setModalDropdown('fTypeDropdown', p.type);
  document.getElementById('fCost').value = p.cost || '';
  document.getElementById('fPrice').value = p.price || '';
  document.getElementById('fSafetyStock').value = p.safetyStock;
  document.getElementById('productModalOverlay').classList.add('show');
}

function closeProductModal() {
  document.getElementById('productModalOverlay').classList.remove('show');
}

document.getElementById('productForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const data = {
    name: document.getElementById('fName').value,
    brand: document.getElementById('fBrand').value,
    type: document.getElementById('fType').value,
    cost: parseInt(document.getElementById('fCost').value) || 0,
    price: parseInt(document.getElementById('fPrice').value) || null,
    safetyStock: parseInt(document.getElementById('fSafetyStock').value),
  };

  if (editingId) {
    const idx = products.findIndex(p => p.id === editingId);
    products[idx] = { ...products[idx], ...data };
    showToast('產品已更新');
  } else {
    const newId = Math.max(...products.map(p => p.id)) + 1;
    products.push({ id: newId, qty: 0, lastChecked: new Date().toISOString().split('T')[0], ...data });
    showToast('產品已新增');
  }

  closeProductModal();
  applyFilter();
});

// ── 調整庫存 ──
function openAdjust(id) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  adjustingId = id;
  document.getElementById('adjustProductName').textContent = p.name;
  document.getElementById('adjustCurrentQty').textContent = p.qty;
  document.getElementById('adjustForm').reset();
  setModalDropdown('aTypeDropdown', '進貨');
  document.getElementById('adjustModalOverlay').classList.add('show');
}

function closeAdjustModal() {
  document.getElementById('adjustModalOverlay').classList.remove('show');
}

document.getElementById('adjustForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const type = document.getElementById('aType').value;
  const qty = parseInt(document.getElementById('aQty').value);
  const note = document.getElementById('aNote').value;
  const change = type === '使用' || type === '盤點調整（減）' ? -qty : qty;

  const idx = products.findIndex(p => p.id === adjustingId);
  products[idx].qty = Math.max(0, products[idx].qty + change);
  products[idx].lastChecked = new Date().toISOString().split('T')[0];

  inventoryLogs.push({
    id: inventoryLogs.length + 1,
    productId: adjustingId,
    type: type.includes('減') ? '盤點調整' : type,
    qty: change,
    date: new Date().toISOString().split('T')[0],
    note: note,
  });

  closeAdjustModal();
  applyFilter();
  showToast('庫存已調整');
});

// ── 查看異動記錄 ──
function openLogs(id) {
  const p = products.find(p => p.id === id);
  logsProductId = id;
  document.getElementById('logsProductName').textContent = p.name;

  const logs = inventoryLogs.filter(l => l.productId === id);
  const container = document.getElementById('logsList');

  if (logs.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--neutral);font-style:italic;padding:1rem;">尚無異動記錄</p>';
  } else {
    container.innerHTML = logs.map(l => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0;border-bottom:1px solid var(--chalk-beige);font-size:0.82rem;">
        <div>
          <span class="badge ${l.qty > 0 ? 'badge-confirmed' : 'badge-warning'}" style="margin-right:0.4rem;">${l.type}</span>
          <span style="color:var(--neutral);">${l.date}</span>
          ${l.note ? `<div style="color:var(--neutral);font-size:0.75rem;margin-top:0.2rem;">${l.note}</div>` : ''}
        </div>
        <span style="font-weight:500;color:${l.qty > 0 ? 'var(--brown-dark)' : '#c0705a'};">${l.qty > 0 ? '+' : ''}${l.qty}</span>
      </div>
    `).reverse().join('');
  }

  document.getElementById('logsModalOverlay').classList.add('show');
}

function closeLogsModal() {
  document.getElementById('logsModalOverlay').classList.remove('show');
}

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── 初始化 ──
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('#typeList .custom-select-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.getElementById('typeLabel').textContent = this.textContent;
      document.querySelectorAll('#typeList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('typeDropdown').classList.remove('open');
      document.getElementById('typeFilter').value = this.dataset.value;
      applyFilter();
    });
  });

  document.querySelectorAll('#stockList .custom-select-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.getElementById('stockLabel').textContent = this.textContent;
      document.querySelectorAll('#stockList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('stockDropdown').classList.remove('open');
      document.getElementById('stockFilter').value = this.dataset.value;
      applyFilter();
    });
  });

  renderTable();
});
