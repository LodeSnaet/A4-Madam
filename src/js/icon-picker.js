document.addEventListener("DOMContentLoaded", function () {
  const customFields = document.querySelectorAll("[data-field-id]");

  customFields.forEach((field) => {
    const nameInput = field.querySelector('input[type="text"]');
    const outputParagraph = field.querySelector(".js-output");

    if (nameInput && outputParagraph) {
      nameInput.addEventListener("input", (event) => {
        outputParagraph.textContent = event.target.value;
      });
    }
  });
});
