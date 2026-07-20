document.addEventListener("DOMContentLoaded", async () => {
  await window.NovaCart.ready;

  const cartItemsContainer = document.getElementById("cartItems");
  const totalItems = document.getElementById("totalItems");
  const totalCartItem = document.getElementById("totalCartItem");
  const alsoLikeContainer = document.getElementById("pgrid");
  const totalAmount = document.getElementById("totalAmount");
  const shippingCharge = document.getElementById("shippingCharge");
  const taxCharge = document.getElementById("taxCharge");
  const discount = document.getElementById("discountAmount");
  const checkoutButton = document.getElementById("checkoutBtn");

  const PRICE_SUMMARY_KEY = "novacart_price_summary";

  // Merge cart items (id, quantity) with full product details
  function getCartItemsWithDetails() {
    return window.cart.items
      .map(cartItem => {
        const product = window.NovaCart.products.find(p => p.id === cartItem.id);
        if (!product) return null;
        return { ...product, quantity: cartItem.quantity };
      })
      .filter(Boolean); // drop items whose product no longer exists
  }

  // Recalculate cart total based on price * quantity
  function recalcTotal(items) {
    window.cart.total = items.reduce(
      (sum, p) => sum + p.price * 90 * p.quantity,
      0
    );
  }

  // Pull products sharing a category with anything currently in the cart,
  // excluding products already in the cart, capped at 10.
  function getSimilarProducts(cartProducts) {
    if (cartProducts.length === 0) return [];

    const cartCategories = new Set(cartProducts.map(p => p.cat));
    const cartIds = new Set(cartProducts.map(p => p.id));

    return window.NovaCart.products
      .filter(p => cartCategories.has(p.cat) && !cartIds.has(p.id))
      .slice(0, 10);
  }

  function renderSimilarProducts(cartProducts) {
    if (!alsoLikeContainer) return;

    const similar = getSimilarProducts(cartProducts);

    if (similar.length === 0) {
      alsoLikeContainer.innerHTML = "";
      return;
    }

    alsoLikeContainer.innerHTML = similar
      .map(p => `
        <div class="col-6 col-md-4 col-lg-3">
          ${productCard(p)}
        </div>
      `)
      .join("");
  }

  // Persist the full price breakdown so checkout.html (or any other page)
  // can read it without relying on URL query params.
  function savePriceSummary(summary) {
    localStorage.setItem(PRICE_SUMMARY_KEY, JSON.stringify(summary));
  }

  function renderCart() {
    const products = getCartItemsWithDetails();
    recalcTotal(products);

    if (products.length === 0) {
      cartItemsContainer.innerHTML = `<p class="text-muted-nc">Your cart is empty.</p>`;
    } else {
      cartItemsContainer.innerHTML = products
        .map(p => `
          <div class="col-6 col-md-4 col-lg-3">
            ${cartItemCard(p)}
          </div>
        `)
        .join("");
    }

    totalItems.innerText = `Subtotal ₹${window.cart.total.toFixed(0)}`;

    const shipCharge = window.cart.total * 0.0003;      // 0.03%
    const tax = window.cart.total * 0.0005;             // 0.05%
    const discountRupees = window.cart.total * 0.0001;  // 0.01%
    const freeShipping = window.cart.total > 200;
    const finalShipCharge = freeShipping ? 0 : shipCharge;

    shippingCharge.innerText = freeShipping ? "Free" : `₹${shipCharge.toFixed(0)}`;
    taxCharge.innerText = `₹${tax.toFixed(0)}`;
    discount.innerText = `-₹${discountRupees.toFixed(0)}`;

    const total = window.cart.total + finalShipCharge + tax - discountRupees;
    totalAmount.innerText = `₹${total.toFixed(0)}`;

    // Save the breakdown for checkout.html to read directly from localStorage —
    // no URL params, no re-parsing, always in sync with what's shown here.
    savePriceSummary({
      subtotal: window.cart.total,
      shipping: finalShipCharge,
      tax,
      discount: discountRupees,
      total
    });

    // Plain link — checkout.html reads the summary from localStorage itself
    checkoutButton.href = "checkout.html";

    totalCartItem.innerText = `Your cart (${products.length})`;

    localStorage.setItem("cart", JSON.stringify(window.cart));

    renderSimilarProducts(products);
  }

  function cartItemCard(p) {
    return `<div class="nc-card" data-id="${p.id}">
      <button class="wish" aria-label="remove" onclick="removeFromCart(${p.id})">✕</button>
      ${p.discount ? `<span class="discount">-${p.discount}%</span>` : ""}
      <div class="thumb" style="background: url(${p.img}); background-size: cover; background-position: center center;"></div>
      <div class="body">
        <div class="brand">${p.brand}</div>
        <a href="product-details.html?id=${p.id}"><div class="title">${p.title}</div></a>
        <div class="stars">${"★".repeat(Math.floor(p.rating))}${"☆".repeat(5 - Math.floor(p.rating))} <span class="text-muted-nc">(${p.rating})</span></div>
        <div class="price mt-1">₹${(p.price * 90).toFixed(0)}<small>₹${(p.old * 90).toFixed(0)}</small></div>

        <div class="d-flex align-items-center gap-2 mt-2">
          <label class="nc-label mb-0">Qty</label>
          <div class="nc-qty">
            <button onclick="updateCartQty(${p.id}, -1)">−</button>
            <input type="number" class="cart-qty-input" data-id="${p.id}" value="${p.quantity}" min="1" max="${p.maxQuantity ?? 99}" readonly>
            <button onclick="updateCartQty(${p.id}, 1)">+</button>
          </div>
        </div>

        <div class="subtotal mt-1 text-muted-nc" style="font-size:13px">
          Subtotal: ₹${(p.price * 90 * p.quantity).toFixed(0)}
        </div>
      </div>
    </div>`;
  }

  // Global — matches the onclick in cartItemCard
  window.removeFromCart = function (productId) {
    window.cart.items = window.cart.items.filter(item => item.id !== productId);
    renderCart(); // instantly reflects removal in the UI, including similar products
  };

  // Global — matches the onclick in cartItemCard
  window.updateCartQty = function (productId, delta) {
    const item = window.cart.items.find(item => item.id === productId);
    if (!item) return;

    const product = window.NovaCart.products.find(p => p.id === productId);
    const maxQty = product?.maxQuantity ?? 99;

    item.quantity = Math.max(1, Math.min(maxQty, item.quantity + delta));
    renderCart();
  };

  renderCart();
});