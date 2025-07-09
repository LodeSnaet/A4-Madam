"use strict";
import { capitalize } from "./test";
import "../scss/styles.scss";

const init = function () {
  const msg = capitalize("Hello World!");
  console.log(msg);
};

document.addEventListener("DOMContentLoaded", init);

// import * as bootstrap from 'bootstrap';

// Accept HMR as per: https://vitejs.dev/guide/api-hmr.html
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log("HMR active");
  });
}
