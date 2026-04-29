// ── 導覽列登入狀態管理 ──
(function () {

  // ── Profile 下拉 ──
  window.toggleProfileDropdown = function (e) {
    e.stopPropagation();
    closeCartDropdown();
    document.getElementById('profileDropdownMenu').classList.toggle('open');
  };

  // ── Cart 下拉 ──
  window.toggleCartDropdown = function (e) {
    e.stopPropagation();
    closeProfileDropdown();
    const menu = document.getElementById('cartDropdownMenu');
    if (!menu) return;
    const wasOpen = menu.classList.contains('open');
    menu.classList.toggle('open');
    if (!wasOpen) renderCartDropdown();
  };

  function closeProfileDropdown() {
    const menu = document.getElementById('profileDropdownMenu');
    if (menu) menu.classList.remove('open');
  }

  function closeCartDropdown() {
    const menu = document.getElementById('cartDropdownMenu');
    if (menu) menu.classList.remove('open');
  }

  // ── 渲染購物車下拉內容 ──
  function renderCartDropdown() {
    const list = document.getElementById('cartDropdownList');
    if (!list) return;
    const cart = JSON.parse(localStorage.getItem('mushue_cart') || '[]');
    const footerLink = document.querySelector('#cartDropdownMenu .cart-checkout-link');

    if (cart.length === 0) {
      list.innerHTML = '<div class="cart-dropdown-empty">購物車目前是空的</div>';
      if (footerLink) {
        footerLink.href = './shop.html';
        footerLink.textContent = '前往購買商品';
      }
      return;
    }

    list.innerHTML = `<div class="cart-dropdown-list">${
      cart.map(item => `
        <div class="cart-dropdown-item" id="nav-cart-item-${item.id}">
          <div class="cart-dropdown-item-img">
            ${item.img ? `<img src="${item.img}" alt="${item.name}">` : ''}
          </div>
          <div class="cart-dropdown-item-info">
            <div class="cart-dropdown-item-name">${item.name}</div>
            <div class="cart-dropdown-item-meta" id="nav-price-${item.id}">NT$ ${(item.price * item.qty).toLocaleString()}</div>
          </div>
          <div class="cart-dropdown-item-qty">
            <button class="cart-dropdown-qty-btn" onclick="navCartUpdateQty(${item.id}, -1)">−</button>
            <span class="cart-dropdown-qty-num" id="nav-qty-${item.id}">${item.qty}</span>
            <button class="cart-dropdown-qty-btn" onclick="navCartUpdateQty(${item.id}, 1)">+</button>
          </div>
        </div>
      `).join('')
    }</div>`;

    if (footerLink) {
      footerLink.href = './cart.html';
      footerLink.textContent = '前往購物車';
    }
  }

  // ── 導覽列購物車：更新數量 ──
  window.navCartUpdateQty = function (id, delta) {
    const cart = JSON.parse(localStorage.getItem('mushue_cart') || '[]');
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty = item.qty + delta;
    if (item.qty <= 0) {
      const el = document.getElementById(`nav-cart-item-${id}`);
      if (el) {
        el.style.transition = 'opacity 0.25s';
        el.style.opacity = '0';
        setTimeout(() => {
          const newCart = JSON.parse(localStorage.getItem('mushue_cart') || '[]').filter(i => i.id !== id);
          localStorage.setItem('mushue_cart', JSON.stringify(newCart));
          if (typeof updateCartBadge === 'function') updateCartBadge();
          renderCartDropdown();
        }, 250);
      }
      return;
    }
    localStorage.setItem('mushue_cart', JSON.stringify(cart));
    const qtyEl = document.getElementById(`nav-qty-${id}`);
    if (qtyEl) qtyEl.textContent = item.qty;
    const priceEl = document.getElementById(`nav-price-${id}`);
    if (priceEl) priceEl.textContent = `NT$ ${(item.price * item.qty).toLocaleString()}`;
    if (typeof updateCartBadge === 'function') updateCartBadge();
    if (typeof renderCart === 'function') renderCart();
  };

  // ── 更新購物車 Badge ──
  window.updateCartBadge = function () {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const cart = JSON.parse(localStorage.getItem('mushue_cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    if (total > 0) {
      badge.textContent = total > 99 ? '99+' : total;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  };

  // ── 登出 ──
  window.navLogout = function () {
    localStorage.removeItem('mushue_logged_in');
    window.location.href = './login.html';
  };

  // ── 點擊其他地方關閉所有下拉 ──
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#cartDropdownMenu')) closeCartDropdown();
    if (!e.target.closest('#profileDropdownMenu')) closeProfileDropdown();
  });

  // ── 初始化 Badge ──
  document.addEventListener('DOMContentLoaded', function () {
    updateCartBadge();
  });

})();
