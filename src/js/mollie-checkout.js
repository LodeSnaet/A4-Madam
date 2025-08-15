/**
 * Initializes the Mollie payment form, handling dynamic field display
 * and secure credit card tokenization via Mollie Components.
 */
const form = document.querySelector("#paymentForm");
const wrapper = document.querySelector(".mollie-plus-form");

function initMollie() {
  if (!form || !wrapper) {
    console.error("Form or wrapper not found!");
    return;
  }

  // Check for Mollie.js; retry after a delay if not found
  if (typeof Mollie === "undefined") {
    setTimeout(initMollie, 200);
    return;
  }

  const submitButton = document.getElementById("paymentForm-submit");
  const formError = document.getElementById("paymentForm-form-error");
  const paymentFormNamespace = wrapper.dataset.paymentFormNamespace;

  const profileId = wrapper.dataset.profileId;
  const locale = wrapper.dataset.locale;
  const testMode = wrapper.dataset.testMode;

  const mollie = Mollie(profileId, { locale: locale, testmode: testMode });

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

  let mollieComponents = {};

  function mountMollieComponents() {
    if (Object.keys(mollieComponents).length > 0) {
      return;
    }

    const componentConfigs = [
      {
        name: "cardHolder",
        id: `#${paymentFormNamespace}-card-holder`,
        errorId: `#${paymentFormNamespace}-card-holder-error`,
      },
      {
        name: "cardNumber",
        id: `#${paymentFormNamespace}-card-number`,
        errorId: `#${paymentFormNamespace}-card-number-error`,
      },
      {
        name: "expiryDate",
        id: `#${paymentFormNamespace}-expiry-date`,
        errorId: `#${paymentFormNamespace}-expiry-date-error`,
      },
      {
        name: "verificationCode",
        id: `#${paymentFormNamespace}-verification-code`,
        errorId: `#${paymentFormNamespace}-verification-code-error`,
      },
    ];

    componentConfigs.forEach((config) => {
      const component = mollie.createComponent(config.name, options);
      component.mount(config.id);
      mollieComponents[config.name] = component;

      const errorElement = document.querySelector(config.errorId);
      component.addEventListener("change", (event) => {
        if (errorElement) {
          errorElement.textContent =
            event.error && event.touched ? event.error : "";
        }
      });
    });
  }

  function unmountMollieComponents() {
    if (Object.keys(mollieComponents).length > 0) {
      Object.values(mollieComponents).forEach((comp) => comp.unmount());
      mollieComponents = {};
    }
  }

  const paymentMethodRadios = form.querySelectorAll(
    'input[name="' + paymentFormNamespace + '[paymentMethod]"]',
  );

  const dynamicFields = form.querySelectorAll(".c-checkout__fields");
  const creditCardFieldsContainer =
    document.getElementById("creditcard-fields");

  function updateFormState() {
    dynamicFields.forEach((field) => (field.style.display = "none"));
    unmountMollieComponents();

    const selectedRadio = form.querySelector(
      'input[name="' + paymentFormNamespace + '[paymentMethod]"]:checked',
    );
    if (selectedRadio) {
      const selectedMethod = selectedRadio.value.toLowerCase();

      // Corrected logic to match your new HTML structure
      if (selectedMethod === "creditcard") {
        creditCardFieldsContainer.style.display = "grid";
        mountMollieComponents();
      }
    }
  }

  paymentMethodRadios.forEach((radio) => {
    radio.addEventListener("change", updateFormState);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitButton.disabled = true;

    // Correctly define selectedMethod at the top of the function
    const selectedRadio = form.querySelector(
      'input[name="' + paymentFormNamespace + '[paymentMethod]"]:checked',
    );
    const selectedMethod = selectedRadio
      ? selectedRadio.value.toLowerCase()
      : null;

    if (!selectedMethod) {
      submitButton.disabled = false;
      formError.textContent = "Please select a payment method.";
      return;
    }

    formError.textContent = "";

    try {
      let token = null;
      let error = null;

      if (selectedMethod === "creditcard") {
        if (Object.keys(mollieComponents).length === 0) {
          submitButton.disabled = false;
          formError.textContent = "Please wait for the payment fields to load.";
          return;
        }

        const result = await mollie.createToken();
        token = result.token;
        error = result.error;
      }

      if (error) {
        submitButton.disabled = false;
        formError.textContent = error.message;
        return;
      }

      if (token) {
        const tokenInput = document.createElement("input");
        tokenInput.setAttribute("type", "hidden");
        tokenInput.setAttribute("name", paymentFormNamespace + "[cardToken]");
        tokenInput.setAttribute("value", token);
        form.appendChild(tokenInput);
      }
      form.submit();
    } catch (error) {
      submitButton.disabled = false;
      formError.textContent = "An error occurred during payment processing.";
    }
  });

  updateFormState();
}

window.addEventListener("DOMContentLoaded", function () {
  if (wrapper) {
    initMollie();
  }
});
