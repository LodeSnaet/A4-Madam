const menuCanvas = document.querySelector(".js-menu");
const openButton = document.querySelector(".js-open-menu");
const closeButton = document.querySelector(".js-close-menu");
const backdrop = document.querySelector(".js-backdrop-menu");

openButton.addEventListener("click", () => {
  menuCanvas.classList.add("c-navbar__offcanvas--open");
  backdrop.classList.add("c-navbar__backdrop--visible");
});

closeButton.addEventListener("click", () => {
  menuCanvas.classList.remove("c-navbar__offcanvas--open");
  backdrop.classList.remove("c-navbar__backdrop--visible");
});

backdrop.addEventListener("click", () => {
  menuCanvas.classList.remove("c-navbar__offcanvas--open");
  backdrop.classList.remove("c-navbar__backdrop--visible");
});
