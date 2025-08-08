const toggleDropdown = document.querySelector(".js-toggle");
const popover = document.getElementById("sort-popover");

function toggleSortByDropdown() {
  // Update class whenever the popover is opened or closed
  popover.addEventListener("toggle", () => {
    const isOpen = popover.matches(":popover-open");
    toggleDropdown.classList.toggle("c-sortby__toggle--open", isOpen);
  });
}

toggleSortByDropdown();

const arrSortbyDropdown = document.querySelectorAll(".js-sortby");

const sortProductsBy = function () {
  for (const item of arrSortbyDropdown) {
    item.addEventListener("click", function (e) {
      e.preventDefault();

      const value = e.currentTarget.dataset.value;

      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);

      params.set("order", value);

      window.location.search = params.toString();
    });
  }
};

sortProductsBy();
