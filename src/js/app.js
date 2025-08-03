"use strict";
import "bootstrap";

import "../scss/styles.scss";
import "./cart";
import "./menu";
import "./row-reverse";
import "./email";

const init = function () {
  console.log("Hello World!");
};

document.addEventListener("DOMContentLoaded", init);

// Accept HMR as per: https://vitejs.dev/guide/api-hmr.html
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log("HMR active");
  });
}
