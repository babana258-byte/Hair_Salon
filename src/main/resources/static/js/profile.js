// ── 頁面守衛：未登入則導回登入頁 ──
if (localStorage.getItem('mushue_logged_in') !== 'true') {
  window.location.replace('./login.html');
}

// ── 登出 ──
function logout() {
  localStorage.removeItem('mushue_logged_in');
  window.location.href = './login.html';
}

// ── Tab 切換 ──
function switchSection(section) {
  // 更新側邊欄按鈕狀態
  document.querySelectorAll('.nav-item-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-section="${section}"]`).classList.add('active');

  // 更新內容區域
  document.querySelectorAll('.content-section').forEach(el => {
    el.classList.remove('active');
  });
  document.getElementById(`section-${section}`).classList.add('active');
}

// ── 顯示訊息 ──
function showAlert(id, msg, type) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = `alert-msg ${type}`;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3000);
}

// ── 個人資料表單送出 ──
document.getElementById('profileFormEl').addEventListener('submit', async function (e) {
  e.preventDefault();

  // TODO: 串接後端 API
  // const res = await fetch('/api/customers/{id}', {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     name: document.getElementById('profileName').value,
  //     phone: document.getElementById('profilePhone').value,
  //     birthday: document.getElementById('profileBirthday').value,
  //     gender: document.getElementById('profileGender').value
  //   })
  // });

  showAlert('profileAlert', '個人資料已更新成功！', 'success');
});

// ── 修改密碼表單送出 ──
document.getElementById('passwordFormEl').addEventListener('submit', async function (e) {
  e.preventDefault();

  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
    showAlert('passwordAlert', '兩次密碼輸入不一致，請再確認。', 'error');
    return;
  }

  if (newPassword.length < 8) {
    showAlert('passwordAlert', '密碼長度至少需要 8 位。', 'error');
    return;
  }

  // TODO: 串接後端 API
  // const res = await fetch('/api/users/{id}/password', {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     oldPassword: document.getElementById('oldPassword').value,
  //     newPassword: newPassword
  //   })
  // });

  showAlert('passwordAlert', '密碼修改成功！', 'success');
  document.getElementById('passwordFormEl').reset();
});

// ── 載入預約記錄 ──
async function loadAppointments() {
  // TODO: 串接後端 API
  // const res = await fetch('/api/appointments/customer/{id}');
  // const data = await res.json();
  // renderAppointments(data);

  // 暫時使用假資料
  const appointments = [
    { id: 1, service: '縮毛矯正', date: '2025-05-10', time: '14:00', staff: '林設計師', status: '已確認' },
    { id: 2, service: '線條染', date: '2025-04-20', time: '11:00', staff: '王設計師', status: '完成' },
    { id: 3, service: '頭皮養護', date: '2025-03-15', time: '15:30', staff: '林設計師', status: '完成' },
  ];
  renderAppointments(appointments);
}

function renderAppointments(appointments) {
  const container = document.getElementById('appointmentList');
  if (appointments.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--neutral);font-size:0.85rem;padding:2rem;">目前沒有預約記錄</p>';
    return;
  }

  container.innerHTML = appointments.map(a => {
    const statusMap = {
      '待確認': 'badge-pending',
      '已確認': 'badge-confirmed',
      '完成': 'badge-completed',
      '預約未到': 'badge-cancelled'
    };
    return `
      <div class="appointment-item">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem;">
          <div class="service-name">${a.service}</div>
          <span class="badge ${statusMap[a.status] || 'badge-pending'}">${a.status}</span>
        </div>
        <div class="meta">
          <div class="meta-item">
            <label>日期</label>
            <span>${a.date}</span>
          </div>
          <div class="meta-item">
            <label>時間</label>
            <span>${a.time}</span>
          </div>
          <div class="meta-item">
            <label>設計師</label>
            <span>${a.staff}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── 載入消費記錄 ──
async function loadInvoices() {
  // TODO: 串接後端 API
  // const res = await fetch('/api/invoices/customer/{id}');
  // const data = await res.json();
  // renderInvoices(data);

  // 暫時使用假資料
  const invoices = [
    { id: 1, service: '縮毛矯正', date: '2025-04-20', amount: 3500, method: '刷卡' },
    { id: 2, service: '線條染 + 護髮', date: '2025-03-15', amount: 4200, method: '現金' },
    { id: 3, service: '剪髮', date: '2025-02-10', amount: 500, method: 'Line Pay' },
  ];
  renderInvoices(invoices);
}

function renderInvoices(invoices) {
  const container = document.getElementById('invoiceList');
  if (invoices.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--neutral);font-size:0.85rem;padding:2rem;">目前沒有消費記錄</p>';
    return;
  }

  container.innerHTML = invoices.map(inv => `
    <div class="invoice-item">
      <div class="invoice-icon">
        <svg width="20" height="20" fill="none" stroke="var(--brandy-rose)" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z"/>
        </svg>
      </div>
      <div class="invoice-info">
        <div class="service">${inv.service}</div>
        <div class="date">${inv.date} · ${inv.method}</div>
      </div>
      <div class="invoice-amount">NT$ ${inv.amount.toLocaleString()}</div>
    </div>
  `).join('');
}

// ── 初始化 ──
document.addEventListener('DOMContentLoaded', function () {
  switchSection('overview');
  loadAppointments();
  loadInvoices();
});
