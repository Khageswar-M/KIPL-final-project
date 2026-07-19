document.addEventListener('DOMContentLoaded', async () => {
    await NovaCart.ready;

    // ---------- DOM refs ----------
    const grid = document.getElementById("pgrid");
    const categoryContainer = document.getElementById("categoriesListWithAllAvailableProducts");
    const brandsContainer = document.getElementById("brandsList");
    const priceRangeContainer = document.getElementById("priceRange");
    const priceRangeInput = document.getElementById("rangeInput");
    const priceUnder = document.getElementById("priceUnder");
    const currentCategories = document.getElementById("currentCategoryList");
    const sortSelect = document.getElementById("sortSelect");
    const paginationEl = document.querySelector(".nc-pag");

    const PRODUCTS_PER_PAGE = 12;

    // ---------- Single source of truth ----------
    const filters = {
        categories: [],
        brands: [],
        maxPrice: Infinity,
        minRating: 0,
        minDiscount: 0,
        page: 1,
        sortBy: "Popularity"
    };

    // Preselect category coming from sessionStorage (same behavior as before)
    const incomingCategory = sessionStorage.getItem("selectedCategory") || "All";
    if (incomingCategory && incomingCategory !== "All") {
        filters.categories.push(incomingCategory);
    }

    // ---------- Helpers ----------
    function formatCategory(category) {
        const availableProductsCount = NovaCart.products.filter(p => p.cat === category).length;
        return category
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ") + ` (${availableProductsCount})`;
    }

    function priceInINR(product) {
        return product.price * 90;
    }

    // Applies category + brand + rating + discount filters ONLY.
    // Price is deliberately excluded here so the price-range slider's own
    // min/max bounds are computed from the full eligible set, not from
    // whatever the slider is currently set to (which would cause the
    // slider's max to shrink every time you drag it and never come back up).
    function applyNonPriceFilters(products) {
        return products.filter(p => {
            if (filters.categories.length && !filters.categories.includes(p.cat)) return false;
            if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
            if ((p.rating ?? 0) < filters.minRating) return false;
            if ((p.discount ?? 0) < filters.minDiscount) return false;
            return true;
        });
    }

    function sortProducts(products) {
        const list = [...products];
        switch (filters.sortBy) {
            case "Newest":
                return list.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
            case "Price ↑":
                return list.sort((a, b) => a.price - b.price);
            case "Price ↓":
                return list.sort((a, b) => b.price - a.price);
            case "Rating":
                return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
            case "Popularity":
            default:
                return list.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
        }
    }

    // ---------- Build static filter lists (once) ----------
    categoryContainer.innerHTML = NovaCart.categories
        .map(category => `
          <label class="nc-check">
            <input type="checkbox" class="category-check" value="${category.name}"
              style="cursor:pointer;" ${filters.categories.includes(category.name) ? "checked" : ""}>
            ${formatCategory(category.name)}
          </label>
        `).join("");

    brandsContainer.innerHTML = NovaCart.brands.map(brand => `
        <label class="nc-check">
          <input type="checkbox" class="brand-check" value="${brand}" style="cursor:pointer;"> ${brand}
        </label>
      `).join("");

    const categoryCheckboxes = categoryContainer.querySelectorAll(".category-check");
    const brandCheckboxes = brandsContainer.querySelectorAll(".brand-check");
    const ratingCheckboxes = document.querySelectorAll(".rating-check");
    const discountCheckboxes = document.querySelectorAll(".discount-check");

    // ---------- Wire up events (every one just mutates `filters` then re-renders) ----------
    categoryCheckboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            filters.categories = [...categoryCheckboxes].filter(c => c.checked).map(c => c.value);
            filters.page = 1;
            render();
        });
    });

    brandCheckboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            filters.brands = [...brandCheckboxes].filter(c => c.checked).map(c => c.value);
            filters.page = 1;
            render();
        });
    });

    ratingCheckboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            const checkedValues = [...ratingCheckboxes]
                .filter(c => c.checked)
                .map(c => Number(c.dataset.value));
            filters.minRating = checkedValues.length ? Math.max(...checkedValues) : 0;
            filters.page = 1;
            render();
        });
    });

    discountCheckboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            const checkedValues = [...discountCheckboxes]
                .filter(c => c.checked)
                .map(c => Number(c.dataset.value));
            filters.minDiscount = checkedValues.length ? Math.max(...checkedValues) : 0;
            filters.page = 1;
            render();
        });
    });

    priceRangeInput.addEventListener("input", () => {
        filters.maxPrice = Number(priceRangeInput.value);
        priceUnder.textContent = `Under ₹${priceRangeInput.value}`;
        filters.page = 1;
        render();
    });

    sortSelect.addEventListener("change", () => {
        filters.sortBy = sortSelect.value;
        render();
    });

    // ---------- Price slider bounds (depends on currently category/brand/rating/discount-filtered set) ----------
    function updatePriceRangeBounds(products) {
        if (products.length === 0) {
            priceRangeInput.disabled = true;
            priceRangeContainer.innerHTML = `<span>₹0</span><span>₹0</span>`;
            priceUnder.textContent = "No products";
            return;
        }

        const minPrice = Math.min(...products.map(priceInINR));
        const maxPrice = Math.max(...products.map(priceInINR));

        priceRangeInput.disabled = false;
        priceRangeInput.min = minPrice;
        priceRangeInput.max = maxPrice;

        // Only reset the slider's value/maxPrice filter the first time bounds are (re)computed
        // for a fresh filter combo, so we don't fight the user's own drag on every render.
        if (!Number.isFinite(filters.maxPrice) || filters.maxPrice < minPrice || filters.maxPrice > maxPrice) {
            priceRangeInput.value = maxPrice;
            filters.maxPrice = maxPrice;
        }

        priceRangeContainer.innerHTML = `
          <span>₹${minPrice}</span>
          <span>₹${maxPrice}</span>
        `;
        priceUnder.textContent = `Under ₹${priceRangeInput.value}`;
    }

    // ---------- Selected category pills ----------
    function renderSelectedCategoryPills() {
        currentCategories.innerHTML = filters.categories
            .map(category => `
            <span class="btn-nc-ghost remove-category" data-category="${category}"
              style="padding:6px 12px;font-size:12px;cursor:pointer;">
              ${formatCategory(category)} ✕
            </span>
          `).join("");

        currentCategories.querySelectorAll(".remove-category").forEach(btn => {
            btn.addEventListener("click", () => {
                const cb = [...categoryCheckboxes].find(c => c.value === btn.dataset.category);
                if (cb) {
                    cb.checked = false;
                    filters.categories = [...categoryCheckboxes].filter(c => c.checked).map(c => c.value);
                    filters.page = 1;
                    render();
                }
            });
        });
    }

    // ---------- Pagination ----------
    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / PRODUCTS_PER_PAGE);

        if (totalPages <= 1) {
            paginationEl.innerHTML = "";
            return;
        }

        let html = `<a data-page="prev" class="${filters.page === 1 ? "disabled" : ""}">‹</a>`;
        for (let i = 1; i <= totalPages; i++) {
            html += `<a data-page="${i}" class="${filters.page === i ? "active" : ""}">${i}</a>`;
        }
        html += `<a data-page="next" class="${filters.page === totalPages ? "disabled" : ""}">›</a>`;

        paginationEl.innerHTML = html;

        paginationEl.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", () => {
                const page = a.dataset.page;
                if (page === "prev" && filters.page > 1) filters.page--;
                else if (page === "next" && filters.page < totalPages) filters.page++;
                else if (!isNaN(page)) filters.page = Number(page);
                render();
            });
        });
    }

    // ---------- Product grid ----------
    function renderGrid(pageItems, hasAnyCategorySelectedOrAll) {
        if (!grid) return;

        if (!hasAnyCategorySelectedOrAll) {
            grid.innerHTML = `
            <div class="col-12 text-center py-5">
              <i class="fa-regular fa-folder-open fa-4x text-secondary mb-3"></i>
              <h3 class="fw-bold">No Category Selected</h3>
              <p class="text-muted mb-0">Please select at least one category to view products.</p>
            </div>
          `;
            return;
        }

        grid.innerHTML = pageItems
            .map(p => `<div class="col-6 col-md-4 col-lg-3">${productCard(p)}</div>`)
            .join("");
    }

    // ---------- Master render: one function drives everything off `filters` ----------
    function render() {
        renderSelectedCategoryPills();

        // Note: matches original behavior — if no category checked, empty categories array
        // means "show everything", EXCEPT the grid explicitly shows the empty state only when
        // the category list panel itself has zero checked boxes (kept from your original logic).
        const anyCategoryChecked = [...categoryCheckboxes].some(cb => cb.checked);

        const eligible = applyNonPriceFilters(NovaCart.products);
        updatePriceRangeBounds(eligible);

        // Apply the price filter last, against the slider's current value
        const filtered = eligible.filter(p => priceInINR(p) <= filters.maxPrice);
        const sorted = sortProducts(filtered);

        renderPagination(sorted.length);

        const start = (filters.page - 1) * PRODUCTS_PER_PAGE;
        const pageItems = sorted.slice(start, start + PRODUCTS_PER_PAGE);

        renderGrid(pageItems, anyCategoryChecked);
    }

    render();

    // ---------- Reveal-on-scroll (unchanged) ----------
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("active");
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});