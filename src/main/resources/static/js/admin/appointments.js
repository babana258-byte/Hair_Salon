// ── 自訂下拉選單 ──
function toggleDropdown() {
  document.getElementById('staffDropdown').classList.toggle('open');
}

document.addEventListener('click', function (e) {
  const wrapper = document.getElementById('staffDropdown');
  if (wrapper && !wrapper.contains(e.target)) {
    wrapper.classList.remove('open');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('#staffList .custom-select-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      const value = this.dataset.value;
      document.getElementById('staffLabel').textContent = this.textContent;
      document.querySelectorAll('#staffList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('staffDropdown').classList.remove('open');
      document.getElementById('staffFilter').value = value;
      applyFilter();
    });
  });
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
  const inputId = wrapper.dataset.input;
  const labelId = wrapper.dataset.label;
  const isMulti = wrapper.dataset.multi === 'true';
  wrapper.querySelectorAll('.custom-select-option').forEach(function(o) { o.classList.remove('selected'); });
  if (isMulti) {
    const values = value ? value.split(',').map(s => s.trim()) : [];
    values.forEach(function(v) {
      const opt = wrapper.querySelector('.custom-select-option[data-value="' + v + '"]');
      if (opt) opt.classList.add('selected');
    });
    document.getElementById(inputId).value = values.join(',');
    document.getElementById(labelId).textContent = values.length ? values.join('、') : '選擇服務';
  } else {
    const opt = wrapper.querySelector('.custom-select-option[data-value="' + value + '"]');
    if (opt) {
      document.getElementById(inputId).value = value;
      document.getElementById(labelId).textContent = opt.textContent.trim();
      opt.classList.add('selected');
    }
  }
}

function resetModalDropdown(dropdownId) {
  const wrapper = document.getElementById(dropdownId);
  const inputId = wrapper.dataset.input;
  const labelId = wrapper.dataset.label;
  const isMulti = wrapper.dataset.multi === 'true';
  document.getElementById(inputId).value = '';
  document.getElementById(labelId).textContent = isMulti ? '選擇服務' : (wrapper.querySelector('.custom-select-option') ? wrapper.querySelector('.custom-select-option').textContent.trim() : '');
  wrapper.querySelectorAll('.custom-select-option').forEach(function(o) { o.classList.remove('selected'); });
}

// Modal 下拉選項點擊（事件委派）
document.addEventListener('click', function(e) {
  const opt = e.target.closest('.modal-select .custom-select-option');
  if (!opt) return;
  const wrapper = opt.closest('.modal-select');
  const isMulti = wrapper.dataset.multi === 'true';
  if (isMulti) {
    opt.classList.toggle('selected');
    const selected = Array.from(wrapper.querySelectorAll('.custom-select-option.selected')).map(o => o.dataset.value);
    document.getElementById(wrapper.dataset.input).value = selected.join(',');
    document.getElementById(wrapper.dataset.label).textContent = selected.length ? selected.join('、') : '選擇服務';
    // 多選不關閉下拉
  } else {
    document.getElementById(wrapper.dataset.input).value = opt.dataset.value;
    document.getElementById(wrapper.dataset.label).textContent = opt.textContent.trim();
    wrapper.querySelectorAll('.custom-select-option').forEach(function(o) { o.classList.remove('selected'); });
    opt.classList.add('selected');
    wrapper.classList.remove('open');
  }
});

// 點擊外部關閉 Modal 下拉
document.addEventListener('click', function(e) {
  if (!e.target.closest('.modal-select')) {
    document.querySelectorAll('.modal-select').forEach(function(d) { d.classList.remove('open'); });
  }
});

// ── 假資料 ──
const appointments = [
  { id: 1, customer: '王小明', phone: '0912-345-678', service: '縮毛矯正', staff: '林設計師', date: '2025-05-04', time: '14:00', status: '已確認', notes: '' },
  { id: 2, customer: '李小華', phone: '0923-456-789', service: '線條染', staff: '王設計師', date: '2025-05-04', time: '15:30', status: '已確認', notes: '客人想要挑染' },
  { id: 3, customer: '陳小美', phone: '0934-567-890', service: '剪髮', staff: '林設計師', date: '2025-05-04', time: '17:00', status: '待確認', notes: '' },
  { id: 4, customer: '張大偉', phone: '0945-678-901', service: '燙髮', staff: '王設計師', date: '2025-05-05', time: '10:00', status: '待確認', notes: '' },
  { id: 5, customer: '林小芳', phone: '0956-789-012', service: '護髮', staff: '林設計師', date: '2025-05-05', time: '13:00', status: '完成', notes: '' },
  { id: 6, customer: '黃小玲', phone: '0967-890-123', service: '頭皮養護', staff: '王設計師', date: '2025-05-03', time: '11:00', status: '預約未到', notes: '' },
];

let filtered = [...appointments];
let editingId = null;
let activeTab = 'upcoming';

const tabStatusMap = {
  upcoming:  ['已確認', '待確認'],
  completed: ['完成'],
  noshow:    ['預約未到'],
  cancelled: ['已取消'],
};

function switchTab(el, tab) {
  activeTab = tab;
  document.querySelectorAll('.status-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  applyFilter();
}

const statusMap = {
  '待確認': 'badge-pending',
  '已確認': 'badge-confirmed',
  '完成': 'badge-completed',
  '預約未到': 'badge-cancelled',
  '已取消': 'badge-voided',
};

// ── 渲染列表 ──
function renderTable() {
  const tbody = document.getElementById('apptTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--neutral);padding:2rem;font-style:italic;">查無預約資料</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(a => {
    const isPending   = a.status === '待確認';
    const isConfirmed = a.status === '已確認';
    const isActive    = isPending || isConfirmed;
    return `
    <tr>
      <td>
        <div style="font-size:0.85rem;color:var(--text-dark);">${a.customer}</div>
        <div style="font-size:0.72rem;color:var(--neutral);">${a.phone}</div>
      </td>
      <td>${a.service}</td>
      <td>${a.staff}</td>
      <td>
        <div style="font-size:0.82rem;">${a.date}</div>
        <div style="font-size:0.75rem;color:var(--neutral);">${a.time}</div>
      </td>
      <td><span class="badge ${statusMap[a.status]}">${a.status}</span></td>
      <td style="font-size:0.78rem;color:var(--neutral);">${a.notes || '—'}</td>
      <td>
        <div style="display:flex;gap:0.3rem;justify-content:center;">
          ${isPending ? `
          <button class="btn-icon" title="確認預約" onclick="confirmAppt(${a.id})" style="color:#5a8a5a;">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </button>
          ` : ''}
          ${isConfirmed ? `
          <button class="btn-icon" title="完成預約" onclick="openComplete(${a.id})" style="color:var(--brandy-rose);">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </button>
          <button class="btn-icon" title="預約未到" onclick="noShowAppt(${a.id})" style="color:#b0935a;">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/><line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
          ` : ''}
          ${isActive ? `
          <button class="btn-icon" title="取消預約" onclick="cancelAppt(${a.id})" style="color:var(--neutral);">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
          ` : ''}
          <button class="btn-icon" title="編輯" onclick="openEdit(${a.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
          </button>
          ${!isActive ? `
          <button class="btn-icon danger" title="刪除" onclick="deleteAppt(${a.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
          </button>
          ` : ''}
        </div>
      </td>
    </tr>
  `}).join('');
}

// ── 搜尋 ──
document.getElementById('searchInput').addEventListener('input', function () {
  applyFilter();
});



// ── 自訂行事曆 ──
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let calSelected = '';

function toggleCalendar() {
  const cal = document.getElementById('customCalendar');
  const isOpen = cal.classList.contains('open');
  // 關閉所有下拉
  document.getElementById('staffDropdown').classList.remove('open');
  if (isOpen) {
    cal.classList.remove('open');
  } else {
    renderCalendar();
    cal.classList.add('open');
  }
}

function renderCalendar() {
  const today = new Date();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrev = new Date(calYear, calMonth, 0).getDate();

  document.getElementById('calMonthLabel').textContent =
    `${calYear}年 ${String(calMonth + 1).padStart(2, '0')}月`;

  let html = '';
  // 上個月補位
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<button type="button" class="cal-day other-month" disabled>${daysInPrev - i}</button>`;
  }
  // 本月
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === calYear && today.getMonth() === calMonth && today.getDate() === d;
    const isSelected = calSelected === dateStr;
    html += `<button type="button" class="cal-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}" onclick="selectCalDate('${dateStr}', ${d})">${d}</button>`;
  }
  // 下個月補位
  const total = firstDay + daysInMonth;
  const nextDays = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= nextDays; d++) {
    html += `<button type="button" class="cal-day other-month" disabled>${d}</button>`;
  }

  document.getElementById('calDays').innerHTML = html;
}

function changeCalMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
}

function selectCalDate(dateStr, d) {
  calSelected = dateStr;
  const [y, m] = dateStr.split('-');
  document.getElementById('dateLabel').textContent = `${y}/${m}/${String(d).padStart(2, '0')}`;
  document.getElementById('dateFilter').value = dateStr;
  document.getElementById('customCalendar').classList.remove('open');
  applyFilter();
}

function selectToday() {
  const today = new Date();
  calYear = today.getFullYear();
  calMonth = today.getMonth();
  const d = today.getDate();
  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  selectCalDate(dateStr, d);
}

function clearCalDate() {
  calSelected = '';
  document.getElementById('dateLabel').textContent = '選擇日期';
  document.getElementById('dateFilter').value = '';
  document.getElementById('customCalendar').classList.remove('open');
  applyFilter();
}

// 點擊外部關閉行事曆
document.addEventListener('click', function (e) {
  const wrapper = document.getElementById('calendarWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('customCalendar').classList.remove('open');
  }
});

function applyFilter() {
  const keyword = document.getElementById('searchInput').value.trim();
  const staff = document.getElementById('staffFilter').value;
  const date = document.getElementById('dateFilter').value;

  const tabStatuses = tabStatusMap[activeTab];
  filtered = appointments.filter(a => {
    const matchTab = tabStatuses.includes(a.status);
    const matchKeyword = !keyword ||
      a.customer.includes(keyword) ||
      a.phone.includes(keyword) ||
      a.service.includes(keyword);
    const matchStaff = !staff || a.staff === staff;
    const matchDate = !date || a.date === date;
    return matchTab && matchKeyword && matchStaff && matchDate;
  });

  renderTable();
}

// ── Modal 行事曆 ──
let mCalYear = new Date().getFullYear();
let mCalMonth = new Date().getMonth();
let mCalSelected = '';

function toggleModalCalendar() {
  const cal = document.getElementById('modalCustomCalendar');
  if (cal.classList.contains('open')) {
    cal.classList.remove('open');
  } else {
    renderModalCalendar();
    cal.classList.add('open');
  }
}

function renderModalCalendar() {
  const today = new Date();
  const firstDay = new Date(mCalYear, mCalMonth, 1).getDay();
  const daysInMonth = new Date(mCalYear, mCalMonth + 1, 0).getDate();
  const daysInPrev = new Date(mCalYear, mCalMonth, 0).getDate();

  document.getElementById('mCalMonthLabel').textContent =
    `${mCalYear}年 ${String(mCalMonth + 1).padStart(2, '0')}月`;

  let html = '';
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<button type="button" class="cal-day other-month" disabled>${daysInPrev - i}</button>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${mCalYear}-${String(mCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === mCalYear && today.getMonth() === mCalMonth && today.getDate() === d;
    const isSelected = mCalSelected === dateStr;
    html += `<button type="button" class="cal-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}" onclick="selectModalCalDate('${dateStr}', ${d})">${d}</button>`;
  }
  const total = firstDay + daysInMonth;
  const nextDays = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= nextDays; d++) {
    html += `<button type="button" class="cal-day other-month" disabled>${d}</button>`;
  }
  document.getElementById('mCalDays').innerHTML = html;
}

function changeModalCalMonth(dir) {
  mCalMonth += dir;
  if (mCalMonth > 11) { mCalMonth = 0; mCalYear++; }
  if (mCalMonth < 0) { mCalMonth = 11; mCalYear--; }
  renderModalCalendar();
}

function selectModalCalDate(dateStr, d) {
  mCalSelected = dateStr;
  const [y, m] = dateStr.split('-');
  document.getElementById('fDateLabel').textContent = `${y}/${m}/${String(d).padStart(2, '0')}`;
  document.getElementById('fDate').value = dateStr;
  document.getElementById('modalCustomCalendar').classList.remove('open');
}

function selectModalToday() {
  const today = new Date();
  mCalYear = today.getFullYear();
  mCalMonth = today.getMonth();
  const d = today.getDate();
  const dateStr = `${mCalYear}-${String(mCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  selectModalCalDate(dateStr, d);
}

function clearModalCalDate() {
  mCalSelected = '';
  mCalYear = new Date().getFullYear();
  mCalMonth = new Date().getMonth();
  document.getElementById('fDateLabel').textContent = '選擇日期';
  document.getElementById('fDate').value = '';
  document.getElementById('modalCustomCalendar').classList.remove('open');
}

function setModalCalDate(dateStr) {
  if (!dateStr) { clearModalCalDate(); return; }
  const [y, m, d] = dateStr.split('-');
  mCalYear = parseInt(y);
  mCalMonth = parseInt(m) - 1;
  mCalSelected = dateStr;
  document.getElementById('fDateLabel').textContent = `${y}/${m}/${d}`;
  document.getElementById('fDate').value = dateStr;
}

// 點擊外部關閉 modal 行事曆
document.addEventListener('click', function (e) {
  const wrapper = document.getElementById('modalCalendarWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('modalCustomCalendar').classList.remove('open');
  }
});

// ── 新增預約 ──
function openAdd() {
  editingId = null;
  document.getElementById('modalTitle').textContent = '新增預約';
  document.getElementById('apptForm').reset();
  resetModalDropdown('fServiceDropdown');
  resetModalDropdown('fStaffDropdown');
  resetModalDropdown('fTimeDropdown');
  setModalDropdown('fStatusDropdown', '待確認');
  document.getElementById('fStatus').value = '待確認';
  clearModalCalDate();
  document.getElementById('modalOverlay').classList.add('show');
}

// ── 編輯預約 ──
function openEdit(id) {
  const appt = appointments.find(a => a.id === id);
  if (!appt) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = '編輯預約';
  document.getElementById('fCustomer').value = appt.customer;
  document.getElementById('fPhone').value = appt.phone;
  setModalDropdown('fServiceDropdown', appt.service);
  setModalDropdown('fStaffDropdown', appt.staff);
  setModalCalDate(appt.date);
  setModalDropdown('fTimeDropdown', appt.time);
  setModalDropdown('fStatusDropdown', appt.status);
  document.getElementById('fNotes').value = appt.notes;
  document.getElementById('modalOverlay').classList.add('show');
}

// ── 關閉 Modal ──
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

function handleOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

// ── 儲存預約 ──
document.getElementById('apptForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!document.getElementById('fDate').value) {
    showToast('請選擇預約日期');
    return;
  }

  const data = {
    customer: document.getElementById('fCustomer').value,
    phone: document.getElementById('fPhone').value,
    service: document.getElementById('fService').value,
    staff: document.getElementById('fStaff').value,
    date: document.getElementById('fDate').value,
    time: document.getElementById('fTime').value,
    status: document.getElementById('fStatus').value,
    notes: document.getElementById('fNotes').value,
  };

  if (editingId) {
    // TODO: PUT /api/appointments/{id}
    const idx = appointments.findIndex(a => a.id === editingId);
    appointments[idx] = { ...appointments[idx], ...data };
    showToast('預約已更新');
  } else {
    // TODO: POST /api/appointments
    const newId = Math.max(...appointments.map(a => a.id)) + 1;
    appointments.push({ id: newId, ...data });
    showToast('預約已新增');
  }

  closeModal();
  applyFilter();
});

// ── 完成預約 + 建立消費單 ──
let completingId = null;

function openComplete(id) {
  const appt = appointments.find(a => a.id === id);
  if (!appt) return;
  completingId = id;

  document.getElementById('cInfoCustomer').textContent = appt.customer;
  document.getElementById('cInfoService').textContent = appt.service;
  document.getElementById('cInfoStaff').textContent = appt.staff;
  document.getElementById('cInfoDatetime').textContent = `${appt.date} ${appt.time}`;

  document.getElementById('cServices').value = appt.service;
  document.getElementById('cProduct').value = '';
  document.getElementById('cAmount').value = '';
  document.getElementById('cDiscount').value = '0';
  resetModalDropdown('cMethodDropdown');
  setModalDropdown('cPaidDropdown', 'paid');
  document.getElementById('cPaid').value = 'paid';

  document.getElementById('completeOverlay').classList.add('show');
}

function closeComplete() {
  completingId = null;
  document.getElementById('completeOverlay').classList.remove('show');
}

function handleCompleteOverlayClick(e) {
  if (e.target === document.getElementById('completeOverlay')) closeComplete();
}

document.getElementById('completeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (completingId === null) return;

  const appt = appointments.find(a => a.id === completingId);
  if (!appt) return;

  const subtotal = parseInt(document.getElementById('cAmount').value) || 0;
  const discount = parseInt(document.getElementById('cDiscount').value) || 0;
  const method = document.getElementById('cMethod').value;
  const paidStatus = document.getElementById('cPaid').value;

  if (!method) { showToast('請選擇付款方式'); return; }

  // 更新預約狀態為完成
  appt.status = '完成';

  // 建立消費單（存入 localStorage 供 invoices.html 讀取）
  const newInvoice = {
    id: Date.now(),
    customer: appt.customer,
    designer: appt.staff,
    date: appt.date,
    items: document.getElementById('cServices').value,
    product: document.getElementById('cProduct').value,
    subtotal,
    discount,
    total: subtotal - discount,
    paymentMethod: method,
    paidAt: paidStatus === 'paid' ? new Date().toLocaleString('zh-TW') : null,
    fromAppt: appt.id,
  };

  const stored = JSON.parse(localStorage.getItem('invoices') || '[]');
  stored.push(newInvoice);
  localStorage.setItem('invoices', JSON.stringify(stored));

  closeComplete();
  applyFilter();
  showToast('預約已完成，消費單已建立');
});

// ── 刪除預約 ──
let pendingDeleteId = null;

function deleteAppt(id) {
  pendingDeleteId = id;
  document.getElementById('confirmOverlay').classList.add('show');
}

function closeConfirm() {
  pendingDeleteId = null;
  document.getElementById('confirmOverlay').classList.remove('show');
}

document.getElementById('confirmDeleteBtn').addEventListener('click', function () {
  if (pendingDeleteId === null) return;
  const idx = appointments.findIndex(a => a.id === pendingDeleteId);
  appointments.splice(idx, 1);
  closeConfirm();
  applyFilter();
  showToast('預約已刪除');
});

// ── 確認預約（待確認 → 已確認）──
function confirmAppt(id) {
  const appt = appointments.find(a => a.id === id);
  if (!appt) return;
  appt.status = '已確認';
  applyFilter();
  showToast('預約已確認');
}

// ── 取消預約 ──
let pendingCancelId = null;

function noShowAppt(id) {
  const appt = appointments.find(a => a.id === id);
  if (!appt) return;
  appt.status = '預約未到';
  applyFilter();
}

function cancelAppt(id) {
  pendingCancelId = id;
  document.getElementById('cancelConfirmOverlay').classList.add('show');
}

function closeCancelConfirm() {
  pendingCancelId = null;
  document.getElementById('cancelConfirmOverlay').classList.remove('show');
}

document.getElementById('confirmCancelBtn').addEventListener('click', function () {
  if (pendingCancelId === null) return;
  const appt = appointments.find(a => a.id === pendingCancelId);
  if (appt) appt.status = '已取消';
  closeCancelConfirm();
  applyFilter();
  showToast('預約已取消');
});

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── 初始化 ──
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const search = params.get('search');
  if (search) {
    document.getElementById('searchInput').value = search;
  }
  applyFilter();
});
