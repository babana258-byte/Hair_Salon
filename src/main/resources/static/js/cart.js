const SHIPPING_FEE = 80;
const FREE_SHIPPING_THRESHOLD = 3000;

// ── 從 localStorage 讀取購物車 ──
function loadCart() {
  return JSON.parse(localStorage.getItem('mushue_cart') || '[]');
}

// ── 儲存並同步 ──
function saveCart(cartItems) {
  localStorage.setItem('mushue_cart', JSON.stringify(cartItems));
  if (typeof updateCartBadge === 'function') updateCartBadge();
}

// ── 渲染購物車 ──
function renderCart() {
  const cartItems = loadCart();
  const container = document.getElementById('cartList');
  const emptyState = document.getElementById('emptyCart');
  const cartContent = document.getElementById('cartContent');

  if (cartItems.length === 0) {
    emptyState.style.display = 'block';
    cartContent.style.display = 'none';
    updateSummary(cartItems);
    return;
  }

  emptyState.style.display = 'none';
  cartContent.style.display = 'block';

  container.innerHTML = cartItems.map(item => `
    <div class="cart-item" id="item-${item.id}">
      <div class="cart-item-img">
        ${item.img
          ? `<img src="${item.img}" alt="${item.name}">`
          : `<div class="img-placeholder">${item.name.charAt(0)}</div>`
        }
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-desc">${item.desc || item.tag || ''}</div>
        <div class="cart-item-price">NT$ ${item.price.toLocaleString()}</div>
      </div>
      <div class="cart-item-actions">
        <div class="qty-control">
          <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
          <span class="qty-display" id="qty-${item.id}">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
        </div>
        <button class="delete-btn" onclick="removeItem(${item.id})" title="移除商品">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  updateSummary(cartItems);
}

// ── 更新數量 ──
function updateQty(id, delta) {
  const cartItems = loadCart();
  const item = cartItems.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  document.getElementById(`qty-${id}`).textContent = item.qty;
  saveCart(cartItems);
  updateSummary(cartItems);
}

// ── 移除商品 ──
function removeItem(id) {
  const el = document.getElementById(`item-${id}`);
  el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  el.style.opacity = '0';
  el.style.transform = 'translateX(20px)';
  setTimeout(() => {
    const cartItems = loadCart().filter(i => i.id !== id);
    saveCart(cartItems);
    renderCart();
  }, 300);
}

// ── 更新摘要 ──
function updateSummary(cartItems) {
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  document.getElementById('subtotal').textContent = `NT$ ${subtotal.toLocaleString()}`;
  document.getElementById('shipping').textContent = shipping === 0 ? '免運' : `NT$ ${shipping}`;
  document.getElementById('total').textContent = `NT$ ${total.toLocaleString()}`;

  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  document.getElementById('shippingProgress').style.width = `${progress}%`;

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  document.getElementById('shippingMsg').textContent =
    remaining > 0 ? `再消費 NT$ ${remaining.toLocaleString()} 即享免運` : '🎉 已享免運優惠！';

  document.getElementById('checkoutBtn').disabled = cartItems.length === 0;
}

// ── 優惠碼 ──
document.getElementById('promoForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  const msg = document.getElementById('promoMsg');
  const validCodes = { 'MUSHUE10': 0.9, 'WELCOME': 0.95 };

  if (validCodes[code]) {
    msg.textContent = `✓ 優惠碼已套用，享 ${Math.round((1 - validCodes[code]) * 100)}% 折扣`;
    msg.className = 'promo-msg success';
    msg.style.display = 'block';
  } else {
    msg.textContent = '× 優惠碼無效或已過期';
    msg.className = 'promo-msg error';
    msg.style.display = 'block';
  }
});

// ── 結帳 ──
document.getElementById('checkoutBtn').addEventListener('click', function () {
  window.location.href = './checkout.html';
});

// ── 初始化 ──
document.addEventListener('DOMContentLoaded', function () {
  renderCart();
});
