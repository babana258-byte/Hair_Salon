const SHIPPING_FEE = 80;
const FREE_SHIPPING_THRESHOLD = 3000;

function renderOrder() {
  const order = JSON.parse(localStorage.getItem('mushue_last_order') || 'null');

  if (!order) {
    document.getElementById('orderNumberBadge').textContent = '找不到訂單資料';
    document.getElementById('orderNumber').textContent = '—';
    document.getElementById('orderDate').textContent = '—';
    document.getElementById('paymentMethod').textContent = '—';
    document.getElementById('receiverName').textContent = '—';
    document.getElementById('receiverPhone').textContent = '—';
    document.getElementById('receiverAddress').textContent = '—';
    document.getElementById('orderNotes').textContent = '—';
    return;
  }

  // 訂單編號
  document.getElementById('orderNumber').textContent = order.orderNumber;
  document.getElementById('orderNumberBadge').textContent = `訂單編號：${order.orderNumber}`;

  // 訂單基本資訊
  document.getElementById('orderDate').textContent = order.date;
  document.getElementById('orderStatus').innerHTML =
    `<span class="status-badge status-pending">${order.status}</span>`;
  document.getElementById('paymentMethod').textContent = order.paymentMethod;

  // 收件資訊
  document.getElementById('receiverName').textContent = order.name;
  document.getElementById('receiverPhone').textContent = order.phone;
  document.getElementById('receiverAddress').textContent = order.address;
  document.getElementById('orderNotes').textContent = order.notes || '無';

  // 商品列表
  const itemsContainer = document.getElementById('orderItems');
  itemsContainer.innerHTML = order.items.map(item => `
    <div class="order-item">
      <div class="order-item-img">
        ${item.img
          ? `<img src="${item.img}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">`
          : item.name.charAt(0)
        }
      </div>
      <div class="order-item-info">
        <div class="order-item-name">${item.name}</div>
        <div class="order-item-qty">數量：${item.qty}</div>
      </div>
      <div class="order-item-price">NT$ ${(item.price * item.qty).toLocaleString()}</div>
    </div>
  `).join('');

  // 金額計算
  const subtotal = order.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = order.shipping;
  const total = subtotal + shipping;

  document.getElementById('subtotal').textContent = `NT$ ${subtotal.toLocaleString()}`;
  document.getElementById('shippingFee').textContent = shipping === 0 ? '免運' : `NT$ ${shipping}`;
  document.getElementById('total').textContent = `NT$ ${total.toLocaleString()}`;
}

// ── 初始化 ──
document.addEventListener('DOMContentLoaded', function () {
  renderOrder();
});
