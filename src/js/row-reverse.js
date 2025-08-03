const updateEven = () => {
  const blogs = document.querySelectorAll("main > .c-blog");
  blogs.forEach((el, i) => {
    el.classList.toggle("u-even", (i + 1) % 2 === 0);
  });
};

const init = () => {
  updateEven();

  const mainEl = document.querySelector("main");
  if (mainEl) {
    const observer = new MutationObserver((mutations) => {
      // only re-run if children changed
      if (mutations.some((m) => m.type === "childList")) {
        updateEven();
      }
    });
    observer.observe(mainEl, { childList: true });
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
