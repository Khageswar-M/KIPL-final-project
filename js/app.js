/* NovaCart - Shared JS */
(function () {
  const NAV_LINKS = [
    { href: "home.html", label: "Products" },
    { href: "products.html", label: "Shop" },
    { href: "categories.html", label: "Categories" },
    { href: "about.html", label: "About" },
    { href: "contact.html", label: "Contact" }
  ];

  window.NovaCart = {
    products: [
      {
        id: 1,
        title: "Aurora Wireless Headphones",
        brand: "Sonicwave",
        price: 129, old: 189,
        rating: 4.8,
        discount: 32,
        img: "https://i.pinimg.com/control1/1200x/d1/fe/28/d1fe282fdaea14a1354eb2c855e9068c.jpg",
        cat: "Audio"
      },
      {
        id: 2,
        title: "Nimbus Smart Watch Pro",
        brand: "Chronos",
        price: 249,
        old: 329,
        rating: 4.7,
        discount: 24,
        img: "https://i.pinimg.com/1200x/97/12/34/971234ec72999b1b702575537d42e480.jpg",
        cat: "Wearables"
      },
      {
        id: 3,
        title: "Vertex 4K Action Cam",
        brand: "Lensix",
        price: 319,
        old: 399,
        rating: 4.6,
        discount: 20,
        img: "https://i.pinimg.com/1200x/bd/04/03/bd04031cd1dd61455fbb58aee0f48896.jpg",
        cat: "Cameras"
      },
      {
        id: 4,
        title: "Zenith Mechanical Keyboard",
        brand: "Keytron",
        price: 99,
        old: 139,
        rating: 4.9,
        discount: 28,
        img: "https://i.pinimg.com/1200x/6e/10/52/6e105243846ef52a9581785e513fe4f7.jpg",
        cat: "Computers"
      },
      {
        id: 5,
        title: "Orbit Wireless Mouse",
        brand: "Keytron",
        price: 49,
        old: 69,
        rating: 4.5,
        discount: 29,
        img: "https://i.pinimg.com/1200x/84/3b/67/843b676340d579d021b089e7a37b6a2c.jpg",
        cat: "Computers"

      },
      {
        id: 6,
        title: "Nova Portable Speaker",
        brand: "Sonicwave",
        price: 79,
        old: 119,
        rating: 4.4,
        discount: 33,
        img: "https://i.pinimg.com/736x/b4/13/1c/b4131c738b31f6388990d41e80acfca6.jpg",
        cat: "Audio"

      },
      {
        id: 7,
        title: "Pulse Fitness Band",
        brand: "Chronos",
        price: 59,
        old: 89,
        rating: 4.3,
        discount: 33,
        img: "https://i.pinimg.com/736x/08/a9/d4/08a9d46b2eee874b2f33a5ab31ecd1a4.jpg",
        cat: "Wearables"

      },
      {
        id: 8,
        title: "Flux Gaming Console",
        brand: "Playtron",
        price: 499,
        old: 599,
        rating: 4.9,
        discount: 16,
        img: "https://i.pinimg.com/736x/77/25/b5/7725b50bdc733f3525f53147cba98f67.jpg",
        cat: "Gaming"

      },
      {
        id: 9,
        title: "Halo Smart Ring",
        brand: "Chronos",
        price: 189,
        old: 229,
        rating: 4.2,
        discount: 17,
        img: "https://i.pinimg.com/1200x/cd/96/a8/cd96a8f6a992d7c4e5a1ad3572cd04db.jpg",
        cat: "Wearables"

      },
      {
        id: 10,
        title: "Comet Drone Explorer",
        brand: "Lensix",
        price: 449,
        old: 549,
        rating: 4.6,
        discount: 18,
        img: "https://i.pinimg.com/1200x/b0/77/c6/b077c64cca3611d4c77d1257065a52b8.jpg",
        cat: "Cameras"

      },
      {
        id: 11,
        title: "Prism VR Headset",
        brand: "Playtron",
        price: 349,
        old: 429,
        rating: 4.5,
        discount: 18,
        img: "https://i.pinimg.com/736x/36/f4/94/36f494483816ecca8645a7a65b81a667.jpg",
        cat: "Gaming"

      },
      {
        id: 12,
        title: "Solaris Power Bank 20K",
        brand: "Voltix",
        price: 39,
        old: 59,
        rating: 4.7,
        discount: 33,
        img: "https://i.pinimg.com/control1/1200x/2c/c9/df/2cc9dfcbff71e6606f85f7b37471ce89.jpg",
        cat: "Accessories"

      }
    ],
    categories: [
      {
        name: "Audio",
        img: "https://i.pinimg.com/control1/1200x/d1/fe/28/d1fe282fdaea14a1354eb2c855e9068c.jpg",
        count: 142

      },
      {
        name: "Wearables",
        img: "https://i.pinimg.com/1200x/9a/b1/2c/9ab12cc297b2da1203cf11e0e9d7012e.jpg",
        count: 98

      },
      {
        name: "Cameras",
        img: "https://i.pinimg.com/736x/47/3a/fb/473afbade22da50e708ab05ca1aeac27.jpg",
        count: 76

      },
      {
        name: "Computers",
        img: "https://i.pinimg.com/1200x/10/44/86/104486db81ab6f355d0af1273527a19c.jpg",
        count: 210

      },
      {
        name: "Gaming",
        img: "https://i.pinimg.com/1200x/09/ca/b4/09cab4f5c1b20bd8b2eba0665616e384.jpg",
        count: 154

      },
      {
        name: "Phones",
        img: "https://i.pinimg.com/736x/4a/7c/c0/4a7cc03930c9432d380ce625f71e699d.jpg",
        count: 88

      },
      {
        name: "Home",
        img: "https://i.pinimg.com/736x/40/62/35/4062351cfafce06b226e40df965bba27.jpg",
        count: 301

      },
      {
        name: "Fashion",
        img: "https://i.pinimg.com/736x/62/f8/f4/62f8f4451b04651ded48039725bc77b5.jpg",
        count: 520

      }
    ],
    brands: ["Sonicwave", "Chronos", "Lensix", "Keytron", "Playtron", "Voltix", "Zephyr", "Nebula"]
  };

  function currentPage() {
    const p = location.pathname.split("/").pop() || "index.html";
    return p;
  }

  function renderNavbar(target) {
    const active = currentPage();
    const links = NAV_LINKS.map(l => `<li class="nav-item"><a class="nav-link ${active === l.href ? 'active' : ''}" href="${l.href}">${l.label}</a></li>`).join("");
    target.innerHTML = `
      <div class="nc-announce">Free shipping on orders over $75 &nbsp;·&nbsp; Use code <b>NOVA20</b> for 20% off &nbsp;·&nbsp; <a href="products.html">Shop deals</a></div>
      <nav class="nc-nav navbar navbar-expand-lg">
        <div class="container-nc w-100 d-flex flex-column flex-lg-row justify-content-between align-items-center gap-3">
          <div class="w-100 d-flex justify-content-between align-items-center">
    <a href="index.html"
       class="navbar-brand d-flex align-items-center justify-content-center m-0 py-0">

        <img
            src="../images/AppLogo.png"
            alt="NovaCart Logo"
            class="img-fluid"
            style="max-height: 50px; width: auto; scale: 2">
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
            <form class="nc-search d-flex" action="search.html">
              <input name="q form-control" placeholder="Search..." />
              <button type="submit">Search</button>
            </form>
            <div class="d-flex align-items-center gap-2 ms-lg-3 mt-3 mt-lg-0">
              <a href="wishlist.html" class="nc-icon-btn" title="Wishlist">
                <i class="fa-regular fs-5 fa-heart"></i>
                <span class="nc-badge">3</span>
              </a>
              <a href="compare.html" class="nc-icon-btn" title="Compare"><i class="fa-solid fa-code-compare"></i></a>
              <a href="cart.html" class="nc-icon-btn" title="Cart"><i class="fa-solid fa-cart-shopping"></i><span class="nc-badge">2</span></a>
              <a href="profile.html" class="nc-icon-btn" title="Account"><i class="fa-regular fa-user"></i></a>
              <a href="login.html" class="btn-nc d-none d-lg-inline-flex" style="padding:8px 18px;font-size:13px">Login</a>
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
            <div class="col-lg-4 col-md-6">
              <a class="navbar-brand " href="home.html" style="text-align: center">
                <img src="../images/AppLogo.png" style="scale: 5; align-self: center;" height="50"  width:"100"/>
              </a>
              <p class="brand-desc">The next generation shopping experience. Discover premium electronics, gadgets, fashion and more — delivered fast, guaranteed genuine.</p>
              <div class="socials mt-3">
    <a href="#"><i class="fa-brands fa-x-twitter"></i></a>
    <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
    <a href="#"><i class="fa-brands fa-instagram"></i></a>
    <a href="#"><i class="fa-brands fa-youtube"></i></a>
</div>
            </div>
            <div class="col-lg-2 col-md-6 col-6"><h6>Shop</h6>
              <a href="products.html">All Products</a><a href="categories.html">Categories</a><a href="products.html">New Arrivals</a><a href="products.html">Best Sellers</a><a href="products.html">Deals</a>
            </div>
            <div class="col-lg-2 col-md-6 col-6"><h6>Account</h6>
              <a href="profile.html">My Profile</a><a href="orders.html">Orders</a><a href="wishlist.html">Wishlist</a><a href="address.html">Addresses</a><a href="notifications.html">Notifications</a>
            </div>
            <div class="col-lg-2 col-md-6 col-6"><h6>Help</h6>
              <a href="support.html">Support</a><a href="faq.html">FAQ</a><a href="contact.html">Contact</a><a href="about.html">About</a><a href="#">Shipping</a>
            </div>
            <div class="col-lg-2 col-md-6 col-6"><h6>Legal</h6>
              <a href="#">Terms</a><a href="#">Privacy</a><a href="#">Cookies</a><a href="#">Returns</a><a href="#">Warranty</a>
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
      <button class="wish" aria-label="wishlist">♡</button>
      <span class="discount">-${p.discount}%</span>
      <div class="thumb" style="background: url(${p.img}); background-size: cover; background-position: center center;"></div>
      <div class="body">
        <div class="brand">${p.brand}</div>
        <a href="product-details.html?id=${p.id}"><div class="title">${p.title}</div></a>
        <div class="stars">${"★".repeat(Math.floor(p.rating))}${"☆".repeat(5 - Math.floor(p.rating))} <span class="text-muted-nc">(${p.rating})</span></div>
        <div class="price mt-1">$${p.price}<small>$${p.old}</small></div>
        <button class="add" onclick="ncToast('Added to cart')">Add to Cart</button>
      </div>
    </div>`;
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

  document.addEventListener("DOMContentLoaded", () => {
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
