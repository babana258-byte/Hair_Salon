// ── 假資料 ──
const invoices = [
  { id: 1, customer: '王小明', date: '2025-05-04', items: '縮毛矯正', subtotal: 3500, discount: 0, total: 3580, paymentMethod: '刷卡', paidAt: '2025-05-04 14:30' },
  { id: 2, customer: '李小華', date: '2025-05-04', items: '線條染、護髮', subtotal: 4200, discount: 200, total: 4080, paymentMethod: 'Line Pay', paidAt: '2025-05-04 16:00' },
  { id: 3, customer: '陳小美', date: '2025-05-03', items: '剪髮', subtotal: 500, discount: 0, total: 500, paymentMethod: '現金', paidAt: '2025-05-03 17:20' },
  { id: 4, customer: '張大偉', date: '2025-05-02', items: '燙髮', subtotal: 2800, discount: 0, total: 2800, paymentMethod: '轉帳', paidAt: null },
  { id: 5, customer: '林小芳', date: '2025-05-01', items: '護髮療程', subtotal: 1200, discount: 100, total: 1100, paymentMethod: '現金', paidAt: '2025-05-01 13:30' },
  { id: 6, customer: '黃小玲', date: '2025-04-30', items: '頭皮養護、剪髮', subtotal: 1800, discount: 0, total: 1800, paymentMethod: '刷卡', paidAt: '2025-04-30 12:00' },
];

// 讀取由 appointments.html 透過 localStorage 建立的消費單
try {
  const stored = JSON.parse(localStorage.getItem('invoices') || '[]');
  stored.forEach(function(inv) { invoices.push(inv); });
} catch(e) {}

let filtered = [...invoices];
let viewingId = null;

const methodMap = {
  '現金': 'badge-completed',
  '刷卡': 'badge-confirmed',
  'Line Pay': 'badge-confirmed',
  '轉帳': 'badge-pending',
};

// ── 渲染列表 ──
function renderTable() {
  const tbody = document.getElementById('invoiceTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--neutral);padding:2rem;font-style:italic;">查無消費記錄</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(inv => `
    <tr>
      <td style="font-size:0.78rem;color:var(--brandy-rose);letter-spacing:0.05em;">#${String(inv.id).padStart(4,'0')}</td>
      <td>${inv.customer}</td>
      <td>${inv.date}</td>
      <td style="font-size:0.8rem;color:var(--neutral);">${inv.items}</td>
      <td>
        <div style="font-size:0.85rem;">NT$ ${inv.total.toLocaleString()}</div>
        ${inv.discount > 0 ? `<div style="font-size:0.7rem;color:var(--neutral);">折扣 -${inv.discount}</div>` : ''}
      </td>
      <td><span class="badge ${methodMap[inv.paymentMethod]}">${inv.paymentMethod}</span></td>
      <td>
        ${inv.paidAt
          ? `<span class="badge badge-confirmed">已付款</span>`
          : `<span class="badge badge-warning">未收款</span>`}
      </td>
      <td>
        <div style="display:flex;gap:0.3rem;justify-content:center;">
          <button class="btn-icon" title="查看明細" onclick="openDetail(${inv.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </button>
          ${!inv.paidAt ? `
          <button class="btn-icon" title="標記收款" onclick="markPaid(${inv.id})" style="color:var(--brandy-rose);">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');

  updateSummary();
}

// ── 更新摘要 ──
function updateSummary() {
  const total = filtered.reduce((sum, i) => sum + i.total, 0);
  const paid = filtered.filter(i => i.paidAt).reduce((sum, i) => sum + i.total, 0);
  const unpaid = filtered.filter(i => !i.paidAt).reduce((sum, i) => sum + i.total, 0);

  document.getElementById('totalRevenue').textContent = `NT$ ${total.toLocaleString()}`;
  document.getElementById('paidRevenue').textContent = `NT$ ${paid.toLocaleString()}`;
  document.getElementById('unpaidRevenue').textContent = `NT$ ${unpaid.toLocaleString()}`;
  document.getElementById('invoiceCount').textContent = `${filtered.length} 筆`;
}

// ── 自訂下拉 ──
function toggleMethodDropdown() {
  document.getElementById('paidDropdown').classList.remove('open');
  document.getElementById('methodDropdown').classList.toggle('open');
}

function togglePaidDropdown() {
  document.getElementById('methodDropdown').classList.remove('open');
  document.getElementById('paidDropdown').classList.toggle('open');
}

document.addEventListener('click', function (e) {
  if (!e.target.closest('#methodDropdown')) document.getElementById('methodDropdown').classList.remove('open');
  if (!e.target.closest('#paidDropdown')) document.getElementById('paidDropdown').classList.remove('open');
});

// ── 自訂日曆 ──
let invCalYear = new Date().getFullYear();
let invCalMonth = new Date().getMonth();
let invCalSelected = '';

function toggleInvCalendar() {
  const cal = document.getElementById('invCustomCalendar');
  if (cal.classList.contains('open')) {
    cal.classList.remove('open');
  } else {
    renderInvCalendar();
    cal.classList.add('open');
  }
}

function renderInvCalendar() {
  const today = new Date();
  const firstDay = new Date(invCalYear, invCalMonth, 1).getDay();
  const daysInMonth = new Date(invCalYear, invCalMonth + 1, 0).getDate();
  const daysInPrev = new Date(invCalYear, invCalMonth, 0).getDate();

  document.getElementById('invCalMonthLabel').textContent =
    `${invCalYear}年 ${String(invCalMonth + 1).padStart(2, '0')}月`;

  let html = '';
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<button type="button" class="cal-day other-month" disabled>${daysInPrev - i}</button>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${invCalYear}-${String(invCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === invCalYear && today.getMonth() === invCalMonth && today.getDate() === d;
    const isSelected = invCalSelected === dateStr;
    html += `<button type="button" class="cal-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}" onclick="selectInvCalDate('${dateStr}', ${d})">${d}</button>`;
  }
  const total = firstDay + daysInMonth;
  const nextDays = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= nextDays; d++) {
    html += `<button type="button" class="cal-day other-month" disabled>${d}</button>`;
  }
  document.getElementById('invCalDays').innerHTML = html;
}

function changeInvCalMonth(dir) {
  invCalMonth += dir;
  if (invCalMonth > 11) { invCalMonth = 0; invCalYear++; }
  if (invCalMonth < 0) { invCalMonth = 11; invCalYear--; }
  renderInvCalendar();
}

function selectInvCalDate(dateStr, d) {
  invCalSelected = dateStr;
  const [y, m] = dateStr.split('-');
  document.getElementById('invDateLabel').textContent = `${y}/${m}/${String(d).padStart(2, '0')}`;
  document.getElementById('dateFilter').value = dateStr;
  document.getElementById('invCustomCalendar').classList.remove('open');
  applyFilter();
}

function selectInvToday() {
  const today = new Date();
  invCalYear = today.getFullYear();
  invCalMonth = today.getMonth();
  const d = today.getDate();
  const dateStr = `${invCalYear}-${String(invCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  selectInvCalDate(dateStr, d);
}

function clearInvCalDate() {
  invCalSelected = '';
  invCalYear = new Date().getFullYear();
  invCalMonth = new Date().getMonth();
  document.getElementById('invDateLabel').textContent = '選擇日期';
  document.getElementById('dateFilter').value = '';
  document.getElementById('invCustomCalendar').classList.remove('open');
  applyFilter();
}

document.addEventListener('click', function (e) {
  const wrapper = document.getElementById('invCalendarWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('invCustomCalendar').classList.remove('open');
  }
});

// ── 篩選 ──
document.getElementById('searchInput').addEventListener('input', applyFilter);

function applyFilter() {
  const keyword = document.getElementById('searchInput').value.trim();
  const method = document.getElementById('methodFilter').value;
  const paid = document.getElementById('paidFilter').value;
  const date = document.getElementById('dateFilter').value;

  filtered = invoices.filter(inv => {
    const matchKeyword = !keyword || inv.customer.includes(keyword) || inv.items.includes(keyword);
    const matchMethod = !method || inv.paymentMethod === method;
    const matchPaid = paid === '' ? true : paid === 'paid' ? !!inv.paidAt : !inv.paidAt;
    const matchDate = !date || inv.date === date;
    return matchKeyword && matchMethod && matchPaid && matchDate;
  });

  renderTable();
}

// ── 標記付款 ──
function markPaid(id) {
  const inv = invoices.find(i => i.id === id);
  if (!inv) return;
  inv.paidAt = new Date().toLocaleString('zh-TW');
  applyFilter();
  showToast('已標記為已付款');
}

// ── 查看明細 ──
function openDetail(id) {
  const inv = invoices.find(i => i.id === id);
  if (!inv) return;
  viewingId = id;

  document.getElementById('detailNo').textContent = `#${String(inv.id).padStart(4,'0')}`;
  document.getElementById('detailCustomer').textContent = inv.customer;
  document.getElementById('detailDate').textContent = inv.date;
  document.getElementById('detailMethod').textContent = inv.paymentMethod;
  document.getElementById('detailPaid').textContent = inv.paidAt || '尚未付款';
  document.getElementById('detailItems').textContent = inv.items;
  document.getElementById('detailSubtotal').textContent = `NT$ ${inv.subtotal.toLocaleString()}`;
  document.getElementById('detailDiscount').textContent = inv.discount > 0 ? `-NT$ ${inv.discount}` : '無';
  document.getElementById('detailTotal').textContent = `NT$ ${inv.total.toLocaleString()}`;

  document.getElementById('detailOverlay').classList.add('show');
}

function closeDetail() {
  document.getElementById('detailOverlay').classList.remove('show');
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
  renderTable();

  document.querySelectorAll('#methodList .custom-select-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      document.querySelectorAll('#methodList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('methodLabel').textContent = this.textContent;
      document.getElementById('methodFilter').value = this.dataset.value;
      document.getElementById('methodDropdown').classList.remove('open');
      applyFilter();
    });
  });

  document.querySelectorAll('#paidList .custom-select-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      document.querySelectorAll('#paidList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('paidLabel').textContent = this.textContent;
      document.getElementById('paidFilter').value = this.dataset.value;
      document.getElementById('paidDropdown').classList.remove('open');
      applyFilter();
    });
  });
});

// ── Modal 自訂下拉（invoices 專用）──
function toggleInvModalDropdown(id) {
  document.querySelectorAll('.modal-select').forEach(function(d) {
    if (d.id !== id) d.classList.remove('open');
  });
  document.getElementById(id).classList.toggle('open');
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

// ── Invoice Modal 行事曆 ──
let iCalYear = new Date().getFullYear();
let iCalMonth = new Date().getMonth();
let iCalSelected = '';

function toggleInvModalCalendar() {
  const cal = document.getElementById('iCustomCalendar');
  if (cal.classList.contains('open')) {
    cal.classList.remove('open');
  } else {
    renderInvModalCalendar();
    cal.classList.add('open');
  }
}

function renderInvModalCalendar() {
  const today = new Date();
  const firstDay = new Date(iCalYear, iCalMonth, 1).getDay();
  const daysInMonth = new Date(iCalYear, iCalMonth + 1, 0).getDate();
  const daysInPrev = new Date(iCalYear, iCalMonth, 0).getDate();

  document.getElementById('iCalMonthLabel').textContent =
    `${iCalYear}年 ${String(iCalMonth + 1).padStart(2, '0')}月`;

  let html = '';
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<button type="button" class="cal-day other-month" disabled>${daysInPrev - i}</button>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${iCalYear}-${String(iCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === iCalYear && today.getMonth() === iCalMonth && today.getDate() === d;
    const isSelected = iCalSelected === dateStr;
    html += `<button type="button" class="cal-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}" onclick="selectInvModalCalDate('${dateStr}', ${d})">${d}</button>`;
  }
  const total = firstDay + daysInMonth;
  const nextDays = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= nextDays; d++) {
    html += `<button type="button" class="cal-day other-month" disabled>${d}</button>`;
  }
  document.getElementById('iCalDays').innerHTML = html;
}

function changeInvModalCalMonth(dir) {
  iCalMonth += dir;
  if (iCalMonth > 11) { iCalMonth = 0; iCalYear++; }
  if (iCalMonth < 0) { iCalMonth = 11; iCalYear--; }
  renderInvModalCalendar();
}

function selectInvModalCalDate(dateStr, d) {
  iCalSelected = dateStr;
  const [y, m] = dateStr.split('-');
  document.getElementById('iDateLabel').textContent = `${y}/${m}/${String(d).padStart(2, '0')}`;
  document.getElementById('iDate').value = dateStr;
  document.getElementById('iCustomCalendar').classList.remove('open');
}

function selectInvModalToday() {
  const today = new Date();
  iCalYear = today.getFullYear();
  iCalMonth = today.getMonth();
  const d = today.getDate();
  const dateStr = `${iCalYear}-${String(iCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  selectInvModalCalDate(dateStr, d);
}

function clearInvModalCalDate() {
  iCalSelected = '';
  iCalYear = new Date().getFullYear();
  iCalMonth = new Date().getMonth();
  document.getElementById('iDateLabel').textContent = '選擇日期';
  document.getElementById('iDate').value = '';
  document.getElementById('iCustomCalendar').classList.remove('open');
}

document.addEventListener('click', function(e) {
  const wrapper = document.getElementById('iCalendarWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('iCustomCalendar').classList.remove('open');
  }
});

// ── 手動新增消費單 ──
function openAddInvoice() {
  document.getElementById('addInvoiceForm').reset();
  // 重置下拉
  ['iMethodDropdown', 'iPaidDropdown'].forEach(function(id) {
    const wrapper = document.getElementById(id);
    document.getElementById(wrapper.dataset.input).value = '';
    wrapper.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
  });
  document.getElementById('iMethodLabel').textContent = '選擇付款方式';
  document.getElementById('iPaidLabel').textContent = '已付款';
  document.getElementById('iPaid').value = 'paid';
  document.querySelector('#iPaidDropdown .custom-select-option[data-value="paid"]').classList.add('selected');
  // 日期預設今天
  selectInvModalToday();
  document.getElementById('addInvoiceOverlay').classList.add('show');
}

function closeAddInvoice() {
  document.getElementById('addInvoiceOverlay').classList.remove('show');
}

function handleAddInvoiceOverlayClick(e) {
  if (e.target === document.getElementById('addInvoiceOverlay')) closeAddInvoice();
}

document.getElementById('addInvoiceForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!document.getElementById('iDate').value) { showToast('請選擇消費日期'); return; }
  const method = document.getElementById('iMethod').value;
  if (!method) { showToast('請選擇付款方式'); return; }

  const subtotal = parseInt(document.getElementById('iAmount').value) || 0;
  const discount = parseInt(document.getElementById('iDiscount').value) || 0;
  const paidStatus = document.getElementById('iPaid').value;

  const newInv = {
    id: Date.now(),
    customer: document.getElementById('iCustomer').value,
    date: document.getElementById('iDate').value,
    items: document.getElementById('iItems').value,
    subtotal,
    discount,
    total: subtotal - discount,
    paymentMethod: method,
    paidAt: paidStatus === 'paid' ? new Date().toLocaleString('zh-TW') : null,
  };

  invoices.unshift(newInv);
  // 同步到 localStorage
  try {
    const stored = JSON.parse(localStorage.getItem('invoices') || '[]');
    stored.push(newInv);
    localStorage.setItem('invoices', JSON.stringify(stored));
  } catch(err) {}

  closeAddInvoice();
  applyFilter();
  showToast('消費單已建立');
});
