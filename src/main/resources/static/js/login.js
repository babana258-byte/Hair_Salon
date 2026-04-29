// ── Tab 切換 ──
function switchTab(tab) {
  document.getElementById('alertMsg').style.display = 'none';
  document.getElementById('tabGroup').dataset.active = tab;

  if (tab === 'login') {
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('registerTab').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
  } else {
    document.getElementById('registerTab').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
  }
}

// ── 顯示訊息 ──
function showAlert(msg, type) {
  const el = document.getElementById('alertMsg');
  el.textContent = msg;
  el.className = `alert-msg ${type}`;
  el.style.display = 'block';
}

// ── 登入 ──
document.getElementById('loginFormEl').addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    // TODO: 串接後端 API
    // const res = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password })
    // });
    // const data = await res.json();
    // if (data.role === '管理員' || data.role === '設計師') {
    //   window.location.href = './admin/dashboard.html';
    // } else {
    //   window.location.href = './profile.html';
    // }

    // 暫時模擬
    if (username && password) {
      localStorage.setItem('mushue_logged_in', 'true');
      showAlert('登入成功！正在跳轉...', 'success');
      setTimeout(() => { window.location.href = './index.html'; }, 1500);
    } else {
      showAlert('帳號或密碼錯誤，請再試一次。', 'error');
    }
  } catch (err) {
    showAlert('系統錯誤，請稍後再試。', 'error');
  }
});

// ── 註冊：發送驗證碼 → 跳轉 verify.html ──
document.getElementById('registerFormEl').addEventListener('submit', async function (e) {
  e.preventDefault();
  const name     = document.getElementById('regName').value.trim();
  const phone    = document.getElementById('regPhone').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm  = document.getElementById('regPasswordConfirm').value;

  if (password !== confirm) {
    showAlert('兩次密碼輸入不一致，請再確認。', 'error');
    return;
  }

  if (password.length < 8) {
    showAlert('密碼長度至少需要 8 位。', 'error');
    return;
  }

  if (!/^09\d{8}$/.test(phone)) {
    showAlert('手機號碼格式不正確（需為 09 開頭共 10 碼）。', 'error');
    return;
  }

  const btn = this.querySelector('button[type=submit]');
  btn.textContent = '發送中...';
  btn.disabled = true;

  try {
    // ── 測試模式：跳過後端，直接跳轉 verify.html ──
    // const res = await fetch('/api/auth/send-sms', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone })
    // });
    // const data = await res.json();
    // if (!res.ok || !data.success) {
    //   showAlert(data.message || '發送失敗，請稍後再試。', 'error');
    //   btn.textContent = '發送驗證碼';
    //   btn.disabled = false;
    //   return;
    // }

    sessionStorage.setItem('pending_register', JSON.stringify({ name, phone, password }));
    window.location.href = `./verify.html?phone=${encodeURIComponent(phone)}`;

  } catch (err) {
    showAlert('系統錯誤，請稍後再試。', 'error');
    btn.textContent = '發送驗證碼';
    btn.disabled = false;
  }
});
