document.addEventListener("DOMContentLoaded", () => {

  // ---------- Tabs ----------
  document.querySelectorAll('.nc-tabs a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.nc-tabs a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
    document.querySelectorAll('.pane').forEach(p => p.classList.add('d-none'));
    document.getElementById('pane-' + a.dataset.tab).classList.remove('d-none');
  }));

  // ---------- Card input formatting ----------
  const cardNumber = document.getElementById("cardNumber");
  const cardHolder = document.getElementById("cardHolder");
  const expiry = document.getElementById("expiry");
  const cvv = document.getElementById("cvv");
  const saveCardBtn = document.getElementById("saveCardBtn");
  const savedCardInfo = document.getElementById("savedCardInfo");

  cardNumber.addEventListener("input", e => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.match(/.{1,4}/g)?.join(" ") || "";
    e.target.value = value;
  });

  expiry.addEventListener("input", e => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 3) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    e.target.value = value;
  });

  cvv.addEventListener("input", e => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });

  // ---------- Validators ----------
  function isValidCardNumber(number) {
    number = number.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(number)) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i));
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  function isValidExpiry(value) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(value)) return false;

    const [month, year] = value.split("/");
    const expiryDate = new Date(2000 + Number(year), Number(month));

    return expiryDate > new Date();
  }

  function isValidName(name) {
    return /^[A-Za-z ]{3,50}$/.test(name.trim());
  }

  function isValidCVV(value) {
    return /^\d{3,4}$/.test(value);
  }

  function isValidUpi(value) {
    return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(value.trim());
  }

  function validateCard() {
    const number = cardNumber.value.trim();
    const holder = cardHolder.value.trim();
    const exp = expiry.value.trim();
    const cvvValue = cvv.value.trim();

    if (!isValidCardNumber(number)) {
      alert("Invalid card number.");
      return false;
    }
    if (!isValidName(holder)) {
      alert("Invalid cardholder name.");
      return false;
    }
    if (!isValidExpiry(exp)) {
      alert("Invalid or expired card date.");
      return false;
    }
    if (!isValidCVV(cvvValue)) {
      alert("Invalid CVV.");
      return false;
    }
    return true;
  }

  // ---------- Card storage — only ONE card allowed ----------
  // Security note: only last 4 digits, holder, and expiry are persisted.
  // Full card number and CVV are NEVER written to localStorage.
  const CARD_KEY = "novacart_card";

  function getSavedCard() {
    return JSON.parse(localStorage.getItem(CARD_KEY)) || null;
  }

  function renderSavedCard() {
    const card = getSavedCard();
    savedCardInfo.textContent = card
      ? `Saved: •••• ${card.last4} (${card.holder}, exp ${card.expiry})`
      : "";
  }

  saveCardBtn.addEventListener("click", () => {
    if (!validateCard()) return;

    const number = cardNumber.value.replace(/\s/g, "");

    const card = {
      last4: number.slice(-4),
      holder: cardHolder.value.trim(),
      expiry: expiry.value.trim()
    };

    localStorage.setItem(CARD_KEY, JSON.stringify(card)); // overwrites any existing card
    renderSavedCard();
    alert("Card saved.");
  });

  renderSavedCard();

  // ---------- UPI storage — up to 5 entries ----------
  const UPI_KEY = "novacart_upis";
  const SELECTED_UPI_KEY = "novacart_selected_upi";
  const MAX_UPIS = 5;

  const upiInput = document.getElementById("upiInput");
  const saveUpiBtn = document.getElementById("saveUpiBtn");
  const upiList = document.getElementById("upiList");

  let editingUpiId = null;

  function getUpis() {
    return JSON.parse(localStorage.getItem(UPI_KEY)) || [];
  }

  function saveUpis(upis) {
    localStorage.setItem(UPI_KEY, JSON.stringify(upis));
  }

  function getSelectedUpiId() {
    const upis = getUpis();
    const stored = localStorage.getItem(SELECTED_UPI_KEY);
    if (stored && upis.some(u => u.id === stored)) return stored;
    return upis[0]?.id ?? null;
  }

  window.selectUpi = function (id) {
    localStorage.setItem(SELECTED_UPI_KEY, id);
    renderUpiList();
  };

  window.editUpi = function (id) {
    const upi = getUpis().find(u => u.id === id);
    if (!upi) return;
    upiInput.value = upi.value;
    editingUpiId = id;
    saveUpiBtn.textContent = "Update UPI";
    upiInput.focus();
  };

  window.deleteUpi = function (id) {
    const wasSelected = getSelectedUpiId() === id;
    const upis = getUpis().filter(u => u.id !== id);
    saveUpis(upis);

    if (wasSelected) localStorage.removeItem(SELECTED_UPI_KEY);

    renderUpiList();
  };

  function renderUpiList() {
    const upis = getUpis();
    const selectedId = getSelectedUpiId();

    if (upis.length === 0) {
      upiList.innerHTML = `<p class="text-muted-nc mt-2" style="font-size:13px">No UPI IDs added yet.</p>`;
      return;
    }

    upiList.innerHTML = upis.map(u => `
      <div class="d-flex align-items-center gap-2 mt-2">
        <input type="radio" name="selectedUpi" ${u.id === selectedId ? "checked" : ""} onclick="selectUpi('${u.id}')">
        <span style="font-size:14px">${u.value}</span>
        <button type="button" class="btn-nc-ghost ms-auto" onclick="editUpi('${u.id}')">Edit</button>
        <button type="button" class="btn-nc-ghost" onclick="deleteUpi('${u.id}')">Delete</button>
      </div>
    `).join("");
  }

  saveUpiBtn.addEventListener("click", () => {
    const value = upiInput.value.trim();

    if (!isValidUpi(value)) {
      alert("Invalid UPI ID. Expected format: name@bank");
      return;
    }

    let upis = getUpis();

    if (editingUpiId) {
      upis = upis.map(u => (u.id === editingUpiId ? { ...u, value } : u));
      editingUpiId = null;
      saveUpiBtn.textContent = "Add UPI";
    } else {
      if (upis.length >= MAX_UPIS) {
        alert(`You can only save up to ${MAX_UPIS} UPI IDs. Delete one to add another.`);
        return;
      }
      upis.push({ id: crypto.randomUUID(), value });
    }

    saveUpis(upis);
    upiInput.value = "";
    renderUpiList();
  });

  renderUpiList();

  // ---------- Payment submission ----------
  const payBtn = document.getElementById("payBtn");

  const cart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
  const address =
    (JSON.parse(localStorage.getItem("novacart_addresses")) || [])
      .find(a => a.isDefault);

  const summary =
    JSON.parse(localStorage.getItem("novacart_price_summary")) || {};

  const products = window.NovaCart.products;

  // Build ordered products
  const orderedItems = cart.items.map(item => {

    const product = products.find(p => p.id === item.id);

    return {
      id: item.id,
      title: product?.title || "Unknown Product",
      img: product?.img || "",
      quantity: item.quantity,
      price: product?.price * 90 || 0
    };

  });

  payBtn.addEventListener("click", () => {

    const activeTab =
      document.querySelector(".nc-tabs a.active")?.dataset.tab;

    // validate payment first...

    if (activeTab === "card") {
      if (!validateCard()) return;
    }

    if (activeTab === "upi") {

      const selected =
        getUpis().find(u => u.id === getSelectedUpiId());

      if (!selected) {
        alert("Please add and select a UPI ID first.");
        return;
      }

      if (!isValidUpi(selected.value)) {
        alert("Selected UPI ID is invalid.");
        return;
      }
    }

    // NOW create order

    let paymentDetail = "";

    if (activeTab === "card") {
      paymentDetail = `Visa •••• ${getSavedCard()?.last4 || "----"}`;
    } else if (activeTab === "upi") {
      paymentDetail = getUpis().find(
        u => u.id === getSelectedUpiId()
      )?.value || "UPI";
    } else if (activeTab === "wallet") {
      paymentDetail = "Wallet";
    } else if (activeTab === "net") {
      paymentDetail = "Net Banking";
    } else {
      paymentDetail = "Cash on Delivery";
    }

    const order = {
      id: crypto.randomUUID(),
      placedAt: new Date().toISOString(),
      status: "Placed",
      items: orderedItems,
      address,
      priceSummary: summary,
      payment: {
        method: activeTab,
        detail: paymentDetail,
        holder: activeTab === "card" ? cardHolder.value.trim() : "-"
      }
    };

    const orders =
      JSON.parse(localStorage.getItem("novacart_orders")) || [];

    orders.unshift(order);

    localStorage.setItem(
      "novacart_orders",
      JSON.stringify(orders)
    );

    window.location.href =
      `payment-success.html?method=${activeTab}&id=${order.id}`;

  });

});