const updateEven = () => {
  const blogs = document.querySelectorAll("main > .c-blog");
  blogs.forEach((el, i) => {
    el.classList.toggle("is-even-blog", (i + 1) % 2 === 0);
  });
  // debugging: uncomment to verify
  // console.log("updated .c-blog parity", Array.from(blogs).map(b => b.className));
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
