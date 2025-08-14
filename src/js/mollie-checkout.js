const mollie = Mollie(import.meta.env.MOLLIE_API_KEY, {
  locale: "nl_NL",
  testmode: true,
});

// Define a style object to apply to all components
const componentStyles = {
  base: {
    color: "#333",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    "::placeholder": {
      color: "#999",
    },
    lineHeight: "20px",
  },
  valid: {
    color: "#4caf50",
  },
  invalid: {
    color: "#f44336",
  },
};

// Create and mount all the components
const card = mollie.createComponent("card", {
  styles: componentStyles,
  components: {
    cardHolder: { label: "Cardholder Name" },
    verificationCode: { label: "CVV" },
    expiryDate: { label: "MM/YY" },
  },
});
card.mount("#card");

// Get the form and hidden input elements
const form = document.getElementById("payment-form");
const cardTokenInput = document.getElementById("card-token");

// Add a submit event listener to the form
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Show a loading state on your button if desired
  // const payButton = document.querySelector('.c-btn');
  // payButton.disabled = true;
  // payButton.textContent = 'Processing...';

  const { token, error } = await mollie.createToken();

  if (error) {
    // Hide loading state
    // payButton.disabled = false;
    // payButton.textContent = 'Pay Now';

    // Display error messages for each component
    // Example: cardHolder.setErrorMessage(error.getFieldErrorMessage('cardHolder'));
    alert(error.message);
  } else {
    // Set the token value and submit the form
    cardTokenInput.value = token;
    form.submit();
  }
});
