export default function initMollie() {
  if (typeof Mollie === "undefined") {
    // Retry initialization if the Mollie script isn't loaded yet.
    setTimeout(initMollie, 200);
    return;
  }

  const form = document.querySelector("#paymentForm");
  const wrapper = document.querySelector(".mollie-plus-form");
  if (!form || !wrapper) return;

  // These IDs have the 'paymentForm-' prefix, so we keep using the namespace
  const paymentFormNamespace = "paymentForm";
  const submitButton = document.getElementById(
    paymentFormNamespace + "-submit",
  );
  const formError = document.getElementById(
    paymentFormNamespace + "-form-error",
  );

  // These IDs are static in the HTML, so we don't need the namespace prefix
  const profileId = wrapper.dataset.profileId;
  const locale = wrapper.dataset.locale;
  const testMode =
    wrapper.dataset.testMode === "1" || wrapper.dataset.testMode === "true";

  const mollie = Mollie(profileId, {
    locale: locale,
    testmode: testMode,
  });

  const options = {
    styles: {
      base: {
        backgroundColor: "#fff",
      },
      invalid: {
        color: "rgb(220, 38, 38)",
      },
    },
  };

  // Store Mollie components to be able to destroy them
  let mollieComponents = {};

  function mountMollieComponents() {
    // Check if components are already mounted
    if (Object.keys(mollieComponents).length > 0) {
      return;
    }

    mollieComponents.cardHolder = mollie.createComponent("cardHolder", options);
    mollieComponents.cardHolder.mount("#card-holder");
    const cardHolderError = document.getElementById("card-holder-error");
    mollieComponents.cardHolder.addEventListener("change", (event) => {
      cardHolderError.textContent =
        event.error && event.touched ? event.error : "";
    });

    mollieComponents.cardNumber = mollie.createComponent("cardNumber", options);
    mollieComponents.cardNumber.mount("#card-number");
    const cardNumberError = document.getElementById("card-number-error");
    mollieComponents.cardNumber.addEventListener("change", (event) => {
      cardNumberError.textContent =
        event.error && event.touched ? event.error : "";
    });

    mollieComponents.expiryDate = mollie.createComponent("expiryDate", options);
    mollieComponents.expiryDate.mount("#expiry-date");
    const expiryDateError = document.getElementById("expiry-date-error");
    mollieComponents.expiryDate.addEventListener("change", (event) => {
      expiryDateError.textContent =
        event.error && event.touched ? event.error : "";
    });

    mollieComponents.verificationCode = mollie.createComponent(
      "verificationCode",
      options,
    );
    mollieComponents.verificationCode.mount("#verification-code");
    const verificationCodeError = document.getElementById(
      "verification-code-error",
    );
    mollieComponents.verificationCode.addEventListener("change", (event) => {
      verificationCodeError.textContent =
        event.error && event.touched ? event.error : "";
    });
  }

  function unmountMollieComponents() {
    if (Object.keys(mollieComponents).length > 0) {
      Object.values(mollieComponents).forEach((comp) => comp.unmount());
      mollieComponents = {};
    }
  }

  const creditCardFields = document.getElementById("creditcard-fields");
  const paymentMethodRadios = form.querySelectorAll(
    'input[name="paymentMethod"]',
  );

  // Function to handle the form's state based on the selected payment method
  function updateFormState() {
    let selectedMethod = null;
    paymentMethodRadios.forEach((radio) => {
      if (radio.checked) {
        selectedMethod = radio.value;
      }
    });

    // Check if the selected method is a credit card (mollie's id is 'creditcard')
    if (selectedMethod === "creditcard") {
      creditCardFields.style.display = "block";
      mountMollieComponents();
    } else {
      creditCardFields.style.display = "none";
      unmountMollieComponents();
    }
  }

  // Add event listener to all payment method radio buttons
  paymentMethodRadios.forEach((radio) => {
    radio.addEventListener("change", updateFormState);
  });

  // Call the function once on page load to set the initial state
  updateFormState();

  // Submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    formError.textContent = "";

    const selectedMethod = form.querySelector(
      'input[name="paymentMethod"]:checked',
    ).value;

    // Only create a token if the selected payment method is a credit card
    if (selectedMethod === "creditcard") {
      const { token, error } = await mollie.createToken();
      if (error) {
        submitButton.disabled = false;
        formError.textContent = error.message;
        return;
      }

      const tokenInput = document.createElement("input");
      tokenInput.setAttribute("type", "hidden");
      tokenInput.setAttribute("name", paymentFormNamespace + "[cardToken]");
      tokenInput.setAttribute("value", token);
      form.appendChild(tokenInput);
    }

    // Submit the form
    form.submit();
  });
}
