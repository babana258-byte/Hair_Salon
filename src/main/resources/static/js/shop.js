// ── 商品資料 ──
// TODO: 串接後端 API 取得真實商品
// const res = await fetch('/api/products');
// const products = await res.json();

const products = [
  { id: 1, name: '純淨摩洛哥堅果修護油', brand: 'PAUL MITCHELL', category: '護髮', price: 1480, img: '', tag: '深層修護',
    desc: '富含維生素E與必需脂肪酸，能深層滋養受損髮絲，恢復自然光澤與彈性。不含人工色素與化學添加物。' },
  { id: 2, name: '絲滑修復洗髮露', brand: 'PAUL MITCHELL', category: '護髮', price: 980, img: '', tag: '潔淨系列',
    desc: '溫和胺基酸配方，在潔淨頭皮的同時維持髮絲水分，洗後柔順不乾澀，適合每日使用。' },
  { id: 3, name: '專業負離子吹風機', brand: 'MUSHUE', category: '造型品', price: 5800, img: '', tag: '專業工具',
    desc: '負離子技術有效減少靜電與毛躁，搭配多段風速與溫度調節，讓造型更精準、吹整效率更快。' },
  { id: 4, name: '水潤絲絨髮膜', brand: 'LEBEL', category: '護髮', price: 1280, img: '', tag: '滋潤修護',
    desc: '採用絲蛋白與透明質酸複合配方，一次護理即可明顯改善髮絲韌性，使頭髮更加光澤亮麗。' },
  { id: 5, name: '植萃頭皮養護精華', brand: 'LEBEL', category: '護髮', price: 1680, img: '', tag: '頭皮護理',
    desc: '精選多種植物萃取精華，深入頭皮毛囊，有效平衡油脂分泌，舒緩頭皮緊繃，促進健康髮根生長。' },
  { id: 6, name: '塑型海鹽噴霧', brand: 'PAUL MITCHELL', category: '造型品', price: 880, img: '', tag: '造型系列',
    desc: '海鹽成分賦予頭髮自然蓬鬆感與紋理，輕鬆打造慵懶海灘風格，無黏膩感，造型自然不僵硬。' },
  { id: 7, name: '深層修復髮膜', brand: 'PAUL MITCHELL', category: '護髮', price: 1380, img: '', tag: '滋潤修護',
    desc: '針對高度受損髮質設計，高濃度修復成分深入髮芯補充流失蛋白質，使髮絲由內而外重獲彈性。' },
  { id: 8, name: '豐盈塑型慕斯', brand: 'MUSHUE', category: '造型品', price: 980, img: '', tag: '造型系列',
    desc: '輕盈慕斯質地，蓬鬆效果持久不扁塌，增加頭髮豐盈感，讓造型輕鬆維持全天。' },
];

let currentCategory = '全部';
let searchKeyword = '';
let currentProductId = null;
let currentQty = 1;

// ── 渲染商品 ──
function renderProducts() {
  const container = document.getElementById('productGrid');
  let filtered = products;

  if (currentCategory !== '全部') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  if (searchKeyword.trim()) {
    filtered = filtered.filter(p =>
      p.name.includes(searchKeyword) || p.tag.includes(searchKeyword)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = '<div class="no-results col-12">找不到符合的商品</div>';
    return;
  }

  container.innerHTML = filtered.map(p => `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="product-card" onclick="viewProduct(${p.id})">
        <div class="product-img-wrapper">
          ${p.img
            ? `<img src="${p.img}" alt="${p.name}">`
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--neutral);font-size:0.75rem;letter-spacing:0.1em;">${p.tag}</div>`
          }
          <div class="product-overlay">
            <button class="add-btn" onclick="viewProduct(${p.id})">查看詳情</button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-category">${p.tag}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-price">NT$ ${p.price.toLocaleString()}</div>
        </div>
      </div>
    </div>
  `).join('');
}

// ── 類別切換 ──
function switchCategory(category, btn) {
  currentCategory = category;
  document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts();
}

// ── 搜尋 ──
document.getElementById('searchInput').addEventListener('input', function () {
  searchKeyword = this.value;
  renderProducts();
});

// ── 查看商品（開啟 Modal）──
function viewProduct(id) {
  const p = products.find(p => p.id === id);
  if (!p) return;

  currentProductId = id;
  currentQty = 1;

  document.getElementById('modalBrand').textContent = p.brand || '';
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalPrice').textContent = `NT$ ${p.price.toLocaleString()}`;
  document.getElementById('modalDesc').textContent = p.desc || '';
  document.getElementById('modalQty').textContent = 1;

  const img = document.getElementById('modalImg');
  const placeholder = document.getElementById('modalImgPlaceholder');
  if (p.img) {
    img.src = p.img;
    img.alt = p.name;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    placeholder.style.display = 'block';
  }

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ── 關閉 Modal（點擊背景）──
function closeProductModal(e) {
  if (e.target === document.getElementById('productModal')) {
    closeProductModalBtn();
  }
}

// ── 關閉 Modal（按鈕）──
function closeProductModalBtn() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
}

// ── 數量調整 ──
function changeQty(delta) {
  currentQty = Math.max(1, currentQty + delta);
  document.getElementById('modalQty').textContent = currentQty;
}

// ── Modal 內加入購物車 ──
function modalAddToCart() {
  const p = products.find(p => p.id === currentProductId);
  if (!p) return;

  const cart = JSON.parse(localStorage.getItem('mushue_cart') || '[]');
  const existing = cart.find(item => item.id === p.id);
  if (existing) {
    existing.qty += currentQty;
  } else {
    cart.push({ id: p.id, name: p.name, price: p.price, img: p.img, tag: p.tag, qty: currentQty });
  }
  localStorage.setItem('mushue_cart', JSON.stringify(cart));

  if (typeof updateCartBadge === 'function') updateCartBadge();

  closeProductModalBtn();
  showToast(`「${p.name}」× ${currentQty} 已加入購物車`);
}

// ── Toast 提示 ──
function showToast(msg) {
  const toast = document.getElementById('cartToast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── ESC 關閉 Modal ──
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeProductModalBtn();
});

// ── 初始化 ──
document.addEventListener('DOMContentLoaded', function () {
  renderProducts();
});
