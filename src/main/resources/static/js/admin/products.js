// ── 工具列自訂下拉 ──
function toggleProdTypeDropdown() {
  document.getElementById('prodStatusDropdown').classList.remove('open');
  document.getElementById('prodTypeDropdown').classList.toggle('open');
}

function toggleProdStatusDropdown() {
  document.getElementById('prodTypeDropdown').classList.remove('open');
  document.getElementById('prodStatusDropdown').classList.toggle('open');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('#prodTypeDropdown')) document.getElementById('prodTypeDropdown').classList.remove('open');
  if (!e.target.closest('#prodStatusDropdown')) document.getElementById('prodStatusDropdown').classList.remove('open');
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
const productList = [
  { id: 1, name: '純淨摩洛哥堅果修護油', brand: 'Paul Mitchell', type: '護髮', price: 1480, stock: 8, isActive: true, description: '深層修護，適合受損髮質' },
  { id: 2, name: '絲滑修復洗髮露', brand: 'Lebel', type: '護髮', price: 980, stock: 12, isActive: true, description: '溫和潔淨，適合日常使用' },
  { id: 3, name: '專業負離子吹風機', brand: 'Panasonic', type: '造型品', price: 5800, stock: 3, isActive: true, description: '專業沙龍級吹風機' },
  { id: 4, name: '水潤絲絨髮膜', brand: 'Lebel', type: '護髮', price: 1280, stock: 5, isActive: true, description: '深層滋潤，一週使用一次' },
  { id: 5, name: '植萃頭皮養護精華', brand: 'Paul Mitchell', type: '護髮', price: 1680, stock: 0, isActive: false, description: '改善頭皮環境，促進毛囊健康' },
  { id: 6, name: '塑型海鹽噴霧', brand: 'Paul Mitchell', type: '造型品', price: 880, stock: 15, isActive: true, description: '打造自然蓬鬆感' },
];

let filtered = [...productList];
let editingId = null;

// ── 渲染列表 ──
function renderTable() {
  const tbody = document.getElementById('productTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--neutral);padding:2rem;font-style:italic;">查無商品資料</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(p => `
    <tr style="${!p.isActive ? 'opacity:0.6;' : ''}">
      <td style="text-align:center;vertical-align:middle;">
        <div style="width:48px;height:48px;background:var(--blush-light,#f5ede8);border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto;">
          <svg width="22" height="22" fill="none" stroke="var(--neutral,#b5a8a0)" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75H3a.75.75 0 00-.75.75v15c0 .414.336.75.75.75z"/></svg>
        </div>
      </td>
      <td>
        <div style="font-size:0.85rem;color:var(--text-dark);">${p.name}</div>
        <div style="font-size:0.72rem;color:var(--neutral);">${p.brand}</div>
        <div style="font-size:0.72rem;color:var(--neutral);margin-top:0.2rem;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.description}</div>
      </td>
      <td><span class="badge badge-pending">${p.type}</span></td>
      <td style="font-size:0.88rem;color:var(--brandy-rose);font-weight:500;">NT$ ${p.price.toLocaleString()}</td>
      <td>
        <span style="font-size:0.95rem;font-weight:500;color:${p.stock === 0 ? '#c0705a' : p.stock <= 3 ? '#c0705a' : 'var(--text-dark)'};">${p.stock}</span>
        ${p.stock === 0 ? '<div style="margin-top:0.2rem;"><span class="badge badge-warning">缺貨</span></div>' : ''}
        ${p.stock > 0 && p.stock <= 3 ? '<div style="margin-top:0.2rem;"><span class="badge badge-warning">庫存不足</span></div>' : ''}
      </td>
      <td>
        <span class="badge ${p.isActive ? 'badge-confirmed' : 'badge-inactive'}">
          ${p.isActive ? '上架中' : '已下架'}
        </span>
      </td>
      <td>
        <div style="display:flex;gap:0.3rem;justify-content:center;">
          <button class="btn-icon" title="編輯" onclick="openEdit(${p.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
          </button>
          <button class="btn-icon ${p.isActive ? 'danger' : ''}" title="${p.isActive ? '下架' : '上架'}" onclick="toggleProduct(${p.id})">
            ${p.isActive
              ? `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>`
              : `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
            }
          </button>
          <button class="btn-icon danger" title="刪除" onclick="deleteProduct(${p.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  updateStats();
}

// ── 統計 ──
function updateStats() {
  const active = productList.filter(p => p.isActive).length;
  const outOfStock = productList.filter(p => p.stock === 0).length;
  const lowStock = productList.filter(p => p.stock > 0 && p.stock <= 3).length;
  document.getElementById('statActive').textContent = active;
  document.getElementById('statOutOfStock').textContent = outOfStock;
  document.getElementById('statLowStock').textContent = lowStock;
  document.getElementById('statTotal').textContent = productList.length;
}

// ── 篩選 ──
document.getElementById('searchInput').addEventListener('input', applyFilter);

function applyFilter() {
  const keyword = document.getElementById('searchInput').value.trim();
  const type = document.getElementById('typeFilter').value;
  const status = document.getElementById('statusFilter').value;

  filtered = productList.filter(p => {
    const matchKeyword = !keyword || p.name.includes(keyword) || p.brand.includes(keyword);
    const matchType = !type || p.type === type;
    const matchStatus = status === '' ? true : status === 'active' ? p.isActive : !p.isActive;
    return matchKeyword && matchType && matchStatus;
  });

  renderTable();
}

// ── 圖片上傳 ──
function previewImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    document.getElementById('imgPreview').src = ev.target.result;
    document.getElementById('imgPreview').style.display = 'block';
    document.getElementById('imgPlaceholder').style.display = 'none';
    document.getElementById('imgRemoveBtn').style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

function removeImage(e) {
  e.stopPropagation();
  document.getElementById('fImage').value = '';
  document.getElementById('imgPreview').src = '';
  document.getElementById('imgPreview').style.display = 'none';
  document.getElementById('imgPlaceholder').style.display = 'flex';
  document.getElementById('imgRemoveBtn').style.display = 'none';
}

function resetImageField(imageUrl) {
  if (imageUrl) {
    document.getElementById('imgPreview').src = imageUrl;
    document.getElementById('imgPreview').style.display = 'block';
    document.getElementById('imgPlaceholder').style.display = 'none';
    document.getElementById('imgRemoveBtn').style.display = 'flex';
  } else {
    document.getElementById('fImage').value = '';
    document.getElementById('imgPreview').src = '';
    document.getElementById('imgPreview').style.display = 'none';
    document.getElementById('imgPlaceholder').style.display = 'flex';
    document.getElementById('imgRemoveBtn').style.display = 'none';
  }
}

// ── 新增商品 ──
function openAdd() {
  editingId = null;
  document.getElementById('modalTitle').textContent = '新增商品';
  document.getElementById('productForm').reset();
  setModalDropdown('fTypeDropdown', '護髮');
  setModalDropdown('fIsActiveDropdown', 'true');
  resetImageField(null);
  document.getElementById('modalOverlay').classList.add('show');
}

// ── 編輯商品 ──
function openEdit(id) {
  const p = productList.find(p => p.id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = '編輯商品';
  document.getElementById('fName').value = p.name;
  document.getElementById('fBrand').value = p.brand;
  setModalDropdown('fTypeDropdown', p.type);
  document.getElementById('fPrice').value = p.price;
  document.getElementById('fStock').value = p.stock;
  document.getElementById('fDescription').value = p.description;
  setModalDropdown('fIsActiveDropdown', String(p.isActive));
  resetImageField(p.image || null);
  document.getElementById('modalOverlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

// ── 儲存商品 ──
document.getElementById('productForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('fName').value,
    brand: document.getElementById('fBrand').value,
    type: document.getElementById('fType').value,
    price: parseInt(document.getElementById('fPrice').value),
    stock: parseInt(document.getElementById('fStock').value),
    description: document.getElementById('fDescription').value,
    isActive: document.getElementById('fIsActive').value === 'true',
  };

  if (editingId) {
    // TODO: PUT /api/products/{id}
    const idx = productList.findIndex(p => p.id === editingId);
    productList[idx] = { ...productList[idx], ...data };
    showToast('商品已更新');
  } else {
    // TODO: POST /api/products
    const newId = Math.max(...productList.map(p => p.id)) + 1;
    productList.push({ id: newId, ...data });
    showToast('商品已新增');
  }

  closeModal();
  applyFilter();
});

// ── 切換上下架 ──
function toggleProduct(id) {
  const p = productList.find(p => p.id === id);
  if (!p) return;
  p.isActive = !p.isActive;
  // TODO: PUT /api/products/{id}
  applyFilter();
  showToast(`「${p.name}」已${p.isActive ? '上架' : '下架'}`);
}

// ── 刪除商品 ──
let _pendingDeleteId = null;

function deleteProduct(id) {
  const p = productList.find(p => p.id === id);
  if (!p) return;
  _pendingDeleteId = id;
  document.getElementById('deleteConfirmTitle').textContent = `確定要刪除「${p.name}」？`;
  document.getElementById('deleteConfirmOverlay').classList.add('show');
}

function confirmDelete() {
  const p = productList.find(p => p.id === _pendingDeleteId);
  if (p) {
    productList.splice(productList.findIndex(p => p.id === _pendingDeleteId), 1);
    applyFilter();
    showToast('商品已刪除');
  }
  closeDeleteConfirm();
}

function closeDeleteConfirm() {
  _pendingDeleteId = null;
  document.getElementById('deleteConfirmOverlay').classList.remove('show');
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
  document.querySelectorAll('#prodTypeList .custom-select-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.getElementById('prodTypeLabel').textContent = this.textContent;
      document.querySelectorAll('#prodTypeList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('prodTypeDropdown').classList.remove('open');
      document.getElementById('typeFilter').value = this.dataset.value;
      applyFilter();
    });
  });

  document.querySelectorAll('#prodStatusList .custom-select-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.getElementById('prodStatusLabel').textContent = this.textContent;
      document.querySelectorAll('#prodStatusList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('prodStatusDropdown').classList.remove('open');
      document.getElementById('statusFilter').value = this.dataset.value;
      applyFilter();
    });
  });

  renderTable();
});
