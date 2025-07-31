"use strict";
import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
import "./cart";
import "./menu";
import "./row-reverse";

const init = function () {
  const msg = "Hello World!";
  console.log(msg);
};

document.addEventListener("DOMContentLoaded", init);

console.log(bootstrap);
// Accept HMR as per: https://vitejs.dev/guide/api-hmr.html
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log("HMR active");
  });
}
