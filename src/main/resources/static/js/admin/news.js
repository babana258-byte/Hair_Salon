// ── 工具列自訂下拉 ──
function toggleCategoryDropdown() {
  document.getElementById('newsStatusDropdown').classList.remove('open');
  document.getElementById('categoryDropdown').classList.toggle('open');
}

function toggleNewsStatusDropdown() {
  document.getElementById('categoryDropdown').classList.remove('open');
  document.getElementById('newsStatusDropdown').classList.toggle('open');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('#categoryDropdown')) document.getElementById('categoryDropdown').classList.remove('open');
  if (!e.target.closest('#newsStatusDropdown')) document.getElementById('newsStatusDropdown').classList.remove('open');
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

// ── Modal 行事曆 ──
let newsCalYear = new Date().getFullYear();
let newsCalMonth = new Date().getMonth();
let newsCalSelected = '';

function toggleNewsModalCalendar() {
  const cal = document.getElementById('newsModalCalendar');
  if (cal.classList.contains('open')) {
    cal.classList.remove('open');
  } else {
    renderNewsModalCalendar();
    cal.classList.add('open');
  }
}

function renderNewsModalCalendar() {
  const today = new Date();
  const firstDay = new Date(newsCalYear, newsCalMonth, 1).getDay();
  const daysInMonth = new Date(newsCalYear, newsCalMonth + 1, 0).getDate();
  const daysInPrev = new Date(newsCalYear, newsCalMonth, 0).getDate();

  document.getElementById('newsCalMonthLabel').textContent =
    `${newsCalYear}年 ${String(newsCalMonth + 1).padStart(2, '0')}月`;

  let html = '';
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<button type="button" class="cal-day other-month" disabled>${daysInPrev - i}</button>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${newsCalYear}-${String(newsCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === newsCalYear && today.getMonth() === newsCalMonth && today.getDate() === d;
    const isSelected = newsCalSelected === dateStr;
    html += `<button type="button" class="cal-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}" onclick="selectNewsModalCalDate('${dateStr}', ${d})">${d}</button>`;
  }
  const total = firstDay + daysInMonth;
  const nextDays = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= nextDays; d++) {
    html += `<button type="button" class="cal-day other-month" disabled>${d}</button>`;
  }
  document.getElementById('newsCalDays').innerHTML = html;
}

function changeNewsModalCalMonth(dir) {
  newsCalMonth += dir;
  if (newsCalMonth > 11) { newsCalMonth = 0; newsCalYear++; }
  if (newsCalMonth < 0) { newsCalMonth = 11; newsCalYear--; }
  renderNewsModalCalendar();
}

function selectNewsModalCalDate(dateStr, d) {
  newsCalSelected = dateStr;
  const [y, m] = dateStr.split('-');
  document.getElementById('fDateLabel').textContent = `${y}/${m}/${String(d).padStart(2, '0')}`;
  document.getElementById('fDate').value = dateStr;
  document.getElementById('newsModalCalendar').classList.remove('open');
}

function selectNewsModalToday() {
  const today = new Date();
  newsCalYear = today.getFullYear();
  newsCalMonth = today.getMonth();
  const d = today.getDate();
  const dateStr = `${newsCalYear}-${String(newsCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  selectNewsModalCalDate(dateStr, d);
}

function clearNewsModalCalDate() {
  newsCalSelected = '';
  newsCalYear = new Date().getFullYear();
  newsCalMonth = new Date().getMonth();
  document.getElementById('fDateLabel').textContent = '選擇日期';
  document.getElementById('fDate').value = '';
  document.getElementById('newsModalCalendar').classList.remove('open');
}

document.addEventListener('click', function(e) {
  const wrapper = document.getElementById('newsCalendarWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('newsModalCalendar').classList.remove('open');
  }
});

// ── 假資料 ──
const newsList = [
  { id: 1, title: '沐序髮廊十二月優惠活動', category: '活動', content: '十二月限定！染燙髮服務全面九折優惠，即日起至12月31日止。歡迎提早預約，名額有限！', date: '2024-12-01', isPublished: true, coverImage: null, images: [] },
  { id: 2, title: '新年假期營業公告', category: '公告', content: '新年假期（1/1）本店休息一天，1/2起恢復正常營業。造成不便，敬請見諒。', date: '2024-12-25', isPublished: true, coverImage: null, images: [] },
  { id: 3, title: '春季新服務上市：頭皮深層養護', category: '新服務', content: '春季限定頭皮深層養護療程正式上市！使用日本進口頭皮精華，搭配專業按摩，讓頭皮煥然一新。', date: '2025-03-01', isPublished: false, coverImage: null, images: [] },
  { id: 4, title: 'Paul Mitchell 新品到貨', category: '商品', content: 'Paul Mitchell 最新款護髮油正式到貨，全台限量供應，歡迎洽詢！', date: '2025-04-10', isPublished: true, coverImage: null, images: [] },
];

let filtered = [...newsList];
let editingId = null;

// ── 渲染列表 ──
const _imgPlaceholderSvg = `<div style="width:48px;height:48px;background:var(--blush-light,#f5ede8);border-radius:10px;display:flex;align-items:center;justify-content:center;margin:0 auto;"><svg width="20" height="20" fill="none" stroke="var(--neutral,#b5a8a0)" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75H3a.75.75 0 00-.75.75v15c0 .414.336.75.75.75z"/></svg></div>`;

function renderTable() {
  const tbody = document.getElementById('newsTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--neutral);padding:2rem;font-style:italic;">查無消息資料</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(n => `
    <tr>
      <td style="text-align:center;vertical-align:middle;">
        ${n.coverImage
          ? `<img src="${n.coverImage}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;">`
          : _imgPlaceholderSvg}
      </td>
      <td>
        <div style="font-size:0.85rem;color:var(--text-dark);font-weight:500;">${n.title}</div>
        <div style="font-size:0.75rem;color:var(--neutral);margin-top:0.2rem;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${n.content}</div>
        ${n.images && n.images.length > 0 ? `<div style="font-size:0.7rem;color:var(--brandy-rose);margin-top:0.2rem;">附圖 ${n.images.length} 張</div>` : ''}
      </td>
      <td><span class="badge badge-pending">${n.category}</span></td>
      <td style="font-size:0.82rem;">${n.date}</td>
      <td>
        <span class="badge ${n.isPublished ? 'badge-confirmed' : 'badge-inactive'}">
          ${n.isPublished ? '已發布' : '草稿'}
        </span>
      </td>
      <td style="text-align:center;">
        <div style="display:inline-flex;gap:0.3rem;">
          <button class="btn-icon" title="編輯" onclick="openEdit(${n.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
          </button>
          <button class="btn-icon" title="${n.isPublished ? '取消發布' : '發布'}" onclick="togglePublish(${n.id})">
            ${n.isPublished
              ? `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>`
              : `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
            }
          </button>
          <button class="btn-icon danger" title="刪除" onclick="deleteNews(${n.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── 篩選 ──
document.getElementById('searchInput').addEventListener('input', applyFilter);

function applyFilter() {
  const keyword = document.getElementById('searchInput').value.trim();
  const category = document.getElementById('categoryFilter').value;
  const status = document.getElementById('statusFilter').value;

  filtered = newsList.filter(n => {
    const matchKeyword = !keyword || n.title.includes(keyword) || n.content.includes(keyword);
    const matchCategory = !category || n.category === category;
    const matchStatus = status === '' ? true : status === 'published' ? n.isPublished : !n.isPublished;
    return matchKeyword && matchCategory && matchStatus;
  });

  renderTable();
}

// ── 封面圖片 ──
function previewCoverImage(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    document.getElementById('coverPreview').src = ev.target.result;
    document.getElementById('coverPreview').style.display = 'block';
    document.getElementById('coverPlaceholder').style.display = 'none';
    document.getElementById('coverRemoveBtn').style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

function removeCoverImage(e) {
  e.stopPropagation();
  document.getElementById('fCoverImage').value = '';
  document.getElementById('coverPreview').src = '';
  document.getElementById('coverPreview').style.display = 'none';
  document.getElementById('coverPlaceholder').style.display = 'flex';
  document.getElementById('coverRemoveBtn').style.display = 'none';
}

// ── 活動圖片 ──
const MAX_GALLERY = 6;
let galleryImages = [];

function addGallerySlot() {
  if (galleryImages.length >= MAX_GALLERY) return;
  document.getElementById('fGalleryInput').click();
}

function handleGalleryUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    galleryImages.push(ev.target.result);
    renderGalleryGrid();
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

function removeGalleryImage(idx) {
  galleryImages.splice(idx, 1);
  renderGalleryGrid();
}

function renderGalleryGrid() {
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML = galleryImages.map((src, i) => `
    <div style="position:relative;width:88px;height:110px;border-radius:10px;overflow:hidden;flex-shrink:0;background:#f5ede8;">
      <img src="${src}" style="width:100%;height:100%;object-fit:cover;">
      <button type="button" class="img-remove-btn" onclick="removeGalleryImage(${i})">×</button>
    </div>
  `).join('');
  const addBtn = document.getElementById('addGalleryBtn');
  if (addBtn) addBtn.style.display = galleryImages.length >= MAX_GALLERY ? 'none' : 'inline-flex';
}

function resetNewsImages(coverUrl, images) {
  // 封面
  const coverSrc = coverUrl || '';
  document.getElementById('fCoverImage').value = '';
  document.getElementById('coverPreview').src = coverSrc;
  document.getElementById('coverPreview').style.display = coverSrc ? 'block' : 'none';
  document.getElementById('coverPlaceholder').style.display = coverSrc ? 'none' : 'flex';
  document.getElementById('coverRemoveBtn').style.display = coverSrc ? 'flex' : 'none';
  // 活動圖片
  galleryImages = images ? [...images] : [];
  renderGalleryGrid();
}

// ── 新增消息 ──
function openAdd() {
  editingId = null;
  document.getElementById('modalTitle').textContent = '新增消息';
  document.getElementById('newsForm').reset();
  const today = new Date();
  newsCalYear = today.getFullYear();
  newsCalMonth = today.getMonth();
  newsCalSelected = today.toISOString().split('T')[0];
  const [y, m, d] = newsCalSelected.split('-');
  document.getElementById('fDateLabel').textContent = `${y}/${m}/${d}`;
  document.getElementById('fDate').value = newsCalSelected;
  setModalDropdown('fCategoryDropdown', '活動');
  setModalDropdown('fIsPublishedDropdown', 'false');
  document.getElementById('charCount').textContent = '0';
  resetNewsImages(null, []);
  document.getElementById('modalOverlay').classList.add('show');
}

// ── 編輯消息 ──
function openEdit(id) {
  const n = newsList.find(n => n.id === id);
  if (!n) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = '編輯消息';
  document.getElementById('fTitle').value = n.title;
  setModalDropdown('fCategoryDropdown', n.category);
  newsCalSelected = n.date;
  const [y, m, d] = n.date.split('-');
  newsCalYear = parseInt(y);
  newsCalMonth = parseInt(m) - 1;
  document.getElementById('fDateLabel').textContent = `${y}/${m}/${d}`;
  document.getElementById('fDate').value = n.date;
  document.getElementById('fContent').value = n.content;
  setModalDropdown('fIsPublishedDropdown', String(n.isPublished));
  document.getElementById('charCount').textContent = n.content.length;
  resetNewsImages(n.coverImage, n.images);
  document.getElementById('modalOverlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

// ── 字數統計 ──
document.getElementById('fContent').addEventListener('input', function () {
  document.getElementById('charCount').textContent = this.value.length;
});

// ── 儲存消息 ──
document.getElementById('newsForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const coverSrc = document.getElementById('coverPreview').src;
  const data = {
    title: document.getElementById('fTitle').value,
    category: document.getElementById('fCategory').value,
    date: document.getElementById('fDate').value,
    content: document.getElementById('fContent').value,
    isPublished: document.getElementById('fIsPublished').value === 'true',
    coverImage: coverSrc && coverSrc !== window.location.href ? coverSrc : null,
    images: [...galleryImages],
  };

  if (editingId) {
    // TODO: PUT /api/news/{id}
    const idx = newsList.findIndex(n => n.id === editingId);
    newsList[idx] = { ...newsList[idx], ...data };
    showToast('消息已更新');
  } else {
    // TODO: POST /api/news
    const newId = Math.max(...newsList.map(n => n.id)) + 1;
    newsList.unshift({ id: newId, ...data });
    showToast('消息已新增');
  }

  closeModal();
  applyFilter();
});

// ── 切換發布狀態 ──
function togglePublish(id) {
  const n = newsList.find(n => n.id === id);
  if (!n) return;
  n.isPublished = !n.isPublished;
  // TODO: PUT /api/news/{id}
  applyFilter();
  showToast(`已${n.isPublished ? '發布' : '取消發布'}「${n.title}」`);
}

// ── 刪除消息 ──
let _pendingDeleteId = null;

function deleteNews(id) {
  const n = newsList.find(n => n.id === id);
  if (!n) return;
  _pendingDeleteId = id;
  document.getElementById('deleteConfirmTitle').textContent = `確定要刪除「${n.title}」？`;
  document.getElementById('deleteConfirmOverlay').classList.add('show');
}

function confirmDelete() {
  const n = newsList.find(n => n.id === _pendingDeleteId);
  if (n) {
    newsList.splice(newsList.findIndex(n => n.id === _pendingDeleteId), 1);
    applyFilter();
    showToast('消息已刪除');
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
  document.querySelectorAll('#categoryList .custom-select-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.getElementById('categoryLabel').textContent = this.textContent;
      document.querySelectorAll('#categoryList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('categoryDropdown').classList.remove('open');
      document.getElementById('categoryFilter').value = this.dataset.value;
      applyFilter();
    });
  });

  document.querySelectorAll('#newsStatusList .custom-select-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.getElementById('newsStatusLabel').textContent = this.textContent;
      document.querySelectorAll('#newsStatusList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('newsStatusDropdown').classList.remove('open');
      document.getElementById('statusFilter').value = this.dataset.value;
      applyFilter();
    });
  });

  renderTable();
});
