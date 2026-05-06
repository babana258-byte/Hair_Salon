// ── 工具列自訂下拉 ──
function toggleOrderPaidDropdown() {
  document.getElementById('orderPaidDropdown').classList.toggle('open');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('#orderPaidDropdown')) document.getElementById('orderPaidDropdown').classList.remove('open');
});

document.querySelectorAll('#orderPaidList .custom-select-option').forEach(function(opt) {
  opt.addEventListener('click', function() {
    document.getElementById('paidFilter').value = opt.dataset.value;
    document.getElementById('orderPaidLabel').textContent = opt.textContent.trim();
    document.querySelectorAll('#orderPaidList .custom-select-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    document.getElementById('orderPaidDropdown').classList.remove('open');
    applyFilter();
  });
});

// ── 假資料 ──
const orders = [
  {
    id: 1,
    orderNo: 'MS20250504001',
    customer: '王小明',
    phone: '0912-345-678',
    address: '台中市西區中港路一段100號3樓',
    items: [
      { name: '純淨摩洛哥堅果修護油', qty: 1, price: 1480 },
      { name: '絲滑修復洗髮露', qty: 2, price: 980 },
    ],
    total: 3440,
    paymentMethod: '貨到付款',
    isPaid: false,
    status: '待確認',
    notes: '',
    createdAt: '2025-05-04 14:32',
  },
  {
    id: 2,
    orderNo: 'MS20250503002',
    customer: '李小華',
    phone: '0923-456-789',
    address: '台北市信義區松仁路200號',
    items: [
      { name: '水潤絲絨髮膜', qty: 1, price: 1280 },
    ],
    total: 1280,
    paymentMethod: 'Line Pay',
    isPaid: true,
    status: '已出貨',
    notes: '',
    createdAt: '2025-05-03 10:15',
  },
  {
    id: 3,
    orderNo: 'MS20250502003',
    customer: '陳小美',
    phone: '0934-567-890',
    address: '新北市板橋區文化路一段50號',
    items: [
      { name: '塑型海鹽噴霧', qty: 1, price: 880 },
      { name: '純淨摩洛哥堅果修護油', qty: 1, price: 1480 },
    ],
    total: 2360,
    paymentMethod: '刷卡',
    isPaid: true,
    status: '已完成',
    notes: '請放置管理室',
    createdAt: '2025-05-02 16:48',
  },
  {
    id: 4,
    orderNo: 'MS20250501004',
    customer: '張大偉',
    phone: '0945-678-901',
    address: '台中市北區學士路80號',
    items: [
      { name: '絲滑修復洗髮露', qty: 1, price: 980 },
    ],
    total: 980,
    paymentMethod: '貨到付款',
    isPaid: false,
    status: '備貨中',
    notes: '',
    createdAt: '2025-05-01 09:20',
  },
  {
    id: 5,
    orderNo: 'MS20250430005',
    customer: '林小芬',
    phone: '0956-789-012',
    address: '高雄市苓雅區中正一路300號',
    items: [
      { name: '水潤絲絨髮膜', qty: 2, price: 1280 },
    ],
    total: 2560,
    paymentMethod: 'Line Pay',
    isPaid: true,
    status: '已取消',
    notes: '',
    createdAt: '2025-04-30 11:05',
  },
];

const statusFlow = ['待確認', '備貨中', '已出貨', '已送達', '已完成'];
const terminalStatuses = ['已完成', '已取消'];

const statusBadge = {
  '待確認': 'badge-pending',
  '備貨中': 'badge-confirmed',
  '已出貨': 'badge-active',
  '已送達': 'badge-completed',
  '已完成': 'badge-completed',
  '已取消': 'badge-cancelled',
};

let filtered = [...orders];
let viewingId = null;
let currentStatusTab = '';

// ── 次導覽列 Tabs ──
document.querySelectorAll('.status-tab[data-status]').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.status-tab[data-status]').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    currentStatusTab = this.dataset.status;
    applyFilter();
  });
});

// ── 渲染列表 ──
function renderTable() {
  const tbody = document.getElementById('orderTableBody');
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--neutral);padding:2rem;font-style:italic;">查無訂單資料</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(o => {
    const canAdvance = statusFlow.includes(o.status) && statusFlow.indexOf(o.status) < statusFlow.length - 1;
    const canCancel = !terminalStatuses.includes(o.status);
    return `
    <tr>
      <td style="font-size:0.78rem;color:var(--brandy-rose);letter-spacing:0.05em;">${o.orderNo}</td>
      <td>
        <div style="font-size:0.85rem;">${o.customer}</div>
        <div style="font-size:0.72rem;color:var(--neutral);">${o.phone}</div>
      </td>
      <td style="font-size:0.78rem;color:var(--neutral);max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
        ${o.items.map(i => i.name).join('、')}
      </td>
      <td style="font-size:0.88rem;color:var(--brandy-rose);font-weight:500;">NT$ ${o.total.toLocaleString()}</td>
      <td style="font-size:0.8rem;">${o.paymentMethod}</td>
      <td>
        <span class="badge ${o.isPaid ? 'badge-confirmed' : 'badge-warning'}">
          ${o.isPaid ? '已付款' : '未付款'}
        </span>
      </td>
      <td><span class="badge ${statusBadge[o.status]}">${o.status}</span></td>
      <td>
        <div style="display:flex;gap:0.3rem;justify-content:center;">
          <button class="btn-icon" title="查看明細" onclick="openDetail(${o.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </button>
          ${canAdvance ? `
          <button class="btn-icon" title="推進狀態" onclick="nextStatus(${o.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811V8.69zM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061a1.125 1.125 0 01-1.683-.977V8.69z"/></svg>
          </button>` : ''}
          ${canCancel ? `
          <button class="btn-icon danger" title="取消訂單" onclick="cancelOrder(${o.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>` : ''}
          ${!o.isPaid && !terminalStatuses.includes(o.status) ? `
          <button class="btn-icon" title="標記付款" onclick="markPaid(${o.id})">
            <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </button>` : ''}
        </div>
      </td>
    </tr>
  `}).join('');

  updateStats();
}

// ── 統計 ──
function updateStats() {
  document.getElementById('statNew').textContent = orders.filter(o => o.status === '待確認').length;
  document.getElementById('statPacking').textContent = orders.filter(o => o.status === '備貨中').length;
  document.getElementById('statShipped').textContent = orders.filter(o => o.status === '已出貨').length;
  document.getElementById('statUnpaid').textContent = orders.filter(o => !o.isPaid && !terminalStatuses.includes(o.status)).length;
}

// ── 篩選 ──
document.getElementById('searchInput').addEventListener('input', applyFilter);

function applyFilter() {
  const keyword = document.getElementById('searchInput').value.trim();
  const paid = document.getElementById('paidFilter').value;

  filtered = orders.filter(o => {
    const matchKeyword = !keyword ||
      o.customer.includes(keyword) ||
      o.orderNo.includes(keyword) ||
      o.phone.includes(keyword);
    const matchStatus = currentStatusTab
      ? o.status === currentStatusTab
      : !terminalStatuses.includes(o.status);
    const matchPaid = paid === '' ? true : paid === 'paid' ? o.isPaid : !o.isPaid;
    return matchKeyword && matchStatus && matchPaid;
  });

  renderTable();
}

// ── 確認 Modal 通用 ──
let _pendingAction = null;

function showConfirm(title, desc, onConfirm) {
  document.getElementById('statusConfirmTitle').textContent = title;
  document.getElementById('statusConfirmDesc').textContent = desc;
  _pendingAction = onConfirm;
  document.getElementById('statusConfirmOverlay').classList.add('show');
}

function confirmNextStatus() {
  if (_pendingAction) _pendingAction();
  closeStatusConfirm();
}

function closeStatusConfirm() {
  _pendingAction = null;
  document.getElementById('statusConfirmOverlay').classList.remove('show');
}

// ── 推進訂單狀態 ──
function nextStatus(id) {
  const o = orders.find(o => o.id === id);
  if (!o) return;
  const currentIdx = statusFlow.indexOf(o.status);
  if (currentIdx >= 0 && currentIdx < statusFlow.length - 1) {
    const next = statusFlow[currentIdx + 1];
    showConfirm('確定更新訂單狀態？', `訂單「${o.orderNo}」將更新為「${next}」`, () => {
      o.status = next;
      applyFilter();
      if (viewingId === id) openDetail(id);
      showToast(`訂單狀態已更新為「${o.status}」`);
    });
  }
}

// ── 取消訂單 ──
function cancelOrder(id) {
  const o = orders.find(o => o.id === id);
  if (!o) return;
  showConfirm('確定取消訂單？', `訂單「${o.orderNo}」將被標記為「已取消」`, () => {
    o.status = '已取消';
    applyFilter();
    if (viewingId === id) openDetail(id);
    showToast('訂單已取消');
  });
}

// ── 標記付款 ──
function markPaid(id) {
  const o = orders.find(o => o.id === id);
  if (!o) return;
  o.isPaid = true;
  // TODO: PUT /api/orders/{id}/paid
  applyFilter();
  showToast('已標記為已付款');
}

// ── 查看明細 ──
function openDetail(id) {
  const o = orders.find(o => o.id === id);
  if (!o) return;
  viewingId = id;

  document.getElementById('dOrderNo').textContent = o.orderNo;
  document.getElementById('dCreatedAt').textContent = o.createdAt;
  document.getElementById('dCustomer').textContent = o.customer;
  document.getElementById('dPhone').textContent = o.phone;
  document.getElementById('dAddress').textContent = o.address;
  document.getElementById('dPayment').textContent = o.paymentMethod;
  document.getElementById('dPaid').innerHTML = `<span class="badge ${o.isPaid ? 'badge-confirmed' : 'badge-warning'}">${o.isPaid ? '已付款' : '未付款'}</span>`;
  document.getElementById('dStatus').innerHTML = `<span class="badge ${statusBadge[o.status]}">${o.status}</span>`;
  document.getElementById('dNotes').textContent = o.notes || '無';

  // 商品清單
  const itemsHtml = o.items.map(i => `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--chalk-beige);font-size:0.82rem;">
      <div>
        <div style="color:var(--text-dark);">${i.name}</div>
        <div style="color:var(--neutral);font-size:0.72rem;">x${i.qty}</div>
      </div>
      <div style="color:var(--brandy-rose);font-weight:500;">NT$ ${(i.price * i.qty).toLocaleString()}</div>
    </div>
  `).join('');
  document.getElementById('dItems').innerHTML = itemsHtml;
  document.getElementById('dTotal').textContent = `NT$ ${o.total.toLocaleString()}`;

  // 配送進度
  if (o.status === '已取消') {
    document.getElementById('dProgress').innerHTML = `
      <div style="display:flex;align-items:center;gap:0.6rem;padding:0.5rem 0;font-size:0.82rem;color:#8b3a2a;">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        此訂單已取消
      </div>`;
  } else {
    const steps = statusFlow.map((s, idx) => {
      const currentIdx = statusFlow.indexOf(o.status);
      const isDone = idx <= currentIdx;
      return `
        <div style="display:flex;align-items:center;gap:0.8rem;padding:0.4rem 0;">
          <div style="width:24px;height:24px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.65rem;
            ${isDone ? 'background:var(--brandy-rose);color:white;' : 'border:1.5px solid var(--chalk-beige);color:var(--neutral);'}">
            ${isDone ? '✓' : idx + 1}
          </div>
          <span style="font-size:0.82rem;color:${isDone ? 'var(--text-dark)' : 'var(--neutral)'};">${s}</span>
        </div>
      `;
    }).join('');
    document.getElementById('dProgress').innerHTML = steps;
  }

  // 操作按鈕
  const actionBtns = document.getElementById('dActionBtns');
  let btns = '';
  const canAdvance = statusFlow.includes(o.status) && statusFlow.indexOf(o.status) < statusFlow.length - 1;
  const canCancel = !terminalStatuses.includes(o.status);
  if (canAdvance) {
    const next = statusFlow[statusFlow.indexOf(o.status) + 1];
    btns += `<button class="btn-primary" onclick="nextStatus(${o.id})">標記為「${next}」</button>`;
  }
  if (!o.isPaid && !terminalStatuses.includes(o.status)) {
    btns += `<button class="btn-outline" onclick="markPaid(${o.id});closeDetail()" style="margin-left:0.5rem;">標記已付款</button>`;
  }
  if (canCancel) {
    btns += `<button class="btn-danger" onclick="cancelOrder(${o.id})" style="margin-left:0.5rem;">取消訂單</button>`;
  }
  actionBtns.innerHTML = btns;

  document.getElementById('detailOverlay').classList.add('show');
}

function closeDetail() {
  viewingId = null;
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
  applyFilter();
});
