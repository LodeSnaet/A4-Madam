const checkbox = document.querySelector(".js-checkbox");
const billingFields = document.querySelectorAll(".js-billing-fields");
const mapBillingShipping = document.querySelector(".js-map-billing-shipping");

function toggleBilling() {
  const display = checkbox.checked ? "none" : "flex";

  billingFields.forEach((field) => {
    field.style.display = display;
  });

  if (mapBillingShipping) {
    mapBillingShipping.classList.toggle("hidden", checkbox.checked);
  }
}

if (checkbox) {
  toggleBilling(); // initial state
  checkbox.addEventListener("change", toggleBilling);
}
