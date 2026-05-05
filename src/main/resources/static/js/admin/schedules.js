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
  const value = opt.dataset.value;
  document.getElementById(wrapper.dataset.input).value = value;
  document.getElementById(wrapper.dataset.label).textContent = opt.textContent.trim();
  wrapper.querySelectorAll('.custom-select-option').forEach(function(o) { o.classList.remove('selected'); });
  opt.classList.add('selected');
  wrapper.classList.remove('open');
  if (wrapper.dataset.input === 'fIsDayoff') {
    toggleTimeFields(value === 'true');
  }
});

document.addEventListener('click', function(e) {
  if (!e.target.closest('.modal-select')) {
    document.querySelectorAll('.modal-select').forEach(function(d) { d.classList.remove('open'); });
  }
});

// ── Modal 行事曆 ──
let schedCalYear = new Date().getFullYear();
let schedCalMonth = new Date().getMonth();
let schedCalSelected = '';

function toggleSchedModalCalendar() {
  const cal = document.getElementById('schedModalCalendar');
  if (cal.classList.contains('open')) {
    cal.classList.remove('open');
  } else {
    renderSchedModalCalendar();
    cal.classList.add('open');
  }
}

function renderSchedModalCalendar() {
  const today = new Date();
  const firstDay = new Date(schedCalYear, schedCalMonth, 1).getDay();
  const daysInMonth = new Date(schedCalYear, schedCalMonth + 1, 0).getDate();
  const daysInPrev = new Date(schedCalYear, schedCalMonth, 0).getDate();

  document.getElementById('schedCalMonthLabel').textContent =
    `${schedCalYear}年 ${String(schedCalMonth + 1).padStart(2, '0')}月`;

  let html = '';
  for (let i = firstDay - 1; i >= 0; i--) {
    html += `<button type="button" class="cal-day other-month" disabled>${daysInPrev - i}</button>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${schedCalYear}-${String(schedCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isToday = today.getFullYear() === schedCalYear && today.getMonth() === schedCalMonth && today.getDate() === d;
    const isSelected = schedCalSelected === dateStr;
    html += `<button type="button" class="cal-day${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}" onclick="selectSchedModalCalDate('${dateStr}', ${d})">${d}</button>`;
  }
  const total = firstDay + daysInMonth;
  const nextDays = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= nextDays; d++) {
    html += `<button type="button" class="cal-day other-month" disabled>${d}</button>`;
  }
  document.getElementById('schedCalDays').innerHTML = html;
}

function changeSchedModalCalMonth(dir) {
  schedCalMonth += dir;
  if (schedCalMonth > 11) { schedCalMonth = 0; schedCalYear++; }
  if (schedCalMonth < 0) { schedCalMonth = 11; schedCalYear--; }
  renderSchedModalCalendar();
}

function selectSchedModalCalDate(dateStr, d) {
  schedCalSelected = dateStr;
  const [y, m] = dateStr.split('-');
  document.getElementById('fDateLabel').textContent = `${y}/${m}/${String(d).padStart(2, '0')}`;
  document.getElementById('fDate').value = dateStr;
  document.getElementById('schedModalCalendar').classList.remove('open');
}

function selectSchedModalToday() {
  const today = new Date();
  schedCalYear = today.getFullYear();
  schedCalMonth = today.getMonth();
  const d = today.getDate();
  const dateStr = `${schedCalYear}-${String(schedCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  selectSchedModalCalDate(dateStr, d);
}

function clearSchedModalCalDate() {
  schedCalSelected = '';
  schedCalYear = new Date().getFullYear();
  schedCalMonth = new Date().getMonth();
  document.getElementById('fDateLabel').textContent = '選擇日期';
  document.getElementById('fDate').value = '';
  document.getElementById('schedModalCalendar').classList.remove('open');
}

document.addEventListener('click', function(e) {
  const wrapper = document.getElementById('schedCalendarWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('schedModalCalendar').classList.remove('open');
  }
});

// ── 假資料 ──
const staffOptions = [
  { id: 1, name: '林設計師' },
  { id: 2, name: '王設計師' },
  { id: 3, name: '陳助理' },
];

const schedules = [
  { id: 1, staffId: 1, staffName: '林設計師', date: '2025-05-05', startTime: '10:00', endTime: '19:00', isDayoff: false },
  { id: 2, staffId: 2, staffName: '王設計師', date: '2025-05-05', startTime: '10:00', endTime: '19:00', isDayoff: false },
  { id: 3, staffId: 3, staffName: '陳助理', date: '2025-05-05', startTime: '10:00', endTime: '18:00', isDayoff: false },
  { id: 4, staffId: 1, staffName: '林設計師', date: '2025-05-06', startTime: '', endTime: '', isDayoff: true },
  { id: 5, staffId: 2, staffName: '王設計師', date: '2025-05-06', startTime: '10:00', endTime: '19:00', isDayoff: false },
  { id: 6, staffId: 3, staffName: '陳助理', date: '2025-05-06', startTime: '10:00', endTime: '18:00', isDayoff: false },
  { id: 7, staffId: 1, staffName: '林設計師', date: '2025-05-07', startTime: '10:00', endTime: '19:00', isDayoff: false },
  { id: 8, staffId: 2, staffName: '王設計師', date: '2025-05-07', startTime: '', endTime: '', isDayoff: true },
  { id: 9, staffId: 3, staffName: '陳助理', date: '2025-05-07', startTime: '10:00', endTime: '18:00', isDayoff: false },
];

let currentWeekStart = getMonday(new Date());
let editingId = null;

// ── 取得週一 ──
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ── 取得一週日期 ──
function getWeekDates(monday) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// ── 格式化日期 ──
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function formatDateLabel(date) {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return `${date.getMonth() + 1}/${date.getDate()}（${days[date.getDay()]}）`;
}

// ── 渲染週曆 ──
function renderCalendar() {
  const weekDates = getWeekDates(currentWeekStart);
  const weekEnd = weekDates[6];

  document.getElementById('weekLabel').textContent =
    `${currentWeekStart.getFullYear()} 年 ${currentWeekStart.getMonth() + 1} 月 ${currentWeekStart.getDate()} 日 ～ ${weekEnd.getMonth() + 1} 月 ${weekEnd.getDate()} 日`;

  // 表頭
  const thead = document.getElementById('calendarHead');
  thead.innerHTML = `
    <tr>
      <th style="width:110px;">員工</th>
      ${weekDates.map(d => `
        <th style="text-align:center;font-size:0.72rem;letter-spacing:0.05em;padding:0.7rem 0.5rem;">
          ${formatDateLabel(d)}
        </th>
      `).join('')}
    </tr>
  `;

  // 內容
  const tbody = document.getElementById('calendarBody');
  tbody.innerHTML = staffOptions.map(staff => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:0.6rem;">
          <div style="width:28px;height:28px;border-radius:50%;background:var(--peach-cream);display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:var(--brown-dark);flex-shrink:0;">${staff.name.charAt(0)}</div>
          <span style="font-size:0.8rem;">${staff.name}</span>
        </div>
      </td>
      ${weekDates.map(d => {
        const dateStr = formatDate(d);
        const schedule = schedules.find(s => s.staffId === staff.id && s.date === dateStr);
        const isToday = formatDate(new Date()) === dateStr;

        if (!schedule) {
          return `
            <td style="text-align:center;${isToday ? 'background:rgba(178,144,121,0.05);' : ''}">
              <button class="add-schedule-btn" onclick="openAdd(${staff.id}, '${dateStr}')">+</button>
            </td>
          `;
        }

        if (schedule.isDayoff) {
          return `
            <td style="text-align:center;${isToday ? 'background:rgba(178,144,121,0.05);' : ''}">
              <div class="schedule-cell dayoff" onclick="openEdit(${schedule.id})">
                <span>休假</span>
              </div>
            </td>
          `;
        }

        return `
          <td style="text-align:center;${isToday ? 'background:rgba(178,144,121,0.05);' : ''}">
            <div class="schedule-cell work" onclick="openEdit(${schedule.id})">
              <span>${schedule.startTime}</span>
              <span style="font-size:0.65rem;color:var(--neutral);">～</span>
              <span>${schedule.endTime}</span>
            </div>
          </td>
        `;
      }).join('')}
    </tr>
  `).join('');
}

// ── 週切換 ──
document.getElementById('prevWeek').addEventListener('click', () => {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  renderCalendar();
});

document.getElementById('nextWeek').addEventListener('click', () => {
  currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  renderCalendar();
});

document.getElementById('todayBtn').addEventListener('click', () => {
  currentWeekStart = getMonday(new Date());
  renderCalendar();
});

// ── 新增班表 ──
function openAdd(staffId, date) {
  editingId = null;
  document.getElementById('modalTitle').textContent = '新增班表';
  document.getElementById('scheduleForm').reset();
  document.getElementById('fDate').value = date;
  const [y, m, d] = date.split('-');
  document.getElementById('fDateLabel').textContent = `${y}/${m}/${d}`;
  schedCalSelected = date;
  schedCalYear = parseInt(y);
  schedCalMonth = parseInt(m) - 1;
  document.getElementById('fStaff').value = staffId;
  const staff = staffOptions.find(s => s.id === staffId);
  if (staff) {
    document.getElementById('fStaffLabel').textContent = staff.name;
    document.querySelectorAll('#fStaffDropdown .custom-select-option').forEach(o => o.classList.remove('selected'));
    const opt = document.querySelector('#fStaffDropdown .custom-select-option[data-value="' + staffId + '"]');
    if (opt) opt.classList.add('selected');
  }
  setModalDropdown('fIsDayoffDropdown', 'false');
  setModalDropdown('fStartTimeDropdown', '10:00');
  setModalDropdown('fEndTimeDropdown', '19:00');
  toggleTimeFields(false);
  document.getElementById('modalOverlay').classList.add('show');
}

// ── 編輯班表 ──
function openEdit(id) {
  const s = schedules.find(s => s.id === id);
  if (!s) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = '編輯班表';
  document.getElementById('fDate').value = s.date;
  const [sy, sm, sd] = s.date.split('-');
  document.getElementById('fDateLabel').textContent = `${sy}/${sm}/${sd}`;
  schedCalSelected = s.date;
  schedCalYear = parseInt(sy);
  schedCalMonth = parseInt(sm) - 1;
  document.getElementById('fStaff').value = s.staffId;
  const staff = staffOptions.find(st => st.id === s.staffId);
  if (staff) {
    document.getElementById('fStaffLabel').textContent = staff.name;
    document.querySelectorAll('#fStaffDropdown .custom-select-option').forEach(o => o.classList.remove('selected'));
    const opt = document.querySelector('#fStaffDropdown .custom-select-option[data-value="' + s.staffId + '"]');
    if (opt) opt.classList.add('selected');
  }
  setModalDropdown('fIsDayoffDropdown', String(s.isDayoff));
  if (!s.isDayoff) {
    setModalDropdown('fStartTimeDropdown', s.startTime);
    setModalDropdown('fEndTimeDropdown', s.endTime);
  }
  toggleTimeFields(s.isDayoff);
  document.getElementById('modalOverlay').classList.add('show');
}

// ── 切換時間欄位顯示 ──
function toggleTimeFields(isDayoff) {
  const timeFields = document.getElementById('timeFields');
  timeFields.style.display = isDayoff ? 'none' : 'block';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}

// ── 儲存班表 ──
document.getElementById('scheduleForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const staffId = parseInt(document.getElementById('fStaff').value);
  const staff = staffOptions.find(s => s.id === staffId);
  const isDayoff = document.getElementById('fIsDayoff').value === 'true';

  const data = {
    staffId,
    staffName: staff.name,
    date: document.getElementById('fDate').value,
    startTime: isDayoff ? '' : document.getElementById('fStartTime').value,
    endTime: isDayoff ? '' : document.getElementById('fEndTime').value,
    isDayoff,
  };

  if (editingId) {
    const idx = schedules.findIndex(s => s.id === editingId);
    schedules[idx] = { ...schedules[idx], ...data };
    showToast('班表已更新');
  } else {
    // 檢查是否已存在
    const exists = schedules.find(s => s.staffId === data.staffId && s.date === data.date);
    if (exists) {
      showToast('此員工當日已有班表，請直接編輯');
      return;
    }
    const newId = Math.max(...schedules.map(s => s.id)) + 1;
    schedules.push({ id: newId, ...data });
    showToast('班表已新增');
  }

  closeModal();
  renderCalendar();
});

// ── 刪除班表 ──
function deleteSchedule() {
  if (!editingId) return;
  const s = schedules.find(s => s.id === editingId);
  document.getElementById('schedConfirmTitle').textContent = `確定要刪除「${s.staffName}」${s.date} 的班表？`;
  document.getElementById('schedConfirmOverlay').classList.add('show');
}

function closeSchedConfirm() {
  document.getElementById('schedConfirmOverlay').classList.remove('show');
}

document.getElementById('schedConfirmDeleteBtn').addEventListener('click', function() {
  const idx = schedules.findIndex(s => s.id === editingId);
  schedules.splice(idx, 1);
  closeSchedConfirm();
  closeModal();
  renderCalendar();
  showToast('班表已刪除');
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
  const staffList = document.getElementById('fStaffList');
  staffOptions.forEach(s => {
    const li = document.createElement('li');
    li.className = 'custom-select-option';
    li.dataset.value = s.id;
    li.textContent = s.name;
    staffList.appendChild(li);
  });

  renderCalendar();
});
