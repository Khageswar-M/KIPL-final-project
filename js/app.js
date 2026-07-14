/* NovaCart - Shared JS */
(function(){
  const NAV_LINKS = [
    {href:"home.html",label:"Home"},
    {href:"products.html",label:"Shop"},
    {href:"categories.html",label:"Categories"},
    {href:"about.html",label:"About"},
    {href:"contact.html",label:"Contact"}
  ];

  window.NovaCart = {
    products: [
      {id:1,title:"Aurora Wireless Headphones",brand:"Sonicwave",price:129,old:189,rating:4.8,discount:32,emoji:"🎧",cat:"Audio"},
      {id:2,title:"Nimbus Smart Watch Pro",brand:"Chronos",price:249,old:329,rating:4.7,discount:24,emoji:"⌚",cat:"Wearables"},
      {id:3,title:"Vertex 4K Action Cam",brand:"Lensix",price:319,old:399,rating:4.6,discount:20,emoji:"📷",cat:"Cameras"},
      {id:4,title:"Zenith Mechanical Keyboard",brand:"Keytron",price:99,old:139,rating:4.9,discount:28,emoji:"⌨️",cat:"Computers"},
      {id:5,title:"Orbit Wireless Mouse",brand:"Keytron",price:49,old:69,rating:4.5,discount:29,emoji:"🖱️",cat:"Computers"},
      {id:6,title:"Nova Portable Speaker",brand:"Sonicwave",price:79,old:119,rating:4.4,discount:33,emoji:"🔊",cat:"Audio"},
      {id:7,title:"Pulse Fitness Band",brand:"Chronos",price:59,old:89,rating:4.3,discount:33,emoji:"🎽",cat:"Wearables"},
      {id:8,title:"Flux Gaming Console",brand:"Playtron",price:499,old:599,rating:4.9,discount:16,emoji:"🎮",cat:"Gaming"},
      {id:9,title:"Halo Smart Ring",brand:"Chronos",price:189,old:229,rating:4.2,discount:17,emoji:"💍",cat:"Wearables"},
      {id:10,title:"Comet Drone Explorer",brand:"Lensix",price:449,old:549,rating:4.6,discount:18,emoji:"🚁",cat:"Cameras"},
      {id:11,title:"Prism VR Headset",brand:"Playtron",price:349,old:429,rating:4.5,discount:18,emoji:"🥽",cat:"Gaming"},
      {id:12,title:"Solaris Power Bank 20K",brand:"Voltix",price:39,old:59,rating:4.7,discount:33,emoji:"🔋",cat:"Accessories"}
    ],
    categories: [
      {name:"Audio",emoji:"🎧",count:142},
      {name:"Wearables",emoji:"⌚",count:98},
      {name:"Cameras",emoji:"📷",count:76},
      {name:"Computers",emoji:"💻",count:210},
      {name:"Gaming",emoji:"🎮",count:154},
      {name:"Phones",emoji:"📱",count:88},
      {name:"Home",emoji:"🏠",count:301},
      {name:"Fashion",emoji:"👕",count:520}
    ],
    brands: ["Sonicwave","Chronos","Lensix","Keytron","Playtron","Voltix","Zephyr","Nebula"]
  };

  function currentPage(){
    const p = location.pathname.split("/").pop() || "index.html";
    return p;
  }

  function renderNavbar(target){
    const active = currentPage();
    const links = NAV_LINKS.map(l=>`<li class="nav-item"><a class="nav-link ${active===l.href?'active':''}" href="${l.href}">${l.label}</a></li>`).join("");
    target.innerHTML = `
      <div class="nc-announce">🚀 Free shipping on orders over $75 &nbsp;·&nbsp; Use code <b>NOVA20</b> for 20% off &nbsp;·&nbsp; <a href="products.html">Shop deals</a></div>
      <nav class="nc-nav navbar navbar-expand-lg">
        <div class="container-nc w-100 d-flex align-items-center gap-3">
          <a class="navbar-brand" href="home.html"><span class="brand-dot"></span>NovaCart</a>
          <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#ncNav"><span class="navbar-toggler-icon" ></span></button>
          <div class="collapse navbar-collapse" id="ncNav">
            <ul class="navbar-nav me-auto">${links}</ul>
            <form class="nc-search d-none d-lg-flex" action="search.html">
              <input name="q" placeholder="Search products, brands, categories..." />
              <button type="submit">Search</button>
            </form>
            <div class="d-flex align-items-center gap-2 ms-lg-3 mt-3 mt-lg-0">
              <a href="wishlist.html" class="nc-icon-btn" title="Wishlist">♡<span class="nc-badge">3</span></a>
              <a href="compare.html" class="nc-icon-btn" title="Compare">⇌</a>
              <a href="cart.html" class="nc-icon-btn" title="Cart">🛒<span class="nc-badge">2</span></a>
              <a href="profile.html" class="nc-icon-btn" title="Account">👤</a>
              <a href="login.html" class="btn-nc d-none d-lg-inline-flex" style="padding:8px 18px;font-size:13px">Login</a>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  function renderFooter(target){
    target.innerHTML = `
      <footer class="nc-footer">
        <div class="container-nc">
          <div class="row g-4">
            <div class="col-lg-4 col-md-6">
              <a class="navbar-brand " href="home.html" style="font-family:'Space Grotesk';font-weight:800;font-size:24px"><span class="brand-dot" style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--nc-gradient);margin-right:8px"></span>NovaCart</a>
              <p class="brand-desc">The next generation shopping experience. Discover premium electronics, gadgets, fashion and more — delivered fast, guaranteed genuine.</p>
              <div class="socials mt-3">
                <a href="#">𝕏</a><a href="#">f</a><a href="#">📷</a><a href="#">▶</a>
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
    window.addEventListener("scroll",()=>{ btn.classList.toggle("show", window.scrollY>400); });
    btn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  }

  window.productCard = function(p){
    return `<div class="nc-card">
      <button class="wish" aria-label="wishlist">♡</button>
      <span class="discount">-${p.discount}%</span>
      <div class="thumb" data-emoji="${p.emoji}"></div>
      <div class="body">
        <div class="brand">${p.brand}</div>
        <a href="product-details.html?id=${p.id}"><div class="title">${p.title}</div></a>
        <div class="stars">${"★".repeat(Math.floor(p.rating))}${"☆".repeat(5-Math.floor(p.rating))} <span class="text-muted-nc">(${p.rating})</span></div>
        <div class="price mt-1">$${p.price}<small>$${p.old}</small></div>
        <button class="add" onclick="ncToast('Added to cart')">Add to Cart</button>
      </div>
    </div>`;
  };

  window.ncToast = function(msg){
    let t = document.getElementById("ncToastEl");
    if(!t){ t = document.createElement("div"); t.id="ncToastEl"; t.className="nc-toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._to);
    t._to = setTimeout(()=>t.classList.remove("show"),2200);
  };

  // Countdown for flash timers
  window.ncCountdown = function(sel){
    const els = document.querySelectorAll(sel);
    if(!els.length) return;
    let end = new Date(); end.setHours(end.getHours()+8, end.getMinutes()+42, end.getSeconds()+15);
    function tick(){
      const d = Math.max(0, end - new Date());
      const h = Math.floor(d/3600000), m = Math.floor(d%3600000/60000), s = Math.floor(d%60000/1000);
      els.forEach(el=>{
        el.innerHTML = `<div>${String(h).padStart(2,'0')}<small>Hours</small></div><div>${String(m).padStart(2,'0')}<small>Mins</small></div><div>${String(s).padStart(2,'0')}<small>Secs</small></div>`;
      });
    }
    tick(); setInterval(tick,1000);
  };

  document.addEventListener("DOMContentLoaded",()=>{
    const nav = document.getElementById("nc-navbar");
    const ft  = document.getElementById("nc-footer");
    if(nav) renderNavbar(nav);
    if(ft)  renderFooter(ft);

    // Password show/hide
    document.querySelectorAll("[data-toggle-password]").forEach(btn=>{
      btn.addEventListener("click",()=>{
        const inp = document.querySelector(btn.dataset.togglePassword);
        if(!inp) return;
        inp.type = inp.type==="password" ? "text" : "password";
        btn.textContent = inp.type==="password" ? "Show" : "Hide";
      });
    });

    // OTP auto-advance
    const otps = document.querySelectorAll(".nc-otp input");
    otps.forEach((inp,i)=>{
      inp.addEventListener("input",e=>{
        if(e.target.value && i<otps.length-1) otps[i+1].focus();
      });
      inp.addEventListener("keydown",e=>{
        if(e.key==="Backspace" && !inp.value && i>0) otps[i-1].focus();
      });
    });
  });
})();
