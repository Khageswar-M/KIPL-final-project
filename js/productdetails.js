document.addEventListener('DOMContentLoaded', () => {

    const quantity = document.getElementById("quantityInput");
    const categoryName = document.getElementById("categoryName");
    const reviewContainer = document.getElementById("reviewContainer");
    const mainImg = document.getElementById("mainImg");
    const thumbContainer = document.getElementById("thumbContainer");
    const similarProductContainer = document.getElementById('pgrid');

    let product;

    const params = new URLSearchParams(window.location.search);
    const productId = Number(params.get("id"));

    const addToCartBtn = document.getElementById("addToCartBtn");
    const buyNowBtn = document.getElementById("buyNowBtn");

    addToCartBtn.addEventListener("click", () => {
        window.addToCart(productId);
    });

    buyNowBtn.addEventListener("click", () => {
        window.addToCart(productId);
        window.location.href = "cart.html"; // straight to checkout with this item already in the cart
    });


    async function loadProduct() {



        if (!productId) {
            window.location.href = "products.html";
            return;
        }

        try {

            const response = await fetch(
                `https://dummyjson.com/products/${productId}`
            );

            product = await response.json();

            renderSimilarProducts(product.category);

            document.getElementById("title").textContent = product.title;
            document.getElementById("brand").textContent = product.brand;
            document.getElementById("description").textContent = product.description;
            categoryName.innerHTML = `<i>${product.category}</i>`

            document.querySelectorAll(".rating").forEach(element => {
                element.textContent = `⭐ ${product.rating}`;
            });



            mainImg.style.backgroundImage = `url('${product.thumbnail}')`;
            mainImg.style.backgroundSize = "cover";
            mainImg.style.backgroundPosition = "center";

            thumbContainer.innerHTML = "";

            product.images.forEach((img, index) => {
                thumbContainer.innerHTML += `
                <div class="t ${index === 0 ? "active" : ""}" data-img="${img}">
                    <img src="${img}" width="100%">
                </div>
            `;
            });



            document.getElementById("return").innerText = product.returnPolicy;

            quantity.min = 1;
            quantity.max = product.minimumOrderQuantity;
            updatePrice();

            quantity.addEventListener("input", () => {
                if (+quantity.value < +quantity.min) {
                    quantity.value = quantity.min;
                }

                if (+quantity.value > +quantity.max) {
                    quantity.value = quantity.max;
                }

                updatePrice();
            });

            reviewContainer.innerHTML = product.reviews.map((rev, id) => {
                return (
                    `   
                    <div key={${id}} class="nc-testi">
                        <div class="stars">★ ${rev.rating}</div>
                        <p>"${rev.comment}"</p>
                        <div class="who">
                            <div class="av">${rev.reviewerName.trim().charAt(0).toUpperCase()}</div>
                            <div>
                                <h6>${rev.reviewerName}</h6><small>Verified purchase · 1 week ago</small>
                            </div>
                        </div>
                    </div>
                    `
                )
            })



        } catch (err) {
            console.error(err);
        }

    }

    loadProduct();

    thumbContainer.querySelectorAll(".t").forEach(thumb => {
        thumb.addEventListener("click", () => {
            // swap the main image
            mainImg.style.backgroundImage = `url('${thumb.dataset.img}')`;

            // move the "active" class to the clicked thumb
            thumbContainer.querySelectorAll(".t").forEach(t => t.classList.remove("active"));
            thumb.classList.add("active");
        });
    });

    thumbContainer.addEventListener("click", (e) => {
        const thumb = e.target.closest(".t");
        if (!thumb) return;

        mainImg.style.backgroundImage = `url('${thumb.dataset.img}')`;
        thumbContainer.querySelectorAll(".t").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
    });


    function updatePrice() {
        const quantityValue = Number(quantity.value);

        const currentPrice = product.price * 90 * quantityValue;

        const oldPrice =
            (product.price * 90 / (1 - product.discountPercentage / 100))
            * quantityValue;

        document.getElementById("price").innerHTML = `
        ₹${currentPrice.toFixed(0)}
        <small>₹${oldPrice.toFixed(0)}</small>
    `;
    }

    async function renderSimilarProducts(category) {
        try {
            await window.NovaCart.ready;
            const allProducts = window.NovaCart.products.filter(p => p.cat === category);
            similarProductContainer.innerHTML = allProducts.map(prd => `<div class="col-6 col-md-4 col-lg-3">
            ${productCard(prd)}
            </div>`).join('');
        } catch (error) {
            console.error(error);
        }
    }
});