const cartButton = document.querySelector(".js-open");
const cartCanvas = document.querySelector(".js-canvas");
const closeCart = document.querySelector(".js-close");
const overlay = document.querySelector(".js-overlay");

cartButton.addEventListener("click", () => {
  cartCanvas.classList.add("c-cart--open");
  overlay.classList.remove("u-hidden");
});

closeCart.addEventListener("click", () => {
  cartCanvas.classList.remove("c-cart--open");
  overlay.classList.add("u-hidden");
});

overlay.addEventListener("click", () => {
  cartCanvas.classList.remove("c-cart--open");
  overlay.classList.add("u-hidden");
});
