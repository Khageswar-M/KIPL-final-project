/* NovaCart - Shared JS */
(function () {
  const NAV_LINKS = [
    { href: "home.html", label: "Products" },
    { href: "products.html", label: "Shop" },
    { href: "categories.html", label: "Categories" },
    { href: "about.html", label: "About" },
    { href: "contact.html", label: "Contact" }
  ];

  // Pages reachable without being logged in — the whole login/signup/
  // forgot-password/otp/reset toggle lives here, everything else is guarded.
  const AUTH_PAGES = ["login.html", "signup.html", "verify-otp.html", "forgot-password.html", "reset-password.html"];

  function currentPage() {
    let p = location.pathname.split("/").pop() || "index.html";
    if (p && !p.includes(".")) p += ".html"; // Netlify's Pretty URLs strips .html — add it back
    return p;
  }

  function isLoggedIn() {
    try {
      return JSON.parse(localStorage.getItem("login")) === true;
    } catch (e) {
      return false;
    }
  }

  window.NovaCart = {
    products: [],
    categories: [],
    brands: [],
    selectedCategory: "All",
    isLoggedIn: isLoggedIn
  };

  // --- Auth guard: run immediately, before anything else on the page ---
  const onAuthPage = AUTH_PAGES.includes(currentPage());
  const loggedIn = isLoggedIn();
  const needsRedirect = !onAuthPage && !loggedIn;

  if (needsRedirect) {
    location.replace("login.html");
  }
  // -----------------------------------------------------------------------

  async function loadFakeProducts() {
    try {

      const response = await fetch("https://dummyjson.com/products?limit=200");
      const data = await response.json();

      const transformedProducts = data.products.map(product => ({
        id: product.id,              // avoid id conflicts
        title: product.title,
        brand: product.brand,
        price: Math.round(product.price),
        old: Math.round(product.price / (1 - product.discountPercentage / 100)),
        rating: Number(product.rating.toFixed(1)),
        discount: Math.round(product.discountPercentage),
        img: product.thumbnail,
        cat: product.category
      }));

      // merger with existing products
      window.NovaCart.products.push(...transformedProducts);

      // update brands
      const allBrands = new Set([
        ...window.NovaCart.brands,
        ...transformedProducts.map(p => p.brand)
      ]);

      window.NovaCart.brands = [...allBrands];

      // Update categories
      transformedProducts.forEach(product => {

        const existing = window.NovaCart.categories.find(
          c => c.name.toLowerCase() === product.cat.toLowerCase()
        );

        if (existing) {
          existing.count++;
        } else {
          window.NovaCart.categories.push({
            name: product.cat,
            img: product.img,
            count: 1
          });
        }

      });

      console.log("Loaded", transformedProducts.length, "products");
      console.log(window.NovaCart);
    } catch (err) {
      console.error(err);
    }
  }

  // Skip the network call entirely if we're about to navigate away to login.
  window.NovaCart.ready = needsRedirect ? Promise.resolve() : loadFakeProducts();

  window.NovaCart.setSelectedCategory = function (category) {
    sessionStorage.setItem("selectedCategory", category);
  }

  window.handleLogout = function () {

    const isConfirm = window.confirm("Are you sure you want to logout?");

    if (!isConfirm) return;

    localStorage.setItem("login", JSON.stringify(false));

    window.location.replace("login.html");
  }

  function renderNavbar(target) {
    const active = currentPage();
    const links = NAV_LINKS.map(l => `<li class="nav-item"><a class="nav-link ${active === l.href ? 'active' : ''}" href="${l.href}">${l.label}</a></li>`).join("");
    target.innerHTML = `
      <div class="nc-announce">Free shipping on orders over ₹99 &nbsp;·&nbsp; Use code <b>NOVA20</b> for 20% off &nbsp;·&nbsp; <a href="products.html">Shop deals</a></div>
      <nav class="nc-nav navbar navbar-expand-lg">
        <div class="container-nc w-100 d-flex flex-column flex-lg-row justify-content-between align-items-center gap-3">
          <div class="w-100 d-flex justify-content-between align-items-center">
            <a href="index.html" class="navbar-brand d-flex align-items-center m-0 p-0">

              <img
                  src="../images/AppLogo.png"
                  alt="NovaCart Logo"
                  class="img-fluid"
                  style="height: 48px; width: auto; object-fit: contain; scale: 3; margin-left: 20px; margin-top: 10px;">
            </a>

              <button
                  class="navbar-toggler border-0 shadow-none"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#ncNav">
                  <span class="navbar-toggler-icon"></span>
              </button>
          </div>
          <div class="collapse navbar-collapse w-100 gap-3" id="ncNav"> 
            <ul class="navbar-nav me-auto gap-2">${links}</ul>
            <div class="d-flex align-items-center justify-content-between justify-content-lg-end gap-2 w-100 mt-3 mt-lg-0">
              <form class="d-flex flex-shrink-0" action="search.html">
                <button class="btn btn-primary d-flex align-items-center gap-2 rounded-pill" type="submit"><i class="fa-brands fa-sistrix"></i> Search</button>
              </form>
              <div class="d-flex align-items-center gap-2 flex-shrink-0">
                <a href="cart.html" class="nc-icon-btn" title="Cart">
                  <i class="fa-solid fa-cart-shopping"></i>
                  <span class="nc-badge">${window.cart.items.length}</span>
                </a>
                <a href="profile.html" class="nc-icon-btn" title="Account"><i class="fa-regular fa-user"></i></a>
                <a onclick="handleLogout()" class="btn btn-danger d-inline-flex" style="padding:8px 18px;font-size:13px">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    `;
  }


  function renderFooter(target) {
    target.innerHTML = `
      <footer class="nc-footer">
        <div class="container-nc">
          <div class="row g-4">
            <div class="col-lg-4 col-md-12">
              <a class="navbar-brand " href="index.html" style="text-align: center">
                <img src="../images/AppLogo.png" style="scale: 5; align-self: center;" height="50"  width:"100"/>
              </a>
              <p class="brand-desc " style="text-align:">The next generation shopping experience. Discover premium electronics, gadgets, fashion and more — delivered fast, guaranteed genuine.</p>
              <div class="socials mt-3 text-center">
                <a href="https://www.x.com" target="_blank"><i class="fa-brands fa-x-twitter"></i></a>
                <a href="https://www.facebook.com" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="https://www.instagram.com" target="_blank"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://www.youtube.com" target="_blank"><i class="fa-brands fa-youtube"></i></a>
              </div>
            </div>
            <div class="col-lg-2 col-md-6 col-6 text-center">
              <h6>Shop</h6>
              <a href="products.html">All Products</a>
              <a href="categories.html">Categories</a>
              <a href="products.html">New Arrivals</a>
              <a href="products.html">Best Sellers</a>
              <a href="products.html">Deals</a>
            </div>
            <div class="col-lg-2 col-md-6 col-6 text-center">
              <h6>Account</h6>
              <a href="profile.html">My Profile</a>
              <a href="orders.html">Orders</a>
              <a href="address.html">Addresses</a>
              <a href="notifications.html">Notifications</a>
            </div>
            <div class="col-lg-2 col-md-6 col-6 text-center">
              <h6>Help</h6>
              <a href="support.html">Support</a>
              <a href="faq.html">FAQ</a>
              <a href="contact.html">Contact</a>
              <a href="about.html">About</a>
              <a href="#">Shipping</a>
            </div>
            <div class="col-lg-2 col-md-6 col-6 text-center">
              <h6>Legal</h6>
              <a href="about.html">Terms</a>
              <a href="about.html">Privacy</a>
              <a href="about.html">Cookies</a>
              <a href="about.html">Returns</a>
              <a href="about.html">Warranty</a>
            </div>
          </div>
          <div class="nc-footer-bottom">
            <div>© 2025 NovaCart. All rights reserved.</div>
            <div>💳 Visa · Mastercard · UPI · PayPal · Apple Pay</div>
          </div>
        </div>
      </footer>
      <button class="nc-top" id="ncTop" aria-label="Back to top">↑</button>
    `;
    const btn = document.getElementById("ncTop");
    window.addEventListener("scroll", () => { btn.classList.toggle("show", window.scrollY > 400); });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  window.productCard = function (p) {
    return `<div class="nc-card">
      <span class="discount">-${p.discount}%</span>
      <div class="thumb" style="background: url(${p.img}); background-size: cover; background-position: center center;"></div>
      <div class="body">
        <div class="brand">${p.brand}</div>
        <a href="product-details.html?id=${p.id}"><div class="title">${p.title}</div></a>
        <div class="stars">${"★".repeat(Math.floor(p.rating))}${"☆".repeat(5 - Math.floor(p.rating))} <span class="text-muted-nc">(${p.rating})</span></div>
        <div class="price mt-1">₹${(p.price * 90).toFixed(0, 2)}<small>₹${(p.old * 90).toFixed(0, 2)}</small></div>
        <button class="add" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>`;
  };



  // Cart
  window.cart = JSON.parse(localStorage.getItem("cart")) || {
    items: [],
    total: 0
  };
  console.log("In app js: ", window.cart.items.length);

  window.addToCart = function (productId) {
    const existing = window.cart.items.find(item => item.id === productId);

    if (existing) {
      existing.quantity++;
    } else {
      window.cart.items.push({
        id: productId,
        quantity: 1
      });
    }

    // update total quantity
    window.cart.total = window.cart.items.reduce((sum, item) => sum += item.quantity, 0);

    localStorage.setItem("cart", JSON.stringify(window.cart));

    ncToast("Added to cart");
  }

  window.removeFromCart = function (productId) {

    // Remove the product
    window.cart.items = window.cart.items.filter(item => item.id !== productId);
    console.log("after click remove: ", window.cart.items);

    // Update total quantity
    window.cart.total = window.cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(window.cart));

    ncToast("Item removed from cart");
  };

  window.ncToast = function (msg) {
    let t = document.getElementById("ncToastEl");
    if (!t) { t = document.createElement("div"); t.id = "ncToastEl"; t.className = "nc-toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._to);
    t._to = setTimeout(() => t.classList.remove("show"), 2200);
  };

  // Countdown for flash timers
  window.ncCountdown = function (sel) {
    const els = document.querySelectorAll(sel);
    if (!els.length) return;
    let end = new Date(); end.setHours(end.getHours() + 8, end.getMinutes() + 42, end.getSeconds() + 15);
    function tick() {
      const d = Math.max(0, end - new Date());
      const h = Math.floor(d / 3600000), m = Math.floor(d % 3600000 / 60000), s = Math.floor(d % 60000 / 1000);
      els.forEach(el => {
        el.innerHTML = `<div>${String(h).padStart(2, '0')}<small>Hours</small></div><div>${String(m).padStart(2, '0')}<small>Mins</small></div><div>${String(s).padStart(2, '0')}<small>Secs</small></div>`;
      });
    }
    tick(); setInterval(tick, 1000);
  };



  document.addEventListener("DOMContentLoaded", async () => {

    if (needsRedirect) return; // navigating to login.html already, skip the rest

    await window.NovaCart.ready;
    const nav = document.getElementById("nc-navbar");
    const ft = document.getElementById("nc-footer");
    if (nav) renderNavbar(nav);
    if (ft) renderFooter(ft);

    // Password show/hide
    document.querySelectorAll("[data-toggle-password]").forEach(btn => {
      btn.addEventListener("click", () => {
        const inp = document.querySelector(btn.dataset.togglePassword);
        if (!inp) return;
        inp.type = inp.type === "password" ? "text" : "password";
        btn.textContent = inp.type === "password" ? "Show" : "Hide";
      });
    });

    // OTP auto-advance
    const otps = document.querySelectorAll(".nc-otp input");
    otps.forEach((inp, i) => {
      inp.addEventListener("input", e => {
        if (e.target.value && i < otps.length - 1) otps[i + 1].focus();
      });
      inp.addEventListener("keydown", e => {
        if (e.key === "Backspace" && !inp.value && i > 0) otps[i - 1].focus();
      });
    });
  });
})();