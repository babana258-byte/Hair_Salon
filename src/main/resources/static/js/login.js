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

// ── 註冊 ──
document.getElementById('registerFormEl').addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const phone = document.getElementById('regPhone').value;
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regPasswordConfirm').value;

  if (password !== confirm) {
    showAlert('兩次密碼輸入不一致，請再確認。', 'error');
    return;
  }

  if (password.length < 8) {
    showAlert('密碼長度至少需要 8 位。', 'error');
    return;
  }

  try {
    // TODO: 串接後端 API
    // const res = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, phone, username, password })
    // });
    // const data = await res.json();

    // 暫時模擬
    showAlert('註冊成功！請登入您的帳號。', 'success');
    setTimeout(() => switchTab('login'), 2000);
  } catch (err) {
    showAlert('系統錯誤，請稍後再試。', 'error');
  }
});
