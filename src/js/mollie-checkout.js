export default function initMollie() {
  if (typeof Mollie === "undefined") {
    setTimeout(initMollie, 200);
    return;
  }

  const form = document.querySelector("#paymentForm");
  const wrapper = document.querySelector(".mollie-plus-form");
  if (!form || !wrapper) return;

  const paymentFormNamespace = "paymentForm";
  const submitButton = document.getElementById(
    paymentFormNamespace + "-submit",
  );
  const formError = document.getElementById(
    paymentFormNamespace + "-form-error",
  );

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

  let mollieComponents = {};

  function mountMollieComponents() {
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

  const paymentMethodRadios = form.querySelectorAll(
    'input[name="paymentMethod"]',
  );
  const dynamicFieldsContainer = document.getElementById(
    "dynamic-payment-fields",
  );
  const fieldContainers = dynamicFieldsContainer
    ? dynamicFieldsContainer.querySelectorAll("div[id^='fields-']")
    : [];

  function resetFormState() {
    fieldContainers.forEach((container) => {
      container.style.display = "none";
    });
    unmountMollieComponents();
  }

  function updateFormState() {
    let selectedMethod = null;
    paymentMethodRadios.forEach((radio) => {
      if (radio.checked) {
        selectedMethod = radio.value;
      }
    });

    resetFormState();

    if (selectedMethod) {
      const selectedFields = document.getElementById(
        `fields-${selectedMethod}`,
      );
      if (selectedFields) {
        selectedFields.style.display = "block";
        if (selectedMethod === "creditcard") {
          mountMollieComponents();
        }
      }
    }
  }

  paymentMethodRadios.forEach((radio) => {
    radio.addEventListener("change", updateFormState);
  });

  updateFormState();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitButton.disabled = true;
    formError.textContent = "";

    const selectedMethod = form.querySelector(
      'input[name="paymentMethod"]:checked',
    ).value;

    if (selectedMethod === "creditcard") {
      const { token, error } = await mollie.createToken();
      if (error) {
        submitButton.disabled = false;
        formError.textContent = error.message;
        return;
      }

      const tokenInput = document.createElement("input");
      tokenInput.setAttribute("type", "hidden");
      tokenInput.setAttribute("name", "cardToken");
      tokenInput.setAttribute("value", token);
      form.appendChild(tokenInput);

      form.submit();
    } else {
      form.submit();
    }
  });
}
