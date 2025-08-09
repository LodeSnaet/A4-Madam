const toggleButton = document.querySelector(".c-sortby__toggle");
const popoverMenu = document.querySelector(".c-sortby__menu");

function positionPopover() {
  const margin = 8;

  // Temporarily make it visible off-screen to measure
  popoverMenu.style.visibility = "hidden";
  popoverMenu.style.display = "block";
  popoverMenu.style.top = "0px";
  popoverMenu.style.left = "-9999px";

  const rect = toggleButton.getBoundingClientRect();
  const popoverRect = popoverMenu.getBoundingClientRect();

  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  let top = rect.bottom + window.scrollY + margin;

  if (spaceBelow < popoverRect.height && spaceAbove > popoverRect.height) {
    top = rect.top + window.scrollY - popoverRect.height - margin;
  }

  let left = rect.left + window.scrollX;
  const maxLeft = window.innerWidth - popoverRect.width - margin;
  if (left > maxLeft) left = maxLeft;
  left = Math.max(left, margin);

  popoverMenu.style.top = `${top}px`;
  popoverMenu.style.left = `${left}px`;

  // Restore visibility
  popoverMenu.style.visibility = "";
  popoverMenu.style.display = "";
}

if (toggleButton && popoverMenu) {
  toggleButton.addEventListener("click", () => {
    const isOpen = popoverMenu.classList.toggle("open");

    if (isOpen) {
      positionPopover();
    } else {
      popoverMenu.style.top = "";
      popoverMenu.style.left = "";
    }
  });

  window.addEventListener("resize", () => {
    if (popoverMenu.classList.contains("open")) {
      positionPopover();
    }
  });
}
