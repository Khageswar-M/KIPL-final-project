document.addEventListener("DOMContentLoaded", () => {

  // ---------- Order summary ----------

  const subtotalAmount = document.getElementById("subtotalAmount");
  const shippingCharge = document.getElementById("shippingCharge");
  const deliveryCharge = document.getElementById("deliveryCharge");
  const taxAmount = document.getElementById("taxAmount");
  const discountAmount = document.getElementById("discountAmount");
  const totalAmount = document.getElementById("totalAmount");
  const shippingOptions = document.querySelectorAll('input[name="d"]');

  const PRICE_SUMMARY_KEY = "novacart_price_summary";

  function getPriceSummary() {
    return JSON.parse(localStorage.getItem(PRICE_SUMMARY_KEY)) || {
      subtotal: 0,
      shipping: 0,
      tax: 0,
      discount: 0,
      total: 0
    };
  }

  const summary = getPriceSummary();

  // Static fields — these don't change when delivery option changes
  subtotalAmount.innerText = `₹${summary.subtotal.toFixed(0)}`;
  shippingCharge.innerText = summary.shipping === 0 ? "Free" : `₹${summary.shipping.toFixed(0)}`;
  taxAmount.innerText = `₹${summary.tax.toFixed(0)}`;
  discountAmount.innerText = `-₹${summary.discount.toFixed(0)}`;

  function getSelectedDeliveryAmount() {
    const checked = document.querySelector('input[name="d"]:checked');
    return checked ? Number(checked.value) || 0 : 0;
  }

  function updateTotal() {
    const deliverAmt = getSelectedDeliveryAmount();

    deliveryCharge.innerText = `₹${deliverAmt.toFixed(0)}`;

    const totalAmt = summary.subtotal + summary.shipping + summary.tax - summary.discount + deliverAmt;
    totalAmount.innerText = `₹${totalAmt.toFixed(0)}`;
  }

  // Recalculate whenever the user picks a different delivery option
  shippingOptions.forEach(option => {
    option.addEventListener("change", updateTotal);
  });

  // Initial render
  updateTotal();

  // ---------- Address selection ----------

  const ADDRESS_KEY = "novacart_addresses";
  const SELECTED_ADDRESS_KEY = "novacart_selected_address";

  function getAddresses() {
    return JSON.parse(localStorage.getItem(ADDRESS_KEY)) || [];
  }

  function getSelectedAddressId() {
    const addresses = getAddresses();
    const stored = localStorage.getItem(SELECTED_ADDRESS_KEY);

    // Prefer the previously selected address if it still exists,
    // otherwise fall back to whichever address is marked default.
    if (stored && addresses.some(a => a.id === stored)) {
      return stored;
    }
    return addresses.find(a => a.isDefault)?.id ?? addresses[0]?.id ?? null;
  }

  window.selectAddress = function (id) {
    localStorage.setItem(SELECTED_ADDRESS_KEY, id);
    renderCheckoutAddresses();
  };

  function renderCheckoutAddresses() {
    const container = document.getElementById("checkoutAddressList");
    if (!container) return;

    const addresses = getAddresses();

    if (addresses.length === 0) {
      container.innerHTML = `<p class="text-muted-nc">No saved addresses. Please add one first.</p>`;
      return;
    }

    const selectedId = getSelectedAddressId();

    container.innerHTML = addresses
      .map(addr => `
        <div class="col-md-6">
          <div class="nc-address ${addr.id === selectedId ? "default" : ""}"
               style="cursor:pointer"
               onclick="selectAddress('${addr.id}')">
            ${addr.id === selectedId ? `<span class="tag">Selected</span>` : ""}
            <h6>${addr.label}</h6>
            <p class="text-muted-nc mb-1">${addr.name} · ${addr.phone}</p>
            <p class="text-muted-nc mb-0">${addr.street}<br>${addr.city}, ${addr.state} ${addr.zip}</p>
          </div>
        </div>
      `)
      .join("");
  }

  renderCheckoutAddresses();

});