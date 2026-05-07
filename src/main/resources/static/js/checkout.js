const SHIPPING_FEE = 80;
const FREE_SHIPPING_THRESHOLD = 3000;

function loadCart() {
  return JSON.parse(localStorage.getItem('mushue_cart') || '[]');
}

// ── 渲染訂單摘要 ──
function renderOrderSummary() {
  var orderItems = loadCart();
  var container = document.getElementById('orderItems');
  if (!container) return;

  if (orderItems.length === 0) {
    container.innerHTML = '<div style="font-size:0.85rem;color:var(--neutral);text-align:center;padding:1rem 0;">購物車是空的，請先選購商品。</div>';
    document.getElementById('summarySubtotal').textContent = 'NT$ 0';
    document.getElementById('summaryShipping').textContent = 'NT$ ' + SHIPPING_FEE;
    document.getElementById('summaryTotal').textContent = 'NT$ ' + SHIPPING_FEE;
    return;
  }

  container.innerHTML = orderItems.map(function(item) {
    var imgHtml = item.img
      ? '<img src="' + item.img + '" alt="' + item.name + '" style="width:100%;height:100%;object-fit:cover;border-radius:10px;">'
      : item.name.charAt(0);
    return '<div class="order-item">'
      + '<div class="order-item-img">' + imgHtml + '</div>'
      + '<div class="order-item-info">'
      + '<div class="order-item-name">' + item.name + '</div>'
      + '<div class="order-item-qty">x' + item.qty + '</div>'
      + '</div>'
      + '<div class="order-item-price">NT$ ' + (item.price * item.qty).toLocaleString() + '</div>'
      + '</div>';
  }).join('');

  var subtotal = orderItems.reduce(function(sum, i) { return sum + i.price * i.qty; }, 0);
  var shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  var total = subtotal + shipping;

  document.getElementById('summarySubtotal').textContent = 'NT$ ' + subtotal.toLocaleString();
  document.getElementById('summaryShipping').textContent = shipping === 0 ? '免運' : 'NT$ ' + shipping;
  document.getElementById('summaryTotal').textContent = 'NT$ ' + total.toLocaleString();
}

// ── 物流方式選擇 ──
function updateAddressSection(shippingValue) {
  var isHome = shippingValue === '宅配到府';
  document.getElementById('addressCardTitle').textContent = isHome ? '收件地址' : '取件門市';
  document.getElementById('storeSection').style.display = isHome ? 'none' : 'block';
  document.getElementById('homeSection').style.display  = isHome ? 'block' : 'none';
}

function initShippingOptions() {
  var options = document.querySelectorAll('.shipping-option');
  options.forEach(function(option) {
    option.addEventListener('click', function() {
      options.forEach(function(o) { o.classList.remove('selected'); });
      option.classList.add('selected');
      var radio = option.querySelector('input[type=radio]');
      if (radio) {
        radio.checked = true;
        var hidden = document.getElementById('shippingMethod');
        if (hidden) hidden.value = radio.value;
        updateAddressSection(radio.value);
      }
    });
  });
  var checked = document.querySelector('input[name=shipping]:checked');
  if (checked) updateAddressSection(checked.value);
}

// ── 縣市自訂下拉 ──
function initCitySelect() {
  var wrapper = document.getElementById('cityWrapper');
  var btn     = document.getElementById('cityBtn');
  var label   = document.getElementById('cityLabel');
  var hidden  = document.getElementById('city');
  var options = wrapper.querySelectorAll('.city-option');

  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    wrapper.classList.toggle('open');
  });

  options.forEach(function(opt) {
    opt.addEventListener('click', function() {
      var val = opt.dataset.value;
      hidden.value = val;
      label.textContent = val;
      label.style.color = 'var(--text-dark)';
      btn.style.borderColor = '';
      options.forEach(function(o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      wrapper.classList.remove('open');
    });
  });

  document.addEventListener('click', function() {
    wrapper.classList.remove('open');
  });
}

// ── 付款方式選擇 ──
function initPaymentOptions() {
  var options = document.querySelectorAll('.payment-option');
  options.forEach(function(option) {
    option.addEventListener('click', function() {
      options.forEach(function(o) { o.classList.remove('selected'); });
      option.classList.add('selected');
      var radio = option.querySelector('input[type=radio]');
      if (radio) {
        radio.checked = true;
        var hiddenPayment = document.getElementById('payment');
        if (hiddenPayment) hiddenPayment.value = radio.value;
      }
    });
  });
}

// ── 顯示 / 隱藏錯誤提示 ──
function showError(msg) {
  var el = document.getElementById('checkoutError');
  if (!el) return;
  el.textContent = msg;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
function hideError() {
  var el = document.getElementById('checkoutError');
  if (el) el.style.display = 'none';
}

// ── 表單驗證 ──
function validateForm() {
  var isHome = document.getElementById('shippingMethod').value === '宅配到府';
  var allFilled = true;

  ['name', 'phone'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) { el.style.borderColor = '#c0705a'; allFilled = false; }
    else el.style.borderColor = '';
  });

  if (isHome) {
    ['district', 'address'].forEach(function(id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (!el.value.trim()) { el.style.borderColor = '#c0705a'; allFilled = false; }
      else el.style.borderColor = '';
    });
    var cityHidden = document.getElementById('city');
    var cityBtn    = document.getElementById('cityBtn');
    if (cityHidden && !cityHidden.value.trim()) {
      if (cityBtn) cityBtn.style.borderColor = '#c0705a';
      allFilled = false;
    } else {
      if (cityBtn) cityBtn.style.borderColor = '';
    }
  } else {
    var storeEl = document.getElementById('storeName');
    if (storeEl && !storeEl.value.trim()) {
      storeEl.style.borderColor = '#c0705a'; allFilled = false;
    } else if (storeEl) {
      storeEl.style.borderColor = '';
    }
  }

  if (!allFilled) {
    showError(isHome
      ? '請填寫所有必填欄位（姓名、手機、縣市、鄉鎮市區、詳細地址）。'
      : '請填寫所有必填欄位（姓名、手機、門市名稱）。');
    return false;
  }

  hideError();
  return true;
}

// ── 產生訂單編號 ──
function generateOrderNumber() {
  var date = new Date();
  var ymd = date.getFullYear()
    + String(date.getMonth() + 1).padStart(2, '0')
    + String(date.getDate()).padStart(2, '0');
  var rand = Math.floor(Math.random() * 9000) + 1000;
  return 'MS' + ymd + rand;
}

// ── 確認訂單（onclick 呼叫）──
function submitOrder() {
  var cartItems = loadCart();

  if (cartItems.length === 0) {
    showError('購物車是空的，請先選購商品！');
    return;
  }

  if (!validateForm()) return;

  var btn = document.getElementById('submitBtn');
  btn.textContent = '處理中...';
  btn.disabled = true;

  var subtotal = cartItems.reduce(function(sum, i) { return sum + i.price * i.qty; }, 0);
  var shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  var checkedRadio = document.querySelector('input[name=payment]:checked');

  var orderData = {
    orderNumber: generateOrderNumber(),
    date: new Date().toLocaleString('zh-TW', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    }),
    status: '待處理',
    items: cartItems,
    shipping: shipping,
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('shippingMethod').value === '宅配到府'
           ? document.getElementById('city').value + document.getElementById('district').value + document.getElementById('address').value
           : document.getElementById('storeName').value,
    shippingMethod: document.getElementById('shippingMethod').value,
    paymentMethod: checkedRadio ? checkedRadio.value : '現金',
    notes: document.getElementById('notes').value
  };

  localStorage.setItem('mushue_last_order', JSON.stringify(orderData));
  localStorage.removeItem('mushue_cart');
  if (typeof updateCartBadge === 'function') updateCartBadge();

  window.location.href = './order_confirm.html';
}

// ── 初始化 ──
document.addEventListener('DOMContentLoaded', function() {
  renderOrderSummary();
  initShippingOptions();
  initPaymentOptions();
  initCitySelect();
  var firstOption = document.querySelector('.payment-option');
  if (firstOption) firstOption.classList.add('selected');
});
