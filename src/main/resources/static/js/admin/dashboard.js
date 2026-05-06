// ── Toast 提示 ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── 載入今日預約 ──
async function loadTodayAppointments() {
  // TODO: 串接後端 API
  // const res = await fetch('/api/appointments/today');
  // const data = await res.json();
  // renderAppointments(data);

  // 暫時使用假資料（已寫在 HTML 中）
}

// ── 載入統計數據 ──
async function loadStats() {
  // TODO: 串接後端 API
  // const res = await fetch('/api/dashboard/stats');
  // const data = await res.json();
  // document.getElementById('todayAppt').textContent = data.todayAppt;
  // document.getElementById('monthRevenue').textContent = data.monthRevenue;
  // document.getElementById('totalCustomers').textContent = data.totalCustomers;
  // document.getElementById('lowStock').textContent = data.lowStock;
}

// ── 標記預約完成 ──
function completeAppointment(id) {
  // TODO: 串接後端 API
  // await fetch(`/api/appointments/${id}/status`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ status: '完成' })
  // });
  showToast('預約已標記為完成');
}

// ── 今日訂單快覽資料 ──
const dashOrders = [
  {
    orderNo: 'ORD-20260506-001',
    customer: '張小芬',
    items: '摩洛哥堅果修護油 ×1',
    amount: 'NT$ 980',
    paidHtml: '<span class="badge badge-confirmed">已付款</span>',
    statusHtml: '<span class="badge badge-pending">待確認</span>'
  },
  {
    orderNo: 'ORD-20260506-002',
    customer: '林佳怡',
    items: '護髮素 500ml ×2、染劑 #6N ×1',
    amount: 'NT$ 2,360',
    paidHtml: '<span class="badge badge-confirmed">已付款</span>',
    statusHtml: '<span class="badge" style="background:#e8f0e4;color:#5a8a5a;">備貨中</span>'
  },
  {
    orderNo: 'ORD-20260505-008',
    customer: '陳雅琪',
    items: '沐序精萃洗髮乳 ×1',
    amount: 'NT$ 1,450',
    paidHtml: '<span class="badge badge-warning">未付款</span>',
    statusHtml: '<span class="badge badge-pending">待確認</span>'
  }
];

// ── 訂單快覽彈窗 ──
function openDashOrderDetail(index) {
  const o = dashOrders[index];
  document.getElementById('doOrderNo').textContent = o.orderNo;
  document.getElementById('doCustomer').textContent = o.customer;
  document.getElementById('doItems').textContent = o.items;
  document.getElementById('doAmount').textContent = o.amount;
  document.getElementById('doPaid').innerHTML = o.paidHtml;
  document.getElementById('doStatus').innerHTML = o.statusHtml;
  document.getElementById('dashOrderOverlay').classList.add('show');
}

function closeDashOrderDetail(event) {
  if (event && event.target !== document.getElementById('dashOrderOverlay')) return;
  document.getElementById('dashOrderOverlay').classList.remove('show');
}

// ── 初始化 ──
document.addEventListener('DOMContentLoaded', function () {
  loadStats();
  loadTodayAppointments();
});
