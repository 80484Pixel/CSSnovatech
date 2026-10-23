const CART_KEY = "novatech_cart";
const ACCOUNT_KEY = "novatech_account";


const PRODUCT_KEY = "auratek_products";

// Get products saved by the admin panel.
// If there are no saved products, use the original list.
function getProducts() {
    const saved = localStorage.getItem(PRODUCT_KEY);

    return saved !== null ? JSON.parse(saved) : PRODUCTS;
}

function money(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD"
  }).format(value);
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("#cart-count").forEach(el => el.textContent = count);
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  alert("Added to cart.");
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

grid.innerHTML = getProducts().map(product => `
    <article class="product-card">
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}">
      </a>
      <div class="product-card-body">
        <p class="eyebrow">${product.category}</p>
        <h3><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <p>${product.short || product.description || ""}</p>
        <div class="price">${money(product.price)}</div>
        <div style="display:flex;gap:.6rem;margin-top:1rem;">
          <a class="btn secondary" href="product.html?id=${product.id}">Details</a>
          <button class="btn" onclick="addToCart(${product.id})">Add to cart</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderProductDetail() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const id = Number(new URLSearchParams(location.search).get("id"));
  const product = getProducts().find(p => p.id === id);

  if (!product) {
    container.innerHTML = `<div class="empty-state">Product not found.</div>`;
    return;
  }

  document.title = `${product.name} | AuraTek`;

  container.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <div class="detail-panel">
      <p class="eyebrow">${product.category}</p>
      <h1>${product.name}</h1>
      <div class="price">${money(product.price)}</div>
      <p>${product.description}</p>
      <ul class="feature-list">
              ${(product.features || []).map(feature => `<li>${feature}</li>`).join("")}
      </ul>
      <button class="btn full" onclick="addToCart(${product.id})">Add to cart</button>
    </div>
  `;
}

function changeQuantity(id, amount) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += amount;
  const updated = cart.filter(i => i.quantity > 0);
  saveCart(updated);
  renderCart();
}

function removeFromCart(id) {
  saveCart(getCart().filter(item => item.id !== id));
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cart-items");
  if (!list) return;

  const cart = getCart();

  if (!cart.length) {
    list.innerHTML = `<div class="empty-state">Your cart is empty. <a href="index.html">Continue shopping</a>.</div>`;
  } else {
    list.innerHTML = cart.map(item => {
      const product = getProducts().find(p => p.id === item.id);
      if (!product) return "";
      return `
        <article class="cart-item">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <h3>${product.name}</h3>
            <div class="price">${money(product.price)}</div>
          </div>
          <div>
            <div class="quantity-controls">
              <button onclick="changeQuantity(${product.id}, -1)">−</button>
              <strong>${item.quantity}</strong>
              <button onclick="changeQuantity(${product.id}, 1)">+</button>
            </div>
            <button class="remove-button" onclick="removeFromCart(${product.id})" style="margin-top:.6rem;">Remove</button>
          </div>
        </article>
      `;
    }).join("");
  }

  const subtotal = cart.reduce((sum, item) => {
    const product = getProducts().find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  // Quebec tax rates:
  // GST = 5%
  // QST = 9.975%
  const gst = subtotal * 0.05;
  const qst = subtotal * 0.09975;
  const total = subtotal + gst + qst;

  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = money(value);
  };

  set("subtotal", subtotal);
  set("gst", gst);
  set("qst", qst);
  set("total", total);
}

function setupAccountForm() {
  const form = document.getElementById("account-form");
  if (!form) return;

  const existing = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null");
  if (existing) {
    ["firstName","lastName","email","phone","address","city","province","postalCode","country"].forEach(id => {
      if (document.getElementById(id) && existing[id] !== undefined) {
        document.getElementById(id).value = existing[id];
      }
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = {};
    ["firstName","lastName","email","phone","address","city","province","postalCode","country"].forEach(id => {
      data[id] = document.getElementById(id).value.trim();
    });

    // Password is intentionally NOT saved in this demo.
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(data));
    document.getElementById("account-message").textContent = "Account information saved in this browser.";
    document.getElementById("password").value = "";
  });

  const placeOrder = document.getElementById("place-order");
  if (placeOrder) {
    placeOrder.addEventListener("click", () => {
      const account = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "null");
      const cart = getCart();

      if (!account) {
        document.getElementById("order-message").textContent = "Please save your account information first.";
        return;
      }

      if (!cart.length) {
        document.getElementById("order-message").textContent = "Your cart is empty.";
        return;
      }

      const orderNumber = "AT-" + Math.floor(100000 + Math.random() * 900000);
      document.getElementById("order-message").textContent =
        `Demo order ${orderNumber} created. No payment was processed.`;

      saveCart([]);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderProducts();
  renderProductDetail();
  renderCart();
  setupAccountForm();
});
