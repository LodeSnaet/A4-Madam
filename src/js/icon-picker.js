document.addEventListener("DOMContentLoaded", function () {
  // Select all necessary elements using their data attributes
  const iconPickerButton = document.querySelector("[data-icon-picker-btn]");
  const modalElement = document.querySelector("[data-icon-picker-modal]");
  const iconList = modalElement.querySelector("[data-icon-list]");
  const kitUrl = iconPickerButton.dataset.kitUrl;

  // Create the modal instance once and store it
  const modal = new Garnish.Modal(modalElement);

  // Function to fetch the Font Awesome kit icons
  async function fetchIcons() {
    const response = await fetch(kitUrl);
    const data = await response.json();
    return data.icons;
  }

  // Function to render the icons in the modal
  function renderIcons(icons) {
    iconList.innerHTML = ""; // Clear previous icons
    icons.forEach((icon) => {
      const iconElement = document.createElement("i");
      iconElement.className = `${icon.style} fa-${icon.id}`;
      iconElement.addEventListener("click", () => {
        // Logic to handle icon selection
        console.log("Selected icon:", iconElement.className);
        modal.hide(); // Hide the modal after selection
      });
      iconList.appendChild(iconElement);
    });
  }

  // Event listener to show the modal and load icons when the button is clicked
  iconPickerButton.addEventListener("click", async function () {
    // Fetch icons and render them before showing the modal
    const icons = await fetchIcons();
    renderIcons(icons);
    modal.show();
  });
});
