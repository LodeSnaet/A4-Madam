export default function initMollie() {
  if (typeof Mollie === "undefined") {
    setTimeout(initMollie, 200);
    return;
  }

  const form = document.getElementById("paymentForm");
  if (!form) return;

  const submitButton = document.getElementById("paymentForm-submit");
  const formError = document.getElementById("paymentForm-form-error");

  const mollie = Mollie(import.meta.env.VITE_MOLLIE_PROFILE_ID, {
    locale: "en_US",
    testmode: true,
  });

  const options = { styles: { base: { color: "rgba(0,0,0,0.8)" } } };

  const componentIds = {
    cardHolder: "card-holder",
    cardNumber: "card-number",
    expiryDate: "expiry-date",
    verificationCode: "verification-code",
  };

  Object.entries(componentIds).forEach(([name, id]) => {
    const el = document.getElementById(id);
    if (!el) return;

    const comp = mollie.createComponent(name, options);
    comp.mount(`#${id}`);

    const errorEl = document.getElementById(`${id}-error`);
    comp.addEventListener("change", (event) => {
      if (errorEl) {
        errorEl.textContent = event.error && event.touched ? event.error : "";
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    formError.textContent = "";

    const { token, error } = await mollie.createToken();

    if (error) {
      submitButton.disabled = false;
      formError.textContent = error.message;
      return;
    }

    const tokenInput = document.createElement("input");
    tokenInput.type = "hidden";
    tokenInput.name = "paymentForm[token]";
    tokenInput.value = token;
    form.appendChild(tokenInput);

    form.submit();
  });
}
