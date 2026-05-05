// ── 工具列下拉 ──
function toggleCategoryDropdown() {
  document.getElementById('svcStatusDropdown').classList.remove('open');
  document.getElementById('categoryDropdown').classList.toggle('open');
}

function toggleSvcStatusDropdown() {
  document.getElementById('categoryDropdown').classList.remove('open');
  document.getElementById('svcStatusDropdown').classList.toggle('open');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('#categoryDropdown')) document.getElementById('categoryDropdown').classList.remove('open');
  if (!e.target.closest('#svcStatusDropdown')) document.getElementById('svcStatusDropdown').classList.remove('open');
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
  wrapper.querySelectorAll('.custom-select-option').forEach(function(o) { o.classList.remove('selected'); });
  const opt = wrapper.querySelector('.custom-select-option[data-value="' + value + '"]');
  if (opt) {
    document.getElementById(wrapper.dataset.input).value = value;
    document.getElementById(wrapper.dataset.label).textContent = opt.textContent.trim();
    opt.classList.add('selected');
  }
}

function resetModalDropdown(dropdownId) {
  const wrapper = document.getElementById(dropdownId);
  wrapper.querySelectorAll('.custom-select-option').forEach(function(o) { o.classList.remove('selected'); });
  const first = wrapper.querySelector('.custom-select-option');
  if (first) {
    document.getElementById(wrapper.dataset.input).value = first.dataset.value;
    document.getElementById(wrapper.dataset.label).textContent = first.textContent.trim();
    first.classList.add('selected');
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
const services = [
  { id: 1, name: '基本剪髮', category: '剪髮', price: 300, duration: 30, isActive: true },
  { id: 2, name: '造型剪髮', category: '剪髮', price: 500, duration: 45, isActive: true },
  { id: 3, name: '單色染髮', category: '染髮', price: 1500, duration: 120, isActive: true },
  { id: 4, name: '線條染', category: '染髮', price: 2500, duration: 150, isActive: true },
  { id: 5, name: '離子燙', category: '燙髮', price: 2000, duration: 180, isActive: true },
  { id: 6, name: '數位燙', category: '燙髮', price: 2500, duration: 180, isActive: true },
  { id: 7, name: '縮毛矯正', category: '燙髮', price: 3500, duration: 200, isActive: true },
  { id: 8, name: '護髮療程', category: '護髮', price: 800, duration: 60, isActive: true },
  { id: 9, name: '頭皮養護', category: '護髮', price: 1200, duration: 60, isActive: true },
  { id: 10, name: '妝髮造型', category: '造型', price: 1500, duration: 90, isActive: false },
];

let filtered = [...services];
let editingId = null;

const categoryColors = {
  '剪髮': 'badge-confirmed',
  '染髮': 'badge-pending',
  '燙髮': 'badge-completed',
  '護髮': 'badge-active',
  '造型': 'badge-cancelled',
  '其他': 'badge-inactive',
};

// ── 渲染卡片 ──
function renderCards() {
  const container = document.getElementById('serviceGrid');
  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--neutral);padding:3rem;font-style:italic;">查無服務項目</div>`;
    return;
  }

  container.innerHTML = filtered.map(s => `
    <div class="service-card ${!s.isActive ? 'inactive' : ''}" onclick="openEdit(${s.id})" style="cursor:pointer;">
      <div class="service-card-header">
        <div style="display:flex;align-items:center;gap:0.4rem;">
          <span class="badge ${categoryColors[s.category] || 'badge-inactive'}">${s.category}</span>
          ${!s.isActive ? '<span class="badge badge-voided">已下架</span>' : ''}
        </div>
        <div style="display:flex;gap:0.3rem;">
          <button class="btn-icon" title="編輯" onclick="event.stopPropagation();openEdit(${s.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
          </button>
          <button class="btn-icon ${s.isActive ? 'danger' : ''}" title="${s.isActive ? '下架' : '上架'}" onclick="event.stopPropagation();toggleService(${s.id})">
            ${s.isActive
              ? `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>`
              : `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
            }
          </button>
        </div>
      </div>
      <div class="service-name">${s.name}</div>
      <div class="service-meta">
        <span class="service-price">NT$ ${s.price.toLocaleString()}</span>
        <span class="service-duration">${s.duration} 分鐘</span>
      </div>
    </div>
  `).join('');
}

// ── 篩選 ──
document.getElementById('searchInput').addEventListener('input', applyFilter);

function applyFilter() {
  const keyword = document.getElementById('searchInput').value.trim();
  const category = document.getElementById('categoryFilter').value;
  const status = document.getElementById('statusFilter').value;

  filtered = services.filter(s => {
    const matchKeyword = !keyword || s.name.includes(keyword);
    const matchCategory = !category || s.category === category;
    const matchStatus = status === '' ? true : status === 'active' ? s.isActive : !s.isActive;
    return matchKeyword && matchCategory && matchStatus;
  });

  renderCards();
  document.getElementById('serviceCount').textContent = `共 ${filtered.length} 項服務`;
}

// ── 新增服務 ──
function openAdd() {
  editingId = null;
  document.getElementById('modalTitle').textContent = '新增服務項目';
  document.getElementById('serviceForm').reset();
  resetModalDropdown('fCategoryDropdown');
  setModalDropdown('fIsActiveDropdown', 'true');
  document.getElementById('modalOverlay').classList.add('show');
}

// ── 編輯服務 ──
function openEdit(id) {
  const s = services.find(s => s.id === id);
  if (!s) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = '編輯服務項目';
  document.getElementById('fName').value = s.name;
  setModalDropdown('fCategoryDropdown', s.category);
  document.getElementById('fPrice').value = s.price;
  document.getElementById('fDuration').value = s.duration;
  setModalDropdown('fIsActiveDropdown', String(s.isActive));
  document.getElementById('modalOverlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

// ── 儲存服務 ──
document.getElementById('serviceForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('fName').value,
    category: document.getElementById('fCategory').value,
    price: parseInt(document.getElementById('fPrice').value),
    duration: parseInt(document.getElementById('fDuration').value),
    isActive: document.getElementById('fIsActive').value === 'true',
  };

  if (editingId) {
    // TODO: PUT /api/services/{id}
    const idx = services.findIndex(s => s.id === editingId);
    services[idx] = { ...services[idx], ...data };
    showToast('服務項目已更新');
  } else {
    // TODO: POST /api/services
    const newId = Math.max(...services.map(s => s.id)) + 1;
    services.push({ id: newId, ...data });
    showToast('服務項目已新增');
  }

  closeModal();
  applyFilter();
});

// ── 切換上下架 ──
function toggleService(id) {
  const s = services.find(s => s.id === id);
  if (!s) return;
  s.isActive = !s.isActive;
  // TODO: PUT /api/services/{id}
  applyFilter();
  showToast(`「${s.name}」已${s.isActive ? '上架' : '下架'}`);
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
  document.getElementById('statusFilter').value = 'active';

  document.querySelectorAll('#categoryList .custom-select-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.querySelectorAll('#categoryList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('categoryLabel').textContent = this.textContent;
      document.getElementById('categoryFilter').value = this.dataset.value;
      document.getElementById('categoryDropdown').classList.remove('open');
      applyFilter();
    });
  });

  document.querySelectorAll('#svcStatusList .custom-select-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.querySelectorAll('#svcStatusList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('svcStatusLabel').textContent = this.textContent;
      document.getElementById('statusFilter').value = this.dataset.value;
      document.getElementById('svcStatusDropdown').classList.remove('open');
      applyFilter();
    });
  });

  applyFilter();
});
