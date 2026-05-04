// ── 假資料 ──
const customers = [
  { id: 1, name: '王小明', phone: '0912-345-678', gender: '男', birthday: '1990-06-15', joinedAt: '2024-01-10', notes: '對某些染劑過敏，需確認' },
  { id: 2, name: '李小華', phone: '0923-456-789', gender: '女', birthday: '1995-03-22', joinedAt: '2024-02-05', notes: '' },
  { id: 3, name: '陳小美', phone: '0934-567-890', gender: '女', birthday: '1988-11-30', joinedAt: '2024-01-20', notes: '偏好林設計師' },
  { id: 4, name: '張大偉', phone: '0945-678-901', gender: '男', birthday: '1992-07-08', joinedAt: '2024-03-15', notes: '' },
  { id: 5, name: '林小芳', phone: '0956-789-012', gender: '女', birthday: '1998-12-01', joinedAt: '2024-04-01', notes: '頭皮敏感' },
  { id: 6, name: '黃小玲', phone: '0967-890-123', gender: '女', birthday: '1985-09-14', joinedAt: '2023-12-20', notes: '' },
];

let filtered = [...customers];
let editingId = null;

// ── 渲染列表 ──
function renderTable() {
  const tbody = document.getElementById('customerTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--neutral);padding:2rem;font-style:italic;">查無客戶資料</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => `
    <tr>
      <td>
        <div style="font-size:0.85rem;color:var(--text-dark);">${c.name}</div>
        <div style="font-size:0.72rem;color:var(--neutral);">${c.gender}</div>
      </td>
      <td>${c.phone}</td>
      <td>${c.birthday}</td>
      <td>${c.joinedAt}</td>
      <td style="max-width:150px;font-size:0.78rem;color:var(--neutral);">${c.notes || '—'}</td>
      <td>
        <div style="display:flex;gap:0.3rem;justify-content:center;">
          <button class="btn-icon" title="編輯" onclick="openEdit(${c.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
          </button>
          <button class="btn-icon" title="查看預約" onclick="viewAppointments(${c.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5"/></svg>
          </button>
          <button class="btn-icon danger" title="刪除" onclick="deleteCustomer(${c.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Modal 自訂下拉 ──
function toggleModalDropdown(id) {
  document.querySelectorAll('.modal-select').forEach(function (d) {
    if (d.id !== id) d.classList.remove('open');
  });
  document.getElementById(id).classList.toggle('open');
}

function setModalDropdown(dropdownId, value) {
  const wrapper = document.getElementById(dropdownId);
  const inputId = wrapper.dataset.input;
  const labelId = wrapper.dataset.label;
  wrapper.querySelectorAll('.custom-select-option').forEach(function (o) { o.classList.remove('selected'); });
  const opt = wrapper.querySelector('.custom-select-option[data-value="' + value + '"]');
  if (opt) {
    document.getElementById(inputId).value = value;
    document.getElementById(labelId).textContent = opt.textContent.trim();
    opt.classList.add('selected');
  }
}

function resetModalDropdown(dropdownId) {
  const wrapper = document.getElementById(dropdownId);
  const firstOpt = wrapper.querySelector('.custom-select-option');
  wrapper.querySelectorAll('.custom-select-option').forEach(function (o) { o.classList.remove('selected'); });
  if (firstOpt) {
    firstOpt.classList.add('selected');
    document.getElementById(wrapper.dataset.input).value = firstOpt.dataset.value;
    document.getElementById(wrapper.dataset.label).textContent = firstOpt.textContent.trim();
  }
}

document.addEventListener('click', function (e) {
  const opt = e.target.closest('.modal-select .custom-select-option');
  if (!opt) return;
  const wrapper = opt.closest('.modal-select');
  document.getElementById(wrapper.dataset.input).value = opt.dataset.value;
  document.getElementById(wrapper.dataset.label).textContent = opt.textContent.trim();
  wrapper.querySelectorAll('.custom-select-option').forEach(function (o) { o.classList.remove('selected'); });
  opt.classList.add('selected');
  wrapper.classList.remove('open');
});

// ── 自訂性別下拉 ──
function toggleGenderDropdown() {
  document.getElementById('genderDropdown').classList.toggle('open');
}

document.addEventListener('click', function (e) {
  const wrapper = document.getElementById('genderDropdown');
  if (wrapper && !wrapper.contains(e.target)) {
    wrapper.classList.remove('open');
  }
});

// ── 搜尋 ──
document.getElementById('searchInput').addEventListener('input', applyFilter);

function applyFilter() {
  const keyword = document.getElementById('searchInput').value.trim();
  const gender = document.getElementById('genderFilter').value;

  filtered = customers.filter(c => {
    const matchKeyword = !keyword ||
      c.name.includes(keyword) ||
      c.phone.includes(keyword);
    const matchGender = !gender || c.gender === gender;
    return matchKeyword && matchGender;
  });

  renderTable();
  document.getElementById('totalCount').textContent = `共 ${filtered.length} 位客戶`;
}

// ── 生日日曆 ──
let bCalYear = new Date().getFullYear();
let bCalMonth = new Date().getMonth();
let bCalSelected = '';

function toggleBirthdayCalendar() {
  const cal = document.getElementById('birthdayCustomCalendar');
  if (cal.classList.contains('open')) {
    cal.classList.remove('open');
  } else {
    renderBirthdayCalendar();
    cal.classList.add('open');
  }
}

function renderBirthdayCalendar() {
  const today = new Date();
  const firstDay = new Date(bCalYear, bCalMonth, 1).getDay();
  const daysInMonth = new Date(bCalYear, bCalMonth + 1, 0).getDate();
  const daysInPrev = new Date(bCalYear, bCalMonth, 0).getDate();

  document.getElementById('bCalMonthLabel').textContent =
    `${bCalYear}年 ${String(bCalMonth + 1).padStart(2, '0')}月`;

  let html = '';
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<button type="button" class="cal-day other-month" disabled>${daysInPrev - i}</button>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${bCalYear}-${String(bCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === bCalYear && today.getMonth() === bCalMonth && today.getDate() === d;
    const isSelected = bCalSelected === dateStr;
    html += `<button type="button" class="cal-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}" onclick="selectBirthdayCalDate('${dateStr}', ${d})">${d}</button>`;
  }
  const total = firstDay + daysInMonth;
  const nextDays = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= nextDays; d++) {
    html += `<button type="button" class="cal-day other-month" disabled>${d}</button>`;
  }
  document.getElementById('bCalDays').innerHTML = html;
}

function changeBirthdayCalMonth(dir) {
  bCalMonth += dir;
  if (bCalMonth > 11) { bCalMonth = 0; bCalYear++; }
  if (bCalMonth < 0) { bCalMonth = 11; bCalYear--; }
  renderBirthdayCalendar();
}

function selectBirthdayCalDate(dateStr, d) {
  bCalSelected = dateStr;
  const [y, m] = dateStr.split('-');
  document.getElementById('fBirthdayLabel').textContent = `${y}/${m}/${String(d).padStart(2, '0')}`;
  document.getElementById('fBirthday').value = dateStr;
  document.getElementById('birthdayCustomCalendar').classList.remove('open');
}

function selectBirthdayToday() {
  const today = new Date();
  bCalYear = today.getFullYear();
  bCalMonth = today.getMonth();
  const d = today.getDate();
  const dateStr = `${bCalYear}-${String(bCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  selectBirthdayCalDate(dateStr, d);
}

function clearBirthdayCalDate() {
  bCalSelected = '';
  bCalYear = new Date().getFullYear();
  bCalMonth = new Date().getMonth();
  document.getElementById('fBirthdayLabel').textContent = '選擇生日';
  document.getElementById('fBirthday').value = '';
  document.getElementById('birthdayCustomCalendar').classList.remove('open');
}

function setBirthdayCalDate(dateStr) {
  if (!dateStr) { clearBirthdayCalDate(); return; }
  const [y, m, d] = dateStr.split('-');
  bCalYear = parseInt(y);
  bCalMonth = parseInt(m) - 1;
  bCalSelected = dateStr;
  document.getElementById('fBirthdayLabel').textContent = `${y}/${m}/${d}`;
  document.getElementById('fBirthday').value = dateStr;
}

document.addEventListener('click', function (e) {
  const wrapper = document.getElementById('birthdayCalWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('birthdayCustomCalendar').classList.remove('open');
  }
});

// ── 新增客戶 ──
function openAdd() {
  editingId = null;
  document.getElementById('modalTitle').textContent = '新增客戶';
  document.getElementById('customerForm').reset();
  resetModalDropdown('fGenderDropdown');
  clearBirthdayCalDate();
  document.getElementById('modalOverlay').classList.add('show');
}

// ── 編輯客戶 ──
function openEdit(id) {
  const c = customers.find(c => c.id === id);
  if (!c) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = '編輯客戶';
  document.getElementById('fName').value = c.name;
  document.getElementById('fPhone').value = c.phone;
  setModalDropdown('fGenderDropdown', c.gender);
  setBirthdayCalDate(c.birthday);
  document.getElementById('fNotes').value = c.notes;
  document.getElementById('modalOverlay').classList.add('show');
}

// ── 查看預約 ──
function viewAppointments(id) {
  const c = customers.find(c => c.id === id);
  window.location.href = `./appointments.html?search=${encodeURIComponent(c.name)}`;
}

// ── 關閉 Modal ──
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

// ── 儲存客戶 ──
document.getElementById('customerForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('fName').value,
    phone: document.getElementById('fPhone').value,
    gender: document.getElementById('fGender').value,
    birthday: document.getElementById('fBirthday').value,
    notes: document.getElementById('fNotes').value,
  };

  if (editingId) {
    // TODO: PUT /api/customers/{id}
    const idx = customers.findIndex(c => c.id === editingId);
    customers[idx] = { ...customers[idx], ...data };
    showToast('客戶資料已更新');
  } else {
    // TODO: POST /api/customers
    const newId = Math.max(...customers.map(c => c.id)) + 1;
    customers.push({ id: newId, joinedAt: new Date().toISOString().split('T')[0], ...data });
    showToast('客戶已新增');
  }

  closeModal();
  applyFilter();
});

// ── 刪除客戶 ──
function deleteCustomer(id) {
  const c = customers.find(c => c.id === id);
  if (!confirm(`確定要刪除客戶「${c.name}」？`)) return;
  const idx = customers.findIndex(c => c.id === id);
  customers.splice(idx, 1);
  applyFilter();
  showToast('客戶已刪除');
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
  document.getElementById('totalCount').textContent = `共 ${customers.length} 位客戶`;

  document.querySelectorAll('#genderList .custom-select-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      const value = this.dataset.value;
      document.getElementById('genderLabel').textContent = this.textContent;
      document.querySelectorAll('#genderList .custom-select-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
      document.getElementById('genderDropdown').classList.remove('open');
      document.getElementById('genderFilter').value = value;
      applyFilter();
    });
  });
});
