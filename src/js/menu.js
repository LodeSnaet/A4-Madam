const menuCanvas = document.querySelector(".js-menu");
const openButton = document.querySelector(".js-open-menu");
const closeButton = document.querySelector(".js-close-menu");
const backdrop = document.querySelector(".js-backdrop-menu");
const breakpoint = 768; // Define your medium breakpoint here

// Function to close the menu
const closeMenu = () => {
  menuCanvas.classList.remove("c-navbar__offcanvas--open");
  backdrop.classList.remove("c-navbar__backdrop--visible");
};

// Event listeners for opening and closing the menu
openButton.addEventListener("click", () => {
  menuCanvas.classList.add("c-navbar__offcanvas--open");
  backdrop.classList.add("c-navbar__backdrop--visible");
});

closeButton.addEventListener("click", closeMenu);

backdrop.addEventListener("click", closeMenu);

// Event listener for screen resizing
window.addEventListener("resize", () => {
  if (window.innerWidth > breakpoint) {
    closeMenu();
  }
});
