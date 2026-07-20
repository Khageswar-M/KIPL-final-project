// Address storage — shared across pages via localStorage
const ADDRESS_KEY = "novacart_addresses";

function getAddresses() {
  return JSON.parse(localStorage.getItem(ADDRESS_KEY)) || [];
}

function saveAddresses(addresses) {
  localStorage.setItem(ADDRESS_KEY, JSON.stringify(addresses));
}

function getIcon(label) {
  const l = label.trim().toLowerCase();
  if (l === "home") return "🏠";
  if (l === "office") return "🏢";
  return "📍";
}

function renderAddresses() {
  const container = document.getElementById("addressList");
  if (!container) return; // page might not have the list on it

  const addresses = getAddresses();

  if (addresses.length === 0) {
    container.innerHTML = `<p class="text-muted-nc">No saved addresses yet.</p>`;
    return;
  }

  container.innerHTML = addresses
    .map(addr => `
      <div class="col-md-6">
        <div class="nc-address ${addr.isDefault ? "default" : ""}">
          ${addr.isDefault ? `<span class="tag">Default</span>` : ""}
          <h6>${getIcon(addr.label)} ${addr.label}</h6>
          <p class="text-muted-nc mb-1">${addr.name} · ${addr.phone}</p>
          <p class="text-muted-nc mb-3">${addr.street}<br>${addr.city}, ${addr.state} ${addr.zip}</p>
          <div class="d-flex gap-2">
            <button class="btn-nc-ghost" onclick="editAddress('${addr.id}')">Edit</button>
            ${
              addr.isDefault
                ? ""
                : `<button class="btn-nc-ghost" onclick="setDefaultAddress('${addr.id}')">Set default</button>`
            }
            <button class="btn-nc-ghost" onclick="deleteAddress('${addr.id}')">Delete</button>
          </div>
        </div>
      </div>
    `)
    .join("");
}

// Populate the modal form for editing; leaves fields empty for "add new"
function editAddress(id) {
  const addresses = getAddresses();
  const addr = addresses.find(a => a.id === id);
  if (!addr) return;

  document.getElementById("addrId").value = addr.id;
  document.getElementById("addrLabel").value = addr.label;
  document.getElementById("addrName").value = addr.name;
  document.getElementById("addrPhone").value = addr.phone;
  document.getElementById("addrStreet").value = addr.street;
  document.getElementById("addrCity").value = addr.city;
  document.getElementById("addrState").value = addr.state;
  document.getElementById("addrZip").value = addr.zip;
  document.getElementById("addrDefault").checked = addr.isDefault;

  const modalEl = document.getElementById("addrM");
  bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

function deleteAddress(id) {
  let addresses = getAddresses();
  const wasDefault = addresses.find(a => a.id === id)?.isDefault;

  addresses = addresses.filter(a => a.id !== id);

  // If the deleted address was the default, promote the next one (if any)
  if (wasDefault && addresses.length > 0) {
    addresses[0].isDefault = true;
  }

  saveAddresses(addresses);
  renderAddresses();
  ncToast("Address removed");
}

function setDefaultAddress(id) {
  const addresses = getAddresses().map(a => ({
    ...a,
    isDefault: a.id === id
  }));

  saveAddresses(addresses);
  renderAddresses();
  ncToast("Default address updated");
}

function resetAddressForm() {
  document.getElementById("addrForm").reset();
  document.getElementById("addrId").value = "";
}

function handleAddressSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("addrId").value;
  const label = document.getElementById("addrLabel").value.trim();
  const name = document.getElementById("addrName").value.trim();
  const phone = document.getElementById("addrPhone").value.trim();
  const street = document.getElementById("addrStreet").value.trim();
  const city = document.getElementById("addrCity").value.trim();
  const state = document.getElementById("addrState").value.trim();
  const zip = document.getElementById("addrZip").value.trim();
  const isDefault = document.getElementById("addrDefault").checked;

  if (!label || !name || !phone || !street || !city || !state || !zip) {
    ncToast("Please fill in all fields");
    return;
  }

  let addresses = getAddresses();

  if (id) {
    // Editing an existing address
    addresses = addresses.map(a =>
      a.id === id ? { ...a, label, name, phone, street, city, state, zip } : a
    );
  } else {
    // Adding a new one
    addresses.push({
      id: crypto.randomUUID(),
      label,
      name,
      phone,
      street,
      city,
      state,
      zip,
      isDefault: false
    });
  }

  // If this address was marked default (or it's the very first address ever),
  // make sure it — and only it — is default.
  const targetId = id || addresses[addresses.length - 1].id;
  if (isDefault || addresses.length === 1) {
    addresses = addresses.map(a => ({ ...a, isDefault: a.id === targetId }));
  }

  saveAddresses(addresses);

  const modalEl = document.getElementById("addrM");
  bootstrap.Modal.getInstance(modalEl)?.hide();

  resetAddressForm();
  renderAddresses();
  ncToast("Address saved");
}

document.addEventListener("DOMContentLoaded", renderAddresses);