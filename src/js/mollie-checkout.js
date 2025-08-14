const mollie = Mollie(import.meta.env.VITE_MOLLIE_PROFILE_ID, {
  locale: "en_US",
  testmode: true,
});

const options = { styles: { base: { color: "rgba(0,0,0,0.8)" } } };

const form = document.getElementById("mcForm");
const submitButton = document.getElementById("submit-button");
const formError = document.getElementById("form-error");

// Mount components
const cardHolder = mollie.createComponent("cardHolder", options);
cardHolder.mount("#card-holder");

const cardNumber = mollie.createComponent("cardNumber", options);
cardNumber.mount("#card-number");

const expiryDate = mollie.createComponent("expiryDate", options);
expiryDate.mount("#expiry-date");

const verificationCode = mollie.createComponent("verificationCode", options);
verificationCode.mount("#verification-code");

// Submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitButton.disabled = true;
  formError.textContent = "";

  const { token, error } = await mollie.createToken();

  if (error) {
    formError.textContent = error.message;
    submitButton.disabled = false;
    return;
  }

  // Add token to form (Craft gateway will use it)
  const tokenInput = document.createElement("input");
  tokenInput.name = "token";
  tokenInput.type = "hidden";
  tokenInput.value = token;
  form.appendChild(tokenInput);

  form.submit();
});
