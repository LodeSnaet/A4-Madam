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

  if (styleUrl) {
    params.push(`style[0]=${styleUrl}`);
  }

  if (collectionUrl) {
    params.push(`collection[0]=${collectionUrl}`);
  }

  if (priceUrl) {
    params.push(`price[0]=${priceUrl}`);
  }
  console.log(params);

  const fullUrl = params.length ? `?${params.join("&")}` : "";
  searchFilterBtn.href = `/shop${fullUrl}`;
};

const createCollectionUrl = function () {
  collectionOption.addEventListener("change", function (e) {
    collectionUrl = e.currentTarget.value;
    logFullUrl();
  });
};

const createStyleUrl = function () {
  styleOption.addEventListener("change", function (e) {
    styleUrl = e.currentTarget.value;
    logFullUrl();
  });
};

const createPriceUrl = function () {
  priceOption.addEventListener("change", function (e) {
    priceUrl = e.currentTarget.value;
    logFullUrl();
  });
};

createCollectionUrl();
createStyleUrl();
createPriceUrl();
