// ── 假資料 ──
const staffList = [
  { id: 1, name: '林設計師', title: '設計師' },
  { id: 2, name: '王設計師', title: '設計師' },
  { id: 3, name: '陳助理',   title: '助理' },
];

const serviceRecords = [
  { id: 1,  staffId: 1, customer: '王小明', service: '縮毛矯正', amount: 3500, date: '2025-05-04' },
  { id: 2,  staffId: 2, customer: '李小華', service: '線條染',   amount: 2500, date: '2025-05-04' },
  { id: 3,  staffId: 1, customer: '陳小美', service: '剪髮',     amount: 500,  date: '2025-05-04' },
  { id: 4,  staffId: 2, customer: '張大偉', service: '燙髮',     amount: 2000, date: '2025-05-05' },
  { id: 5,  staffId: 1, customer: '林小芳', service: '護髮療程', amount: 800,  date: '2025-05-06' },
  { id: 6,  staffId: 3, customer: '黃小玲', service: '頭皮養護', amount: 1200, date: '2025-05-06' },
  { id: 7,  staffId: 1, customer: '陳小美', service: '染髮',     amount: 1500, date: '2025-05-10' },
  { id: 8,  staffId: 2, customer: '王小明', service: '剪髮',     amount: 500,  date: '2025-05-12' },
  { id: 9,  staffId: 1, customer: '張大偉', service: '縮毛矯正', amount: 3500, date: '2025-05-15' },
  { id: 10, staffId: 2, customer: '林小芳', service: '護髮療程', amount: 800,  date: '2025-05-18' },
];

const productSales = [
  { id: 1, staffId: 1, customer: '王小明', product: '摩洛哥堅果修護油', amount: 1480, isPromo: false, date: '2025-05-04' },
  { id: 2, staffId: 2, customer: '李小華', product: '絲滑修復洗髮露',   amount: 800,  isPromo: true,  date: '2025-05-04' },
  { id: 3, staffId: 1, customer: '林小芳', product: '水潤絲絨髮膜',     amount: 1280, isPromo: false, date: '2025-05-06' },
  { id: 4, staffId: 2, customer: '陳小美', product: '塑型海鹽噴霧',     amount: 750,  isPromo: true,  date: '2025-05-12' },
  { id: 5, staffId: 1, customer: '張大偉', product: '頭皮養護精華',     amount: 1680, isPromo: false, date: '2025-05-15' },
];

// ── 抽成設定管理 ──
const DEFAULT_COMMISSION = { service: 50, productNormal: 20, productPromo: 10 };
const COMMISSION_KEY = 'musue_salary_commission';

function loadCommissions() {
  try {
    const saved = JSON.parse(localStorage.getItem(COMMISSION_KEY) || '{}');
    staffList.forEach(staff => {
      const c = saved[staff.id] || DEFAULT_COMMISSION;
      staff.commission = {
        service:       c.service       / 100,
        productNormal: c.productNormal / 100,
        productPromo:  c.productPromo  / 100,
      };
    });
  } catch (e) {
    staffList.forEach(staff => {
      staff.commission = {
        service:       DEFAULT_COMMISSION.service       / 100,
        productNormal: DEFAULT_COMMISSION.productNormal / 100,
        productPromo:  DEFAULT_COMMISSION.productPromo  / 100,
      };
    });
  }
}

function persistCommissions() {
  const data = {};
  staffList.forEach(staff => {
    data[staff.id] = {
      service:       Math.round(staff.commission.service       * 100),
      productNormal: Math.round(staff.commission.productNormal * 100),
      productPromo:  Math.round(staff.commission.productPromo  * 100),
    };
  });
  localStorage.setItem(COMMISSION_KEY, JSON.stringify(data));
}

const _initNow = new Date();
let selectedMonth = `${_initNow.getFullYear()}-${String(_initNow.getMonth()+1).padStart(2,'0')}`;
let selectedStaffId = null;
let _commEditStaffId = null;

// ── 初始化月份選單 ──
function initMonthPicker() {
  const now = new Date();
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const label = `${d.getFullYear()} 年 ${String(d.getMonth() + 1).padStart(2, '0')} 月`;
    months.push({ val, label });
  }

  const list = document.getElementById('monthPickerList');
  list.innerHTML = months.map(m =>
    `<div class="custom-select-option ${m.val === selectedMonth ? 'selected' : ''}" onclick="selectSalaryMonth('${m.val}','${m.label}')">${m.label}</div>`
  ).join('');

  const current = months.find(m => m.val === selectedMonth);
  if (current) document.getElementById('monthPickerLabel').textContent = current.label;

  document.getElementById('monthPickerBtn').addEventListener('click', function (e) {
    e.stopPropagation();
    document.getElementById('monthPickerWrapper').classList.toggle('open');
  });

  document.addEventListener('click', function () {
    document.getElementById('monthPickerWrapper').classList.remove('open');
  });
}

function selectSalaryMonth(val, label) {
  selectedMonth = val;
  document.getElementById('monthPickerLabel').textContent = label;
  document.getElementById('monthPickerWrapper').classList.remove('open');
  document.querySelectorAll('#monthPickerList .custom-select-option').forEach(opt => {
    opt.classList.toggle('selected', opt.textContent.trim() === label);
  });
  renderOverview();
  if (selectedStaffId) renderDetail(selectedStaffId);
}

// ── 計算單一員工薪資 ──
function calcSalary(staffId, month) {
  const staff = staffList.find(s => s.id === staffId);
  const comm  = staff.commission;

  const svcRecords = serviceRecords.filter(r => r.staffId === staffId && r.date.startsWith(month));
  const prdRecords = productSales.filter(r => r.staffId === staffId && r.date.startsWith(month));

  const svcTotal      = svcRecords.reduce((s, r) => s + r.amount, 0);
  const svcComm       = Math.round(svcTotal * comm.service);

  const prdNormal     = prdRecords.filter(r => !r.isPromo);
  const prdPromo      = prdRecords.filter(r =>  r.isPromo);
  const prdNormTotal  = prdNormal.reduce((s, r) => s + r.amount, 0);
  const prdPromoTotal = prdPromo.reduce((s, r) => s + r.amount, 0);
  const prdComm       = Math.round(prdNormTotal * comm.productNormal + prdPromoTotal * comm.productPromo);

  return { svcRecords, prdNormal, prdPromo, svcTotal, svcComm, prdNormTotal, prdPromoTotal, prdComm, total: svcComm + prdComm, comm };
}

// ── 渲染月薪總覽卡片 ──
function renderOverview() {
  const container = document.getElementById('overviewCards');
  const [year, month] = selectedMonth.split('-');
  document.getElementById('monthTitle').textContent = `${year} 年 ${month} 月 薪資總覽`;

  let totalAll = 0;
  container.innerHTML = staffList.map(staff => {
    const cal  = calcSalary(staff.id, selectedMonth);
    const comm = staff.commission;
    totalAll += cal.total;
    const pct = `服務 ${Math.round(comm.service * 100)}% ／ 原價 ${Math.round(comm.productNormal * 100)}% ／ 活動 ${Math.round(comm.productPromo * 100)}%`;
    return `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="salary-card ${selectedStaffId === staff.id ? 'selected' : ''}" onclick="renderDetail(${staff.id})">
          <div class="salary-card-top">
            <div style="display:flex;align-items:center;gap:0.8rem;">
              <div class="staff-avatar">${staff.name.charAt(0)}</div>
              <div>
                <div style="font-size:0.88rem;color:var(--text-dark);">${staff.name}</div>
                <div style="font-size:0.72rem;color:var(--neutral);">${staff.title}</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:0.3rem;">
              <button class="btn-icon" onclick="event.stopPropagation();openCommissionModal(${staff.id})" title="設定抽成" style="width:28px;height:28px;">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="color:var(--neutral);flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
            </div>
          </div>
          <div class="salary-card-body">
            <div class="salary-row" style="font-size:0.7rem;opacity:0.65;margin-bottom:0.15rem;">
              <span>${pct}</span>
            </div>
            <div class="salary-row">
              <span>服務抽成</span>
              <span>NT$ ${cal.svcComm.toLocaleString()}</span>
            </div>
            <div class="salary-row">
              <span>商品抽成</span>
              <span>NT$ ${cal.prdComm.toLocaleString()}</span>
            </div>
            <div class="salary-total-row">
              <span>本月薪資</span>
              <span>NT$ ${cal.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('totalSalary').textContent = `NT$ ${totalAll.toLocaleString()}`;
  document.getElementById('totalStaff').textContent  = `${staffList.length} 位`;
}

// ── 渲染薪資明細 ──
function renderDetail(staffId) {
  selectedStaffId = staffId;
  const staff = staffList.find(s => s.id === staffId);
  const cal   = calcSalary(staffId, selectedMonth);
  const comm  = cal.comm;
  const [year, month] = selectedMonth.split('-');

  document.getElementById('detailPanel').style.display = 'block';
  document.getElementById('detailName').textContent = `${staff.name} ‧ ${year}年${month}月 薪資明細`;

  // 服務明細
  const svcHtml = cal.svcRecords.length === 0
    ? '<tr><td colspan="4" style="text-align:center;color:var(--neutral);padding:1rem;font-style:italic;">本月無服務記錄</td></tr>'
    : cal.svcRecords.map(r => `
        <tr>
          <td>${r.date}</td><td>${r.customer}</td><td>${r.service}</td>
          <td style="text-align:right;">NT$ ${r.amount.toLocaleString()}</td>
        </tr>`).join('');

  document.getElementById('svcTableBody').innerHTML = svcHtml;
  document.getElementById('svcTotal').textContent   = `NT$ ${cal.svcTotal.toLocaleString()}`;
  document.getElementById('svcComm').textContent    = `NT$ ${cal.svcComm.toLocaleString()}`;
  document.getElementById('svcRate').textContent    = `（× ${Math.round(comm.service * 100)}%）`;

  // 商品明細
  const allPrd = [
    ...cal.prdNormal.map(r => ({...r, type: '原價'})),
    ...cal.prdPromo.map(r =>  ({...r, type: '活動價'})),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const prdHtml = allPrd.length === 0
    ? '<tr><td colspan="5" style="text-align:center;color:var(--neutral);padding:1rem;font-style:italic;">本月無商品銷售</td></tr>'
    : allPrd.map(r => `
        <tr>
          <td>${r.date}</td><td>${r.customer}</td><td>${r.product}</td>
          <td><span class="badge ${r.type === '原價' ? 'badge-confirmed' : 'badge-pending'}">${r.type}</span></td>
          <td style="text-align:right;">NT$ ${r.amount.toLocaleString()}</td>
        </tr>`).join('');

  document.getElementById('prdTableBody').innerHTML  = prdHtml;
  document.getElementById('prdNormTotal').textContent  = `NT$ ${cal.prdNormTotal.toLocaleString()}`;
  document.getElementById('prdPromoTotal').textContent = `NT$ ${cal.prdPromoTotal.toLocaleString()}`;
  document.getElementById('prdComm').textContent       = `NT$ ${cal.prdComm.toLocaleString()}`;

  // 動態更新百分比標籤
  document.getElementById('prdNormLabel').textContent  = `原價銷售總計（× ${Math.round(comm.productNormal * 100)}%）`;
  document.getElementById('prdPromoLabel').textContent = `活動價銷售總計（× ${Math.round(comm.productPromo  * 100)}%）`;
  document.getElementById('sumSvcLabel').textContent   = `服務抽成（${Math.round(comm.service * 100)}%）`;
  document.getElementById('sumPrdLabel').textContent   = `商品抽成（原價 ${Math.round(comm.productNormal * 100)}% / 活動 ${Math.round(comm.productPromo * 100)}%）`;

  document.getElementById('sumSvcComm').textContent = `NT$ ${cal.svcComm.toLocaleString()}`;
  document.getElementById('sumPrdComm').textContent = `NT$ ${cal.prdComm.toLocaleString()}`;
  document.getElementById('sumTotal').textContent   = `NT$ ${cal.total.toLocaleString()}`;

  renderOverview();
}

// ── 抽成設定 Modal ──
function openCommissionModal(staffId) {
  _commEditStaffId = staffId;
  const staff = staffList.find(s => s.id === staffId);
  document.getElementById('commissionModalTitle').textContent         = `${staff.name} ‧ 抽成比例設定`;
  document.getElementById('cService').value       = Math.round(staff.commission.service       * 100);
  document.getElementById('cProductNormal').value = Math.round(staff.commission.productNormal * 100);
  document.getElementById('cProductPromo').value  = Math.round(staff.commission.productPromo  * 100);
  document.getElementById('commissionModalOverlay').classList.add('show');
}

function closeCommissionModal() {
  _commEditStaffId = null;
  document.getElementById('commissionModalOverlay').classList.remove('show');
}

document.getElementById('commissionForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const staffId = _commEditStaffId;
  const staff   = staffList.find(s => s.id === staffId);
  staff.commission = {
    service:       parseInt(document.getElementById('cService').value)       / 100,
    productNormal: parseInt(document.getElementById('cProductNormal').value) / 100,
    productPromo:  parseInt(document.getElementById('cProductPromo').value)  / 100,
  };
  persistCommissions();
  closeCommissionModal();
  renderOverview();
  if (selectedStaffId === staffId) renderDetail(staffId);
  showToast(`已更新 ${staff.name} 的抽成設定`);
});

// ── 列印薪資單 ──
document.getElementById('printBtn').addEventListener('click', () => window.print());

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── 初始化 ──
document.addEventListener('DOMContentLoaded', function () {
  loadCommissions();
  initMonthPicker();
  renderOverview();
});
