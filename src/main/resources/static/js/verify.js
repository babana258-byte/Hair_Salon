// ── 取得手機號碼（從 login.html 跳轉時帶入）──
const urlParams = new URLSearchParams(window.location.search);
const phone = urlParams.get('phone') || '09xx-xxx-xxx';

// 顯示手機號碼（遮蔽中間4碼）
function maskPhone(phone) {
  const cleaned = phone.replace(/-/g, '');
  if (cleaned.length === 10) {
    return cleaned.slice(0, 4) + '-' + '****' + '-' + cleaned.slice(8);
  }
  return phone;
}

document.getElementById('phoneDisplay').textContent = maskPhone(phone);

// ── OTP 輸入框控制 ──
const inputs = document.querySelectorAll('.otp-input');

inputs.forEach((input, index) => {
  // 輸入數字自動跳下一格
  input.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9]/g, '').slice(0, 1);

    if (this.value) {
      this.classList.add('filled');
      this.classList.remove('error');
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    } else {
      this.classList.remove('filled');
    }

    checkAllFilled();
  });

  // 刪除鍵退回上一格
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Backspace' && !this.value && index > 0) {
      inputs[index - 1].focus();
      inputs[index - 1].value = '';
      inputs[index - 1].classList.remove('filled');
    }
  });

  // 貼上驗證碼（直接填入6格）
  input.addEventListener('paste', function (e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    pasted.split('').forEach((char, i) => {
      if (inputs[i]) {
        inputs[i].value = char;
        inputs[i].classList.add('filled');
      }
    });
    const nextIndex = Math.min(pasted.length, inputs.length - 1);
    inputs[nextIndex].focus();
    checkAllFilled();
  });
});

// ── 檢查是否全部填入 ──
function checkAllFilled() {
  const allFilled = Array.from(inputs).every(i => i.value);
  document.getElementById('submitBtn').disabled = !allFilled;
}

// ── 取得 OTP 值 ──
function getOtpValue() {
  return Array.from(inputs).map(i => i.value).join('');
}

// ── 清除 OTP ──
function clearOtp() {
  inputs.forEach(i => {
    i.value = '';
    i.classList.remove('filled', 'error');
  });
  inputs[0].focus();
  document.getElementById('submitBtn').disabled = true;
}

// ── 倒數計時 ──
let countdownTimer;
let seconds = 60;

function startCountdown() {
  seconds = 60;
  const countdownEl = document.getElementById('countdown');
  const resendBtn = document.getElementById('resendBtn');

  countdownEl.style.display = 'block';
  resendBtn.classList.remove('visible');

  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    seconds--;
    document.getElementById('secondsLeft').textContent = seconds;

    if (seconds <= 0) {
      clearInterval(countdownTimer);
      countdownEl.style.display = 'none';
      resendBtn.classList.add('visible');
    }
  }, 1000);
}

// ── 重新發送 ──
document.getElementById('resendBtn').addEventListener('click', async function () {
  this.classList.remove('visible');
  clearOtp();
  showAlert('', '');

  try {
    // ── 測試模式：跳過後端重送 ──
    // const res = await fetch('/api/auth/send-sms', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone })
    // });
    // const data = await res.json();
    // if (data.success) {
    //   showAlert('驗證碼已重新發送！', 'success');
    // } else {
    //   showAlert(data.message || '發送失敗，請稍後再試', 'error');
    // }
    showAlert('驗證碼已重新發送！（測試模式：請輸入 123456）', 'success');
  } catch {
    showAlert('系統錯誤，請稍後再試', 'error');
  }

  startCountdown();
});

// ── 顯示訊息 ──
function showAlert(msg, type) {
  const el = document.getElementById('alertMsg');
  if (!msg) { el.style.display = 'none'; return; }
  el.textContent = msg;
  el.className = `alert-msg ${type}`;
  el.style.display = 'block';
}

// ── 標記錯誤 ──
function markError() {
  inputs.forEach(i => i.classList.add('error'));
  setTimeout(() => inputs.forEach(i => i.classList.remove('error')), 600);
}

// ── 提交驗證 ──
document.getElementById('verifyForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const otp = getOtpValue();
  const btn = document.getElementById('submitBtn');

  btn.textContent = '驗證中...';
  btn.disabled = true;

  try {
    // ── 測試模式：驗證碼固定為 123456 ──
    // const res = await fetch('/api/auth/verify-sms', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone, code: otp })
    // });
    // const data = await res.json();
    // if (!res.ok || !data.success) throw new Error(data.message || '驗證失敗');

    await new Promise(resolve => setTimeout(resolve, 800));
    if (otp !== '123456') throw new Error('驗證碼錯誤');

    // 驗證成功 → 完成註冊
    const pending = JSON.parse(sessionStorage.getItem('pending_register') || '{}');
    if (pending.phone) {
      // TODO: 可在此呼叫 /api/customers 或 /api/auth/register 建立帳號
      localStorage.setItem('mushue_logged_in', 'true');
      sessionStorage.removeItem('pending_register');
    }

    clearInterval(countdownTimer);
    document.getElementById('verifyContent').style.display = 'none';
    document.getElementById('successScreen').style.display = 'block';

    // 30 秒倒數，逾時自動前往首頁
    let successSec = 30;
    const successTick = setInterval(() => {
      successSec--;
      const el = document.getElementById('successSecondsLeft');
      if (el) el.textContent = successSec;
      if (successSec <= 0) {
        clearInterval(successTick);
        window.location.href = './index.html';
      }
    }, 1000);

    // 使用者主動點擊時清除倒數
    ['btnGoProfile', 'btnGoHome'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', () => clearInterval(successTick));
    });

  } catch (err) {
    showAlert(err.message || '系統錯誤，請稍後再試', 'error');
    markError();
    clearOtp();
    btn.textContent = '確認驗證';
    btn.disabled = false;
  }
});

// ── 初始化 ──
document.addEventListener('DOMContentLoaded', function () {
  startCountdown();
  inputs[0].focus();
  document.getElementById('submitBtn').disabled = true;
});
