document.addEventListener("DOMContentLoaded", async () => {
    await NovaCart.ready;
    console.log(NovaCart.selectedCategory);
    document.getElementById("catGrid").innerHTML =
        NovaCart.categories.map(c => `
        <div class="col-12 col-md-4 col-lg-3">
            <a href="products.html" class="text-decoration-none text-dark"
              onclick="NovaCart.setSelectedCategory('${c.name}')"
            >
                <div class="nc-cat card-hover pb-2">

                    <div
                        class="nc-cat-img d-flex justify-content-center align-items-center"
                        style="background-image: url('${c.img}'); background-size: cover; background-position: center center">
                    </div>

                    <h5 class="mt-3 mb-1">${c.name}</h5>
                    <p class="mb-0 text-muted">${c.count} Products</p>
                </div>
            </a>
        </div>
      `).join("");

    document.getElementById("brandGrid").innerHTML =
        NovaCart.brands.slice(0, 10).map(b => `
        <div class="col-6 col-md-3">
            <div class="nc-brand card-hover  ">
                ${b}
            </div>
        </div>
      `).join("");


    console.log("Length", NovaCart.products.length);
    document.getElementById("pgrid").innerHTML =
        NovaCart.products.slice(0, 25).map(p => `
        <div class="col-6 col-md-4 col-lg-3  ">
            ${productCard(p)}
        </div>
    `).join("");

    document.getElementById("pgrid2").innerHTML =
        NovaCart.products.slice(4, 12).map(p => `
        <div class="col-6 col-md-4 col-lg-3  ">
            ${productCard(p)}
        </div>
    `).join("");

    ncCountdown("#flashTimer");

    // Observe AFTER elements are created
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }
        });
    }, {
        threshold: 0.15
    });

    document.querySelectorAll(".reveal").forEach(el => {
        observer.observe(el);
    });

});