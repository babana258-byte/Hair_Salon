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

// ── 到職日行事曆 ──
let staffCalYear = new Date().getFullYear();
let staffCalMonth = new Date().getMonth();
let staffCalSelected = '';

function toggleStaffCalendar() {
  const cal = document.getElementById('staffCustomCalendar');
  if (cal.classList.contains('open')) {
    cal.classList.remove('open');
  } else {
    renderStaffCalendar();
    cal.classList.add('open');
  }
}

function renderStaffCalendar() {
  const today = new Date();
  const firstDay = new Date(staffCalYear, staffCalMonth, 1).getDay();
  const daysInMonth = new Date(staffCalYear, staffCalMonth + 1, 0).getDate();
  const daysInPrev = new Date(staffCalYear, staffCalMonth, 0).getDate();

  document.getElementById('staffCalMonthLabel').textContent =
    `${staffCalYear}年 ${String(staffCalMonth + 1).padStart(2, '0')}月`;

  let html = '';
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<button type="button" class="cal-day other-month" disabled>${daysInPrev - i}</button>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${staffCalYear}-${String(staffCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === staffCalYear && today.getMonth() === staffCalMonth && today.getDate() === d;
    const isSelected = staffCalSelected === dateStr;
    html += `<button type="button" class="cal-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}" onclick="selectStaffCalDate('${dateStr}', ${d})">${d}</button>`;
  }
  const total = firstDay + daysInMonth;
  const nextDays = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= nextDays; d++) {
    html += `<button type="button" class="cal-day other-month" disabled>${d}</button>`;
  }
  document.getElementById('staffCalDays').innerHTML = html;
}

function changeStaffCalMonth(dir) {
  staffCalMonth += dir;
  if (staffCalMonth > 11) { staffCalMonth = 0; staffCalYear++; }
  if (staffCalMonth < 0) { staffCalMonth = 11; staffCalYear--; }
  renderStaffCalendar();
}

function selectStaffCalDate(dateStr, d) {
  staffCalSelected = dateStr;
  const [y, m] = dateStr.split('-');
  document.getElementById('fHireDateLabel').textContent = `${y}/${m}/${String(d).padStart(2, '0')}`;
  document.getElementById('fHireDate').value = dateStr;
  document.getElementById('staffCustomCalendar').classList.remove('open');
}

function selectStaffCalToday() {
  const today = new Date();
  staffCalYear = today.getFullYear();
  staffCalMonth = today.getMonth();
  const d = today.getDate();
  const dateStr = `${staffCalYear}-${String(staffCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  selectStaffCalDate(dateStr, d);
}

function clearStaffCalDate() {
  staffCalSelected = '';
  staffCalYear = new Date().getFullYear();
  staffCalMonth = new Date().getMonth();
  document.getElementById('fHireDateLabel').textContent = '選擇日期';
  document.getElementById('fHireDate').value = '';
  document.getElementById('staffCustomCalendar').classList.remove('open');
}

function setStaffCalDate(dateStr) {
  if (!dateStr) { clearStaffCalDate(); return; }
  const [y, m, d] = dateStr.split('-');
  staffCalYear = parseInt(y);
  staffCalMonth = parseInt(m) - 1;
  staffCalSelected = dateStr;
  document.getElementById('fHireDateLabel').textContent = `${y}/${m}/${d}`;
  document.getElementById('fHireDate').value = dateStr;
}

document.addEventListener('click', function(e) {
  const wrapper = document.getElementById('fHireDateWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('staffCustomCalendar').classList.remove('open');
  }
});

// ── 假資料 ──
const staffList = [
  { id: 1, name: '林設計師', phone: '0912-111-222', title: '設計師', hireDate: '2022-03-01', specialty: '縮毛矯正、線條染', isActive: true, notes: '' },
  { id: 2, name: '王設計師', phone: '0923-222-333', title: '設計師', hireDate: '2021-06-15', specialty: '染髮、燙髮', isActive: true, notes: '擅長日式風格' },
  { id: 3, name: '陳助理', phone: '0934-333-444', title: '助理', hireDate: '2024-01-10', specialty: '洗髮、護髮', isActive: true, notes: '' },
  { id: 4, name: '張前員工', phone: '0945-444-555', title: '設計師', hireDate: '2020-05-01', specialty: '剪髮', isActive: false, notes: '已離職' },
];

let filtered = [...staffList];
let editingId = null;

// ── 渲染列表 ──
function renderTable() {
  const tbody = document.getElementById('staffTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--neutral);padding:2rem;font-style:italic;">查無員工資料</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => `
    <tr style="${!s.isActive ? 'opacity:0.6;' : ''}">
      <td>
        <div style="display:flex;align-items:center;justify-content:center;gap:0.8rem;">
          <div style="width:34px;height:34px;border-radius:50%;background:${s.isActive ? 'var(--peach-cream)' : 'var(--chalk-beige)'};display:flex;align-items:center;justify-content:center;font-size:0.82rem;color:var(--brown-dark);flex-shrink:0;">${s.name.charAt(0)}</div>
          <div>
            <div style="font-size:0.85rem;color:var(--text-dark);">${s.name}</div>
            <div style="font-size:0.72rem;color:var(--neutral);">${s.phone}</div>
          </div>
        </div>
      </td>
      <td><span class="badge ${s.title === '設計師' ? 'badge-confirmed' : 'badge-pending'}">${s.title}</span></td>
      <td>${s.hireDate}</td>
      <td style="font-size:0.8rem;color:var(--neutral);">${s.specialty}</td>
      <td><span class="badge ${s.isActive ? 'badge-active' : 'badge-inactive'}">${s.isActive ? '在職' : '離職'}</span></td>
      <td style="font-size:0.78rem;color:var(--neutral);">${s.notes || '—'}</td>
      <td>
        <div style="display:flex;gap:0.3rem;justify-content:center;">
          <button class="btn-icon" title="編輯" onclick="openEdit(${s.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
          </button>
          ${s.isActive
            ? `<button class="btn-icon danger" title="停用" onclick="toggleActive(${s.id}, false)">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
               </button>`
            : `<button class="btn-icon" title="啟用" onclick="toggleActive(${s.id}, true)">
                <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               </button>`
          }
        </div>
      </td>
    </tr>
  `).join('');
}

// ── 工具列下拉 ──
function toggleTitleDropdown() {
  document.getElementById('statusDropdown').classList.remove('open');
  document.getElementById('titleDropdown').classList.toggle('open');
}

function toggleStatusDropdown() {
  document.getElementById('titleDropdown').classList.remove('open');
  document.getElementById('statusDropdown').classList.toggle('open');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('#titleDropdown')) document.getElementById('titleDropdown').classList.remove('open');
  if (!e.target.closest('#statusDropdown')) document.getElementById('statusDropdown').classList.remove('open');
});

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('#titleList .custom-select-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.querySelectorAll('#titleList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('titleLabel').textContent = this.textContent;
      document.getElementById('titleFilter').value = this.dataset.value;
      document.getElementById('titleDropdown').classList.remove('open');
      applyFilter();
    });
  });

  document.querySelectorAll('#statusList .custom-select-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      document.querySelectorAll('#statusList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('statusLabel').textContent = this.textContent;
      document.getElementById('statusFilter').value = this.dataset.value;
      document.getElementById('statusDropdown').classList.remove('open');
      applyFilter();
    });
  });
});

// ── 篩選 ──
document.getElementById('searchInput').addEventListener('input', applyFilter);

function applyFilter() {
  const keyword = document.getElementById('searchInput').value.trim();
  const title = document.getElementById('titleFilter').value;
  const status = document.getElementById('statusFilter').value;

  filtered = staffList.filter(s => {
    const matchKeyword = !keyword || s.name.includes(keyword) || s.phone.includes(keyword);
    const matchTitle = !title || s.title === title;
    const matchStatus = status === '' ? true : status === 'active' ? s.isActive : !s.isActive;
    return matchKeyword && matchTitle && matchStatus;
  });

  renderTable();
  document.getElementById('staffCount').textContent = `共 ${filtered.length} 位員工`;
}

// ── 新增員工 ──
function openAdd() {
  editingId = null;
  document.getElementById('modalTitle').textContent = '新增員工';
  document.getElementById('staffForm').reset();
  resetModalDropdown('fTitleDropdown');
  setModalDropdown('fIsActiveDropdown', 'true');
  clearStaffCalDate();
  document.getElementById('modalOverlay').classList.add('show');
}

// ── 編輯員工 ──
function openEdit(id) {
  const s = staffList.find(s => s.id === id);
  if (!s) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = '編輯員工';
  document.getElementById('fName').value = s.name;
  document.getElementById('fPhone').value = s.phone;
  setModalDropdown('fTitleDropdown', s.title);
  setStaffCalDate(s.hireDate);
  document.getElementById('fSpecialty').value = s.specialty;
  setModalDropdown('fIsActiveDropdown', String(s.isActive));
  document.getElementById('fNotes').value = s.notes;
  document.getElementById('modalOverlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

// ── 儲存員工 ──
document.getElementById('staffForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!document.getElementById('fHireDate').value) {
    showToast('請選擇到職日');
    return;
  }

  const data = {
    name: document.getElementById('fName').value,
    phone: document.getElementById('fPhone').value,
    title: document.getElementById('fTitle').value,
    hireDate: document.getElementById('fHireDate').value,
    specialty: document.getElementById('fSpecialty').value,
    isActive: document.getElementById('fIsActive').value === 'true',
    notes: document.getElementById('fNotes').value,
  };

  if (editingId) {
    // TODO: PUT /api/staff/{id}
    const idx = staffList.findIndex(s => s.id === editingId);
    staffList[idx] = { ...staffList[idx], ...data };
    showToast('員工資料已更新');
  } else {
    // TODO: POST /api/staff
    const newId = Math.max(...staffList.map(s => s.id)) + 1;
    staffList.push({ id: newId, ...data });
    showToast('員工已新增');
  }

  closeModal();
  applyFilter();
});

// ── 切換在職狀態 ──
let _pendingToggleId = null;
let _pendingToggleActive = null;

function toggleActive(id, active) {
  const s = staffList.find(s => s.id === id);
  if (!s) return;
  _pendingToggleId = id;
  _pendingToggleActive = active;
  const action = active ? '啟用' : '停用';
  document.getElementById('toggleConfirmTitle').textContent = `確定要${action}員工「${s.name}」？`;
  document.getElementById('toggleConfirmDesc').textContent = active
    ? '啟用後該員工可接受新預約。'
    : '停用後該員工將無法接受新預約。';
  const btn = document.getElementById('toggleConfirmBtn');
  btn.textContent = action;
  btn.className = active ? 'btn-primary' : 'btn-danger';
  document.getElementById('toggleConfirmOverlay').classList.add('show');
}

function confirmToggleActive() {
  const s = staffList.find(s => s.id === _pendingToggleId);
  if (s) {
    s.isActive = _pendingToggleActive;
    // TODO: PUT /api/staff/{id}
    applyFilter();
    showToast(`已${_pendingToggleActive ? '啟用' : '停用'}「${s.name}」`);
  }
  closeToggleConfirm();
}

function closeToggleConfirm() {
  _pendingToggleId = null;
  _pendingToggleActive = null;
  document.getElementById('toggleConfirmOverlay').classList.remove('show');
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
  applyFilter();
});
