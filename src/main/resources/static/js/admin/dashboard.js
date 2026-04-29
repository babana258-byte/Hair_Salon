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

// ── 初始化 ──
document.addEventListener('DOMContentLoaded', function () {
  loadStats();
  loadTodayAppointments();
});
