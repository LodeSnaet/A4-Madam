"use strict";
import "bootstrap";

import "../scss/styles.scss";
import "./cart";
import "./menu";
import "./row-reverse";
import "./email";
import "./dropdown";
import "./sortby";
import "./popover-anchor-pollyfill";
import "./hero-filter";

import "./need-billing-address";

if (window.location.pathname === "/shipping") {
  import("./mapbox");
}

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
