/**
 * Initializes the Mollie payment form, handling dynamic field display
 * and secure credit card tokenization via Mollie Components.
 */
function initMollie() {
  const form = document.querySelector("#paymentForm");
  const wrapper = document.querySelector(".mollie-plus-form");

  if (!form || !wrapper) {
    console.error("Form or wrapper not found!");
    return;
  }

  if (typeof Mollie === "undefined") {
    setTimeout(initMollie, 200);
    return;
  }

  const submitButton = document.getElementById("paymentForm-submit");
  const formError = document.getElementById("paymentForm-form-error");

  const paymentFormNamespace = wrapper.dataset.paymentFormNamespace;
  const paymentNamespace = wrapper.dataset.paymentNamespace;
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
        id: `#${paymentNamespace}-card-holder`,
        errorId: `#${paymentNamespace}-card-holder-error`,
      },
      {
        name: "cardNumber",
        id: `#${paymentNamespace}-card-number`,
        errorId: `#${paymentNamespace}-card-number-error`,
      },
      {
        name: "expiryDate",
        id: `#${paymentNamespace}-expiry-date`,
        errorId: `#${paymentNamespace}-expiry-date-error`,
      },
      {
        name: "verificationCode",
        id: `#${paymentNamespace}-verification-code`,
        errorId: `#${paymentNamespace}-verification-code-error`,
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

  function resetFormState() {
    dynamicFields.forEach((field) => (field.style.display = "none"));
    unmountMollieComponents();
  }

  function updateFormState() {
    resetFormState();
    const selectedRadio = form.querySelector(
      'input[name="' + paymentFormNamespace + '[paymentMethod]"]:checked',
    );
    if (selectedRadio) {
      const selectedMethod = selectedRadio.value.toLowerCase();
      const selectedFieldsContainer = document.getElementById(
        `fields-${selectedMethod}`,
      );

      if (selectedFieldsContainer) {
        selectedFieldsContainer.style.display = "grid";
        if (selectedMethod === "creditcard") {
          mountMollieComponents();
        }
      }
    }
  }

  paymentMethodRadios.forEach((radio) => {
    radio.addEventListener("change", updateFormState);
  });

  form.addEventListener("submit", async (e) => {
    const selectedRadio = form.querySelector(
      'input[name="' + paymentFormNamespace + '[paymentMethod]"]:checked',
    );
    const selectedMethod = selectedRadio
      ? selectedRadio.value.toLowerCase()
      : null;

    if (!selectedMethod) {
      e.preventDefault();
      formError.textContent = "Please select a payment method.";
      return;
    }

    formError.textContent = "";

    if (selectedMethod === "creditcard") {
      e.preventDefault();
      submitButton.disabled = true;

      try {
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

        form.submit();
      } catch (error) {
        submitButton.disabled = false;
        formError.textContent = "An error occurred during payment processing.";
      }
    }
  });

  updateFormState();
}

window.addEventListener("DOMContentLoaded", initMollie);
