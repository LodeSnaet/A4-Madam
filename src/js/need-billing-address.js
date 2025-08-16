const checkbox = document.querySelector(".js-checkbox");
const billingFields = document.querySelectorAll(
  ".js-billing-fields input, .js-billing-fields select",
);
const mapBillingShipping = document.querySelector(".js-map-billing-shipping");

function toggleBilling() {
  const isReadonly = checkbox.checked;

  billingFields.forEach((field) => {
    field.readOnly = isReadonly;
  });

  if (mapBillingShipping) {
    mapBillingShipping.classList.toggle("hidden", isReadonly);
  }
}

if (checkbox) {
  toggleBilling(); // Set initial state on page load
  checkbox.addEventListener("change", toggleBilling);
}
