document.addEventListener('DOMContentLoaded', () => {
    const catGrid = document.getElementById('catGrid');
    const catSections = document.getElementById('catSections');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.15 });

    const observeReveals = (root = document) => {
        root.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    };

    // ---- Skeleton state (shown immediately, before data is ready) ----
    const skeletonTileMarkup = () => `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="nc-skel-tile">
            <div class="nc-skel nc-skel-thumb"></div>
            <div class="nc-skel nc-skel-line" style="width:70%;margin:0 auto 6px"></div>
            <div class="nc-skel nc-skel-line" style="width:45%;margin:0 auto"></div>
          </div>
        </div>`;

    const skeletonCardMarkup = () => `
        <div class="col-6 col-md-4 col-lg-3">
          <div class="nc-skel-card">
            <div class="nc-skel nc-skel-img"></div>
            <div class="nc-skel nc-skel-line" style="width:85%"></div>
            <div class="nc-skel nc-skel-line" style="width:50%"></div>
          </div>
        </div>`;

    const skeletonSectionMarkup = () => `
        <div class="mb-5">
          <div class="nc-section-head">
            <div class="nc-skel nc-skel-title"></div>
          </div>
          <div class="row g-3">
            ${Array.from({ length: 4 }).map(skeletonCardMarkup).join('')}
          </div>
        </div>`;

    catGrid.innerHTML = Array.from({ length: 6 }).map(skeletonTileMarkup).join('');
    catSections.innerHTML = Array.from({ length: 2 }).map(skeletonSectionMarkup).join('');

    // ---- Real content, rendered once data is actually available ----
    const renderCategories = () => {
        const categories = (NovaCart.categories || []);
        const products = (NovaCart.products || []);

        if (!categories.length) {
            catGrid.innerHTML = `<p class="text-muted-nc">No categories found.</p>`;
            catSections.innerHTML = '';
            return;
        }

        catGrid.innerHTML = categories.map(c => `
          <div class="col-6 col-md-4 col-lg-3">
            <a href="products.html">
              <div class="nc-cat py-3">
                <div class="thumb" style="width:64px;height:64px;margin:0 auto 12px;border-radius:12px;background:url(${c.img}) center/cover no-repeat"></div>
                <h5>${c.name}</h5>
                <p>${c.count} products</p>
              </div>
            </a>
          </div>`).join('');

        catSections.innerHTML = categories.map(c => {
            const catProducts = products.filter(p =>
                (p.cat || '').toLowerCase() === (c.name || '').toLowerCase()
            );

            return `
            <div class="mb-5">
              <div class="nc-section-head">
                <h2>${c.name}</h2>
              </div>
              <div class="row g-3">
                ${catProducts.length
                    ? catProducts.map(p => `<div class="col-6 col-md-4 col-lg-3 reveal">${productCard(p)}</div>`).join('')
                    : `<div class="col-12"><p class="text-muted-nc">No products in this category yet.</p></div>`
                }
              </div>
            </div>`;
        }).join('');

        observeReveals(catGrid);
        observeReveals(catSections);
    };

    // NovaCart.ready resolves once NovaCart.products/categories are actually populated,
    // avoiding the race condition where this script would otherwise run before the data existed.
    if (window.NovaCart && NovaCart.ready) {
        NovaCart.ready
            .then(renderCategories)
            .catch(() => {
                catGrid.innerHTML = `<p class="text-muted-nc">Couldn't load categories. Please refresh.</p>`;
                catSections.innerHTML = '';
            });
    } else {
        // Fallback in case NovaCart.ready isn't present for some reason
        catGrid.innerHTML = `<p class="text-muted-nc">Couldn't load categories. Please refresh.</p>`;
        catSections.innerHTML = '';
    }

    observeReveals();
});