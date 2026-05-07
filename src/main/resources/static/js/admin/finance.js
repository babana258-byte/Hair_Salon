// ── 自訂支出類別（可新增/刪除）──
let expenseCategories = ['房租', '水電', '耗材', '薪資', '設備', '行銷', '雜支', '其他'];

const CATEGORY_COLORS = [
  '#B29079','#C1B6A4','#7A5C47','#4A3728',
  '#9B8070','#D4B8A0','#E1DACA','#EFE7DA',
  '#A08060','#8B7060','#6B5040','#BDA090',
];

// ── 收入假資料 ──
const revenueData = {
  '2025-01': { service: 85000,  product: 9200  },
  '2025-02': { service: 92000,  product: 11000 },
  '2025-03': { service: 98000,  product: 12500 },
  '2025-04': { service: 112000, product: 18300 },
  '2025-05': { service: 128000, product: 21400 },
  '2024-10': { service: 105000, product: 14000 },
  '2024-11': { service: 118000, product: 16500 },
  '2024-12': { service: 135000, product: 22000 },
};

// ── 支出假資料 ──
let expenses = [
  { id:1,  month:'2025-05', category:'房租',  name:'5月房租',     amount:25000, date:'2025-05-01', note:'' },
  { id:2,  month:'2025-05', category:'水電',  name:'5月水費',     amount:800,   date:'2025-05-05', note:'' },
  { id:3,  month:'2025-05', category:'水電',  name:'5月電費',     amount:3200,  date:'2025-05-05', note:'' },
  { id:4,  month:'2025-05', category:'耗材',  name:'染劑補貨',    amount:8500,  date:'2025-05-08', note:'Wella系列' },
  { id:5,  month:'2025-05', category:'薪資',  name:'5月員工薪資', amount:42000, date:'2025-05-31', note:'' },
  { id:6,  month:'2025-05', category:'雜支',  name:'清潔用品',    amount:600,   date:'2025-05-10', note:'' },
  { id:7,  month:'2025-04', category:'房租',  name:'4月房租',     amount:25000, date:'2025-04-01', note:'' },
  { id:8,  month:'2025-04', category:'水電',  name:'4月水電',     amount:4200,  date:'2025-04-05', note:'' },
  { id:9,  month:'2025-04', category:'耗材',  name:'染劑補貨',    amount:7200,  date:'2025-04-10', note:'' },
  { id:10, month:'2025-04', category:'薪資',  name:'4月員工薪資', amount:38000, date:'2025-04-30', note:'' },
  { id:11, month:'2025-03', category:'房租',  name:'3月房租',     amount:25000, date:'2025-03-01', note:'' },
  { id:12, month:'2025-03', category:'水電',  name:'3月水電',     amount:3900,  date:'2025-03-05', note:'' },
  { id:13, month:'2025-03', category:'耗材',  name:'染劑補貨',    amount:6800,  date:'2025-03-12', note:'' },
  { id:14, month:'2025-03', category:'薪資',  name:'3月員工薪資', amount:35000, date:'2025-03-31', note:'' },
  { id:15, month:'2025-02', category:'房租',  name:'2月房租',     amount:25000, date:'2025-02-01', note:'' },
  { id:16, month:'2025-02', category:'水電',  name:'2月水電',     amount:3500,  date:'2025-02-05', note:'' },
  { id:17, month:'2025-02', category:'薪資',  name:'2月員工薪資', amount:33000, date:'2025-02-28', note:'' },
  { id:18, month:'2025-01', category:'房租',  name:'1月房租',     amount:25000, date:'2025-01-01', note:'' },
  { id:19, month:'2025-01', category:'水電',  name:'1月水電',     amount:4100,  date:'2025-01-05', note:'' },
  { id:20, month:'2025-01', category:'薪資',  name:'1月員工薪資', amount:34000, date:'2025-01-31', note:'' },
];

// ── 狀態 ──
let viewMode    = 'month';   // month | quarter | year
let selectedYear  = 2025;
let selectedMonth = 5;
let selectedQ     = 2;
let editingExpenseId = null;

// ── 取得當前期間標籤 ──
function getPeriodLabel() {
  if (viewMode === 'month')   return `${selectedYear} 年 ${String(selectedMonth).padStart(2,'0')} 月`;
  if (viewMode === 'quarter') return `${selectedYear} 年 第 ${selectedQ} 季`;
  return `${selectedYear} 年`;
}

// ── 取得期間內的月份清單 ──
function getPeriodMonths() {
  if (viewMode === 'month')
    return [`${selectedYear}-${String(selectedMonth).padStart(2,'0')}`];
  if (viewMode === 'quarter') {
    const start = (selectedQ - 1) * 3 + 1;
    return [start, start+1, start+2].map(m => `${selectedYear}-${String(m).padStart(2,'0')}`);
  }
  return Array.from({length:12}, (_,i) => `${selectedYear}-${String(i+1).padStart(2,'0')}`);
}

// ── 收入加總 ──
function sumRevenue(months) {
  return months.reduce((acc, m) => {
    const r = revenueData[m] || {service:0, product:0};
    acc.service += r.service;
    acc.product += r.product;
    return acc;
  }, {service:0, product:0});
}

// ── 支出加總 ──
function sumExpenses(months) {
  return expenses.filter(e => months.includes(e.month));
}

// ── 上一期 ──
document.getElementById('prevPeriod').addEventListener('click', () => {
  navigate(-1); render();
});

// ── 下一期 ──
document.getElementById('nextPeriod').addEventListener('click', () => {
  navigate(1); render();
});

function navigate(dir) {
  if (viewMode === 'month') {
    selectedMonth += dir;
    if (selectedMonth > 12) { selectedMonth = 1;  selectedYear++; }
    if (selectedMonth < 1)  { selectedMonth = 12; selectedYear--; }
  } else if (viewMode === 'quarter') {
    selectedQ += dir;
    if (selectedQ > 4) { selectedQ = 1; selectedYear++; }
    if (selectedQ < 1) { selectedQ = 4; selectedYear--; }
  } else {
    selectedYear += dir;
  }
}

// ── 切換模式 ──
document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    viewMode = this.dataset.mode;
    render();
  });
});

// ── 主渲染 ──
function render() {
  document.getElementById('periodLabel').textContent = getPeriodLabel();
  const months  = getPeriodMonths();
  const rev     = sumRevenue(months);
  const expList = sumExpenses(months);
  const totalRev  = rev.service + rev.product;
  const totalExp  = expList.reduce((s,e) => s + e.amount, 0);
  const net       = totalRev - totalExp;

  document.getElementById('statRevenue').textContent = `NT$ ${totalRev.toLocaleString()}`;
  document.getElementById('statExpense').textContent = `NT$ ${totalExp.toLocaleString()}`;
  document.getElementById('statProfit').textContent  = `NT$ ${net.toLocaleString()}`;
  document.getElementById('statProfit').style.color  = net >= 0 ? 'var(--brown-deep)' : '#c0705a';
  document.getElementById('statMargin').textContent  = totalRev > 0 ? `${Math.round((net/totalRev)*100)}%` : '—';

  renderRevenueBar(rev, totalRev);
  renderExpensePie(expList);
  renderBarChart(months);
  renderExpenseTable(expList);
}

// ── 收入進度條 ──
function renderRevenueBar(rev, total) {
  const svcPct = total > 0 ? Math.round((rev.service/total)*100) : 0;
  document.getElementById('revService').textContent = `NT$ ${rev.service.toLocaleString()}`;
  document.getElementById('revProduct').textContent = `NT$ ${rev.product.toLocaleString()}`;
  document.getElementById('revSvcPct').style.width   = `${svcPct}%`;
  document.getElementById('revPrdPct').style.width   = `${100-svcPct}%`;
  document.getElementById('revSvcLabel').textContent = `服務 ${svcPct}%`;
  document.getElementById('revPrdLabel').textContent = `商品 ${100-svcPct}%`;
}

// ── 支出圓餅圖 ──
function renderExpensePie(expList) {
  const grouped = {};
  expList.forEach(e => { grouped[e.category] = (grouped[e.category]||0) + e.amount; });
  const total = Object.values(grouped).reduce((s,v) => s+v, 0);

  if (total === 0) {
    document.getElementById('expenseChart').innerHTML =
      '<text x="100" y="108" text-anchor="middle" font-size="11" fill="#C1B6A4" font-family="Noto Serif TC">本期無支出</text>';
    document.getElementById('expenseLegend').innerHTML = '';
    return;
  }

  let angle = -Math.PI/2;
  const cx=100, cy=100, r=75;
  let paths='', legend='';

  Object.entries(grouped).forEach(([cat, amt], i) => {
    const pct   = amt / total;
    const sweep = pct * 2 * Math.PI;
    const end   = angle + sweep;
    const x1 = cx + r*Math.cos(angle), y1 = cy + r*Math.sin(angle);
    const x2 = cx + r*Math.cos(end),   y2 = cy + r*Math.sin(end);
    const large = sweep > Math.PI ? 1 : 0;
    const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];

    paths += `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${color}" opacity="0.9"/>`;
    legend += `
      <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;">
        <span style="width:10px;height:10px;border-radius:2px;background:${color};flex-shrink:0;"></span>
        <span style="color:var(--text-mid);flex:1;">${cat}</span>
        <span style="color:var(--brandy-rose);">NT$ ${amt.toLocaleString()}</span>
        <span style="color:var(--neutral);font-size:0.7rem;">${Math.round(pct*100)}%</span>
      </div>`;
    angle = end;
  });

  paths += `<circle cx="${cx}" cy="${cy}" r="42" fill="white"/>`;
  paths += `<text x="${cx}" y="${cy-5}" text-anchor="middle" font-size="10" fill="#6B5040" font-family="Noto Serif TC">總支出</text>`;
  paths += `<text x="${cx}" y="${cy+10}" text-anchor="middle" font-size="11" fill="#4A3728" font-family="Noto Serif TC">${Math.round(total/1000)}k</text>`;

  document.getElementById('expenseChart').innerHTML = paths;
  document.getElementById('expenseLegend').innerHTML = legend;
}

// ── 收支長條圖 ──
function renderBarChart(months) {
  const container = document.getElementById('barChart');
  const maxVal = Math.max(...months.map(m => {
    const r = revenueData[m] || {service:0,product:0};
    const e = expenses.filter(ex => ex.month===m).reduce((s,ex) => s+ex.amount, 0);
    return Math.max(r.service+r.product, e);
  }), 1);

  const labels = {
    month: m => `${parseInt(m.split('-')[1])}月`,
    quarter: m => `${parseInt(m.split('-')[1])}月`,
    year: m => `${parseInt(m.split('-')[1])}月`,
  };

  container.innerHTML = months.map(m => {
    const r   = revenueData[m] || {service:0,product:0};
    const rev = r.service + r.product;
    const exp = expenses.filter(ex => ex.month===m).reduce((s,ex) => s+ex.amount, 0);
    const revH = Math.round((rev/maxVal)*120);
    const expH = Math.round((exp/maxVal)*120);
    const label = labels[viewMode](m);
    return `
      <div style="display:flex;flex-direction:column;align-items:center;gap:0.3rem;flex:1;min-width:0;">
        <div style="display:flex;gap:3px;align-items:flex-end;height:120px;">
          <div title="收入 NT$${rev.toLocaleString()}" style="width:14px;background:var(--brandy-rose);height:${revH}px;border-radius:3px 3px 0 0;opacity:0.85;cursor:pointer;transition:opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.85"></div>
          <div title="支出 NT$${exp.toLocaleString()}" style="width:14px;background:var(--chalk-beige);height:${expH}px;border-radius:3px 3px 0 0;cursor:pointer;transition:opacity 0.2s;" onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1"></div>
        </div>
        <div style="font-size:0.68rem;color:var(--neutral);letter-spacing:0.05em;">${label}</div>
      </div>`;
  }).join('');
}

// ── 支出明細表 ──
function renderExpenseTable(expList) {
  const tbody = document.getElementById('expenseTableBody');
  if (expList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--neutral);padding:2rem;font-style:italic;">本期無支出記錄</td></tr>`;
    return;
  }
  const sorted = [...expList].sort((a,b) => a.date.localeCompare(b.date));
  tbody.innerHTML = sorted.map(e => `
    <tr>
      <td>${e.date}</td>
      <td><span class="badge badge-pending">${e.category}</span></td>
      <td>${e.name}</td>
      <td style="font-size:0.88rem;color:#c0705a;font-weight:500;">NT$ ${e.amount.toLocaleString()}</td>
      <td style="color:var(--neutral);font-size:0.78rem;">${e.note||'—'}</td>
      <td style="text-align:center;">
        <div style="display:flex;gap:0.3rem;justify-content:center;">
          <button class="btn-icon" onclick="openEditExpense(${e.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"/></svg>
          </button>
          <button class="btn-icon danger" onclick="deleteExpense(${e.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
          </button>
        </div>
      </td>
    </tr>`).join('');
}

// ── 填入類別選單 ──
function refreshCategorySelects() {
  renderCategoryDropdown(document.getElementById('eCategory').value);
  renderCategoryList();
}

function initCategoryDropdownEvents() {
  const wrapper = document.getElementById('eCategoryWrapper');
  document.getElementById('eCategoryBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    const opening = !wrapper.classList.contains('open');
    closeAllExpenseDropdowns();
    if (opening) wrapper.classList.add('open');
  });
}

function renderCategoryDropdown(currentVal) {
  document.getElementById('eCategoryList').innerHTML = expenseCategories.map(c =>
    `<div class="custom-select-option${c === currentVal ? ' selected' : ''}" onclick="selectExpenseCategory('${c}')">${c}</div>`
  ).join('');
  const lbl = document.getElementById('eCategoryLabel');
  if (currentVal && expenseCategories.includes(currentVal)) {
    lbl.textContent = currentVal; lbl.style.color = 'var(--text-dark)';
  } else {
    lbl.textContent = '請選擇類別'; lbl.style.color = 'var(--neutral)';
  }
  document.getElementById('eCategory').value = currentVal || '';
}

function selectExpenseCategory(val) {
  document.getElementById('eCategory').value = val;
  const lbl = document.getElementById('eCategoryLabel');
  lbl.textContent = val; lbl.style.color = 'var(--text-dark)';
  document.getElementById('eCategoryWrapper').classList.remove('open');
  document.querySelectorAll('#eCategoryList .custom-select-option').forEach(opt => {
    opt.classList.toggle('selected', opt.textContent.trim() === val);
  });
}

// ── 關閉所有選單/日曆 ──
function closeAllExpenseDropdowns() {
  document.getElementById('eMonthWrapper').classList.remove('open');
  document.getElementById('eCategoryWrapper').classList.remove('open');
  document.getElementById('eDateCalendar').classList.remove('open');
}

// ── 所屬月份客製選單 ──
function initMonthDropdownEvents() {
  const wrapper = document.getElementById('eMonthWrapper');
  document.getElementById('eMonthBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    const opening = !wrapper.classList.contains('open');
    closeAllExpenseDropdowns();
    if (opening) wrapper.classList.add('open');
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#eMonthWrapper') &&
        !e.target.closest('#eCategoryWrapper') &&
        !e.target.closest('#eDateBtn') &&
        !e.target.closest('#eDateCalendar')) {
      closeAllExpenseDropdowns();
    }
  });
}

function initExpenseMonthSelect(currentVal) {
  const now = new Date();
  const months = [];
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const val  = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const text = `${d.getFullYear()} 年 ${String(d.getMonth()+1).padStart(2,'0')} 月`;
    months.push({ val, text });
  }
  document.getElementById('eMonthList').innerHTML = months.map(m =>
    `<div class="custom-select-option${m.val === currentVal ? ' selected' : ''}" onclick="selectExpenseMonth('${m.val}','${m.text}')">${m.text}</div>`
  ).join('');
  const cur = months.find(m => m.val === currentVal);
  const lbl = document.getElementById('eMonthLabel');
  if (cur) { lbl.textContent = cur.text; lbl.style.color = 'var(--text-dark)'; }
  else     { lbl.textContent = '請選擇月份'; lbl.style.color = 'var(--neutral)'; }
  document.getElementById('eMonth').value = currentVal || '';
}

function selectExpenseMonth(val, text) {
  document.getElementById('eMonth').value = val;
  const lbl = document.getElementById('eMonthLabel');
  lbl.textContent = text;
  lbl.style.color = 'var(--text-dark)';
  document.getElementById('eMonthWrapper').classList.remove('open');
  document.querySelectorAll('#eMonthList .custom-select-option').forEach(opt => {
    opt.classList.toggle('selected', opt.textContent.trim() === text.trim());
  });
}

// ── 支出日期選擇器 ──
let _eDateYear, _eDateMonth;

function initDatePicker() {
  const btn = document.getElementById('eDateBtn');
  const cal = document.getElementById('eDateCalendar');

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    const opening = !cal.classList.contains('open');
    closeAllExpenseDropdowns();
    if (!opening) return;
    const curVal = document.getElementById('eDate').value;
    if (curVal) {
      const parts = curVal.split('-');
      _eDateYear  = parseInt(parts[0]);
      _eDateMonth = parseInt(parts[1]);
    } else {
      const now = new Date();
      _eDateYear  = now.getFullYear();
      _eDateMonth = now.getMonth() + 1;
    }
    renderDatePicker();
    cal.classList.add('open');
  });
}

function renderDatePicker() {
  const cal         = document.getElementById('eDateCalendar');
  const selectedVal = document.getElementById('eDate').value;
  const todayStr    = new Date().toISOString().slice(0, 10);
  const firstDay    = new Date(_eDateYear, _eDateMonth - 1, 1).getDay();
  const daysInMonth = new Date(_eDateYear, _eDateMonth, 0).getDate();

  let daysHtml = '';
  for (let i = 0; i < firstDay; i++) {
    daysHtml += '<span></span>';
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${_eDateYear}-${String(_eDateMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const cls = ['cal-day', ds === todayStr ? 'today' : '', ds === selectedVal ? 'selected' : ''].filter(Boolean).join(' ');
    daysHtml += `<button type="button" class="${cls}" onclick="selectExpenseDate('${ds}')">${d}</button>`;
  }

  cal.innerHTML = `
    <div class="cal-header">
      <button type="button" class="cal-nav" onclick="shiftExpenseMonth(-1)">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
      </button>
      <span class="cal-month-label">${_eDateYear} 年 ${String(_eDateMonth).padStart(2,'0')} 月</span>
      <button type="button" class="cal-nav" onclick="shiftExpenseMonth(1)">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
      </button>
    </div>
    <div class="cal-weekdays"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>
    <div class="cal-days">${daysHtml}</div>
    <div class="cal-footer">
      <button type="button" class="cal-clear-btn" onclick="clearExpenseDate()">清除</button>
      <button type="button" class="cal-today-btn" onclick="selectExpenseDate('${todayStr}')">今天</button>
    </div>`;
}

function shiftExpenseMonth(dir) {
  _eDateMonth += dir;
  if (_eDateMonth > 12) { _eDateMonth = 1;  _eDateYear++; }
  if (_eDateMonth < 1)  { _eDateMonth = 12; _eDateYear--; }
  renderDatePicker();
}

function selectExpenseDate(dateStr) {
  document.getElementById('eDate').value = dateStr;
  const [y, m, d] = dateStr.split('-');
  const lbl = document.getElementById('eDateLabel');
  lbl.textContent = `${y}年${m}月${d}日`;
  lbl.style.color = 'var(--text-dark)';
  document.getElementById('eDateCalendar').classList.remove('open');
  renderDatePicker();
}

function clearExpenseDate() {
  document.getElementById('eDate').value = '';
  const lbl = document.getElementById('eDateLabel');
  lbl.textContent = '請選擇日期';
  lbl.style.color = 'var(--neutral)';
  document.getElementById('eDateCalendar').classList.remove('open');
}

function setExpenseDateDisplay(dateStr) {
  document.getElementById('eDate').value = dateStr;
  if (dateStr) {
    const [y, m, d] = dateStr.split('-');
    const lbl = document.getElementById('eDateLabel');
    lbl.textContent = `${y}年${m}月${d}日`;
    lbl.style.color = 'var(--text-dark)';
    _eDateYear  = parseInt(y);
    _eDateMonth = parseInt(m);
  } else {
    clearExpenseDate();
  }
}

// ── 新增支出 ──
function openAddExpense() {
  editingExpenseId = null;
  document.getElementById('expenseModalTitle').textContent = '新增支出';
  document.getElementById('expenseForm').reset();
  const m = getPeriodMonths()[0];
  initExpenseMonthSelect(m);
  renderCategoryDropdown('');
  setExpenseDateDisplay(m + '-01');
  document.getElementById('expenseModalOverlay').classList.add('show');
}

function openEditExpense(id) {
  const e = expenses.find(e => e.id===id);
  if (!e) return;
  editingExpenseId = id;
  document.getElementById('expenseModalTitle').textContent = '編輯支出';
  initExpenseMonthSelect(e.month);
  renderCategoryDropdown(e.category);
  document.getElementById('eName').value   = e.name;
  document.getElementById('eAmount').value = e.amount;
  setExpenseDateDisplay(e.date);
  document.getElementById('eNote').value   = e.note;
  document.getElementById('expenseModalOverlay').classList.add('show');
}

function closeExpenseModal() {
  document.getElementById('expenseModalOverlay').classList.remove('show');
}

document.getElementById('expenseForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const monthVal    = document.getElementById('eMonth').value;
  if (!monthVal) { showToast('請選擇所屬月份'); return; }
  const categoryVal = document.getElementById('eCategory').value;
  if (!categoryVal) { showToast('請選擇支出類別'); return; }
  const dateVal = document.getElementById('eDate').value;
  if (!dateVal) { showToast('請選擇支出日期'); return; }
  const data = {
    month:    document.getElementById('eMonth').value,
    category: document.getElementById('eCategory').value,
    name:     document.getElementById('eName').value,
    amount:   parseInt(document.getElementById('eAmount').value),
    date:     dateVal,
    note:     document.getElementById('eNote').value,
  };
  if (editingExpenseId) {
    const idx = expenses.findIndex(e => e.id===editingExpenseId);
    expenses[idx] = { ...expenses[idx], ...data };
    showToast('支出已更新');
  } else {
    expenses.push({ id: Math.max(...expenses.map(e=>e.id),0)+1, ...data });
    showToast('支出已新增');
  }
  closeExpenseModal();
  render();
});

function deleteExpense(id) {
  if (!confirm('確定要刪除此筆支出？')) return;
  expenses = expenses.filter(e => e.id!==id);
  render();
  showToast('支出已刪除');
}

// ── 類別管理 Modal ──
function openCatModal() {
  renderCategoryList();
  document.getElementById('catModalOverlay').classList.add('show');
}

function closeCatModal() {
  document.getElementById('catModalOverlay').classList.remove('show');
}

function renderCategoryList() {
  document.getElementById('categoryList').innerHTML = expenseCategories.map((c,i) => `
    <div style="display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0;border-bottom:1px solid var(--chalk-beige);">
      <span style="width:10px;height:10px;border-radius:2px;background:${CATEGORY_COLORS[i%CATEGORY_COLORS.length]};flex-shrink:0;"></span>
      <span style="flex:1;font-size:0.85rem;color:var(--text-dark);">${c}</span>
      <button class="btn-icon danger" onclick="deleteCategory('${c}')">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" width="15" height="15"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>`).join('');
}

document.getElementById('addCategoryBtn').addEventListener('click', function () {
  const input = document.getElementById('newCategoryInput');
  const val = input.value.trim();
  if (!val) return;
  if (expenseCategories.includes(val)) { showToast('類別已存在'); return; }
  expenseCategories.push(val);
  input.value = '';
  refreshCategorySelects();
  showToast(`已新增類別「${val}」`);
});

function deleteCategory(cat) {
  const inUse = expenses.some(e => e.category === cat);
  if (inUse) { showToast(`「${cat}」有支出記錄，無法刪除`); return; }
  expenseCategories = expenseCategories.filter(c => c !== cat);
  refreshCategorySelects();
  showToast(`已刪除類別「${cat}」`);
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
  refreshCategorySelects();
  initMonthDropdownEvents();
  initCategoryDropdownEvents();
  initDatePicker();
  render();
});
