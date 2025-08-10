const styleOption = document.querySelector(".js-style-options");
const collectionOption = document.querySelector(".js-collection-options");
const priceOption = document.querySelector(".js-price-options");
const searchFilterBtn = document.querySelector(".js-search-filters");

let collectionUrl = "";
let styleUrl = "";
let priceUrl = "";

// A single function to log the complete URL
const logFullUrl = function () {
  const params = [];

  console.log("styleUrl:", styleUrl);
  console.log("collectionUrl:", collectionUrl);
  console.log("priceUrl:", priceUrl);

  if (styleUrl) {
    params.push(styleUrl);
  }
  if (collectionUrl) {
    params.push(collectionUrl);
  }
  if (priceUrl) {
    params.push(priceUrl);
  }

  const fullUrl = params.length ? `?${params.join("&")}` : "";

  console.log("fullUrl:", fullUrl);

  searchFilterBtn.href = `/shop${fullUrl}`;
};

const createCollectionUrl = function () {
  collectionOption.addEventListener("change", function (e) {
    collectionUrl = `collection=${e.currentTarget.value}`;
    logFullUrl();
  });
};

const createStyleUrl = function () {
  styleOption.addEventListener("change", function (e) {
    styleUrl = `style=${e.currentTarget.value}`;
    logFullUrl();
  });
};

const createPriceUrl = function () {
  priceOption.addEventListener("change", function (e) {
    priceUrl = `price=${e.currentTarget.value}`;
    logFullUrl();
  });
};

createCollectionUrl();
createStyleUrl();
createPriceUrl();
