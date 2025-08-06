const dropdowns = document.querySelectorAll(".js-dropdown");

// Function to close all dropdowns
const closeAllDropdowns = () => {
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove("c-dropdown--active");
  });
};

const setupDropdown = (dropdown) => {
  const dropdownBtn = dropdown.querySelector(".js-dropdown-btn");

  if (dropdownBtn) {
    dropdownBtn.addEventListener("click", (e) => {
      e.preventDefault();

      const isAlreadyOpen = dropdown.classList.contains("c-dropdown--active");

      // Close all dropdowns
      closeAllDropdowns();

      // If the clicked dropdown was not already open, open it
      if (!isAlreadyOpen) {
        dropdown.classList.add("c-dropdown--active");
      }
    });
  }
};

// Listen for clicks on the entire document
document.addEventListener("click", (e) => {
  let isClickInsideDropdown = false;
  dropdowns.forEach((dropdown) => {
    if (dropdown.contains(e.target)) {
      isClickInsideDropdown = true;
    }
  });

  // If the click was outside of any dropdown, close all of them
  if (!isClickInsideDropdown) {
    closeAllDropdowns();
  }
});

if (dropdowns.length > 0) {
  dropdowns.forEach(setupDropdown);
}
