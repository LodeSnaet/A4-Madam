const form = document.querySelector(".js-form");
const newsLetterEmail = document.querySelector(".js-email");

const emptyMessage = document.querySelector(".js-empty-message");
const invalidMessage = document.querySelector(".js-invalid-message");
const validMessage = document.querySelector(".js-valid-message");

const allMessages = [emptyMessage, invalidMessage, validMessage];

const logemail = function (event) {
  event.preventDefault();
  const emailValue = newsLetterEmail.value;

  allMessages.forEach((msg) => msg.classList.remove("c-email__text--visible"));

  if (emailValue === "") {
    console.warn("The email field cannot be empty.");
    emptyMessage.classList.add(
      "c-email__text--visible",
      "c-email__text--error",
    );
  } else if (newsLetterEmail.checkValidity()) {
    console.log("Submitted email is valid:", emailValue);
    validMessage.classList.add(
      "c-email__text--visible",
      "c-email__text--success",
    );
  } else {
    console.error("Submitted email is invalid:", emailValue);
    invalidMessage.classList.add(
      "c-email__text--visible",
      "c-email__text--error",
    );
  }
};

form.addEventListener("submit", logemail);
