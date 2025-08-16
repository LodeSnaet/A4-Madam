let shippingMarker = null;
let billingMarker = null;
let forwardGeocodeTimeout;
let billingGeocodeTimeout;

// --- Map setup ---
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [4.4699, 50.5039],
  zoom: 7,
});

// --- Inputs ---
const shippingStreet = document.getElementById("shipping-street-input");
const shippingCity = document.getElementById("city-input");
const shippingPostal = document.getElementById("postal-code-input");
const shippingFirstName = document.querySelector(
  'input[name="shippingAddress[firstName]"]',
);
const shippingLastName = document.querySelector(
  'input[name="shippingAddress[lastName]"]',
);

const billingStreet = document.getElementById("billing-street-input");
const billingCity = document.getElementById("billing-city-input");
const billingPostal = document.getElementById("billing-postal-code-input");
const billingFirstName = document.querySelector(
  'input[name="billingAddress[firstName]"]',
);
const billingLastName = document.querySelector(
  'input[name="billingAddress[lastName]"]',
);

const billingSameAsShippingCheckbox = document.getElementById(
  "billingAddressSameAsShipping",
);
const billingFields = document.querySelectorAll(
  ".js-billing-fields input, .js-billing-fields select",
);
const form = document.getElementById("checkout-form");

// --- Selected address ---
let selectedAddress = "shipping"; // default

// --- Sync helpers ---
const syncFirstAndLastNames = () => {
  if (billingSameAsShippingCheckbox.checked) {
    billingFirstName.value = shippingFirstName.value;
    billingLastName.value = shippingLastName.value;
  }
};

const syncAddressFields = () => {
  if (billingSameAsShippingCheckbox.checked) {
    billingStreet.value = shippingStreet.value;
    billingCity.value = shippingCity.value;
    billingPostal.value = shippingPostal.value;
  }
};

// --- Update UI based on checkbox ---
function updateBillingUI() {
  const isChecked = billingSameAsShippingCheckbox.checked;
  const mapBillingShipping = document.querySelector(".js-map-billing-shipping");

  // Hide/show billing marker
  if (billingMarker) {
    billingMarker.getElement().style.display = isChecked ? "none" : "block";
  }

  // Hide/show radio buttons
  if (mapBillingShipping) {
    mapBillingShipping.classList.toggle("hidden", isChecked);
  }

  // Disable/enable billing fields
  billingFields.forEach((field) => {
    field.disabled = isChecked;
  });

  // Force selectedAddress to "shipping" if checkbox is checked
  if (isChecked) {
    selectedAddress = "shipping";
    if (mapBillingShipping) {
      mapBillingShipping
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("selected"));
      mapBillingShipping
        .querySelector('[data-address="shipping"]')
        ?.classList.add("selected");
    }
    // Sync all fields immediately when the box is checked
    syncFirstAndLastNames();
    syncAddressFields();
  }
}

// --- Checkbox listener ---
if (billingSameAsShippingCheckbox) {
  billingSameAsShippingCheckbox.addEventListener("change", updateBillingUI);
  updateBillingUI(); // initial state
}

// --- Address selector buttons ---
function createMapButtons() {
  const container = document.createElement("div");
  container.className =
    "mapboxgl-ctrl address-selector js-map-billing-shipping hidden";

  const shippingBtn = document.createElement("button");
  shippingBtn.type = "button";
  shippingBtn.textContent = "Shipping";
  shippingBtn.dataset.address = "shipping";
  shippingBtn.classList.add("selected");

  const billingBtn = document.createElement("button");
  billingBtn.type = "button";
  billingBtn.textContent = "Billing";
  billingBtn.dataset.address = "billing";

  [shippingBtn, billingBtn].forEach((btn) => {
    btn.addEventListener("click", () => {
      container
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");
      selectedAddress = btn.dataset.address;
    });
    container.appendChild(btn);
  });
  return container;
}

map.addControl(
  {
    onAdd: function () {
      return createMapButtons();
    },
    onRemove: function () {},
  },
  "top-left",
);

// --- Helpers ---
const fitMapToMarkers = () => {
  const bounds = new mapboxgl.LngLatBounds();
  if (shippingMarker) bounds.extend(shippingMarker.getLngLat());
  if (billingMarker && billingMarker.getElement().style.display !== "none")
    bounds.extend(billingMarker.getLngLat());
  if (!bounds.isEmpty()) {
    map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 1000 });
  }
};

// --- Marker updates ---
function updateMarker(marker, lngLat, color) {
  if (!marker) {
    return new mapboxgl.Marker({ color }).setLngLat(lngLat).addTo(map);
  }
  marker.setLngLat(lngLat);
  return marker;
}

// --- Geocode helpers ---
const geocodeAndUpdateShipping = (street, city, postalCode) => {
  if (!street || !city || !postalCode) return;
  clearTimeout(forwardGeocodeTimeout);
  forwardGeocodeTimeout = setTimeout(() => {
    const query = `${street}, ${city}, ${postalCode}, Belgium`;
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=be&limit=1`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.features || !data.features.length) return;
        shippingMarker = updateMarker(
          shippingMarker,
          data.features[0].center,
          "#3b82f6",
        );
        fitMapToMarkers();
      });
  }, 500);
};

const geocodeAndUpdateBilling = (street, city, postalCode) => {
  if (!street || !city || !postalCode) return;
  clearTimeout(billingGeocodeTimeout);
  billingGeocodeTimeout = setTimeout(() => {
    const query = `${street}, ${city}, ${postalCode}, Belgium`;
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=be&limit=1`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.features || !data.features.length) return;
        billingMarker = updateMarker(
          billingMarker,
          data.features[0].center,
          "#ff0000",
        );
        if (billingSameAsShippingCheckbox.checked) {
          billingMarker.getElement().style.display = "none";
        }
        fitMapToMarkers();
      });
  }, 500);
};

// --- Input listeners ---
[
  shippingStreet,
  shippingCity,
  shippingPostal,
  shippingFirstName,
  shippingLastName,
].forEach((input) =>
  input?.addEventListener("input", () => {
    syncFirstAndLastNames();
    syncAddressFields();
    geocodeAndUpdateShipping(
      shippingStreet.value,
      shippingCity.value,
      shippingPostal.value,
    );
  }),
);

[billingStreet, billingCity, billingPostal].forEach((input) =>
  input?.addEventListener("input", () => {
    if (!billingSameAsShippingCheckbox.checked && !isMapSelectorHidden()) {
      geocodeAndUpdateBilling(
        billingStreet.value,
        billingCity.value,
        billingPostal.value,
      );
    }
  }),
);

// --- Map click ---
map.on("click", (e) => {
  const mapSelectorHidden = isMapSelectorHidden();
  if (
    selectedAddress === "billing" &&
    (billingSameAsShippingCheckbox.checked || mapSelectorHidden)
  )
    return;

  fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`,
  )
    .then((res) => res.json())
    .then((data) => {
      if (!data.features || !data.features.length) return;
      const feature = data.features[0];
      const context = feature.context || [];
      const postalCodeFeature = context.find((c) =>
        c.id.startsWith("postcode"),
      );
      const cityFeature = context.find((c) => c.id.startsWith("place"));
      let street = feature.address
        ? `${feature.address} ${feature.text}`
        : feature.text || "";
      if (!postalCodeFeature || !cityFeature) return;

      if (selectedAddress === "shipping") {
        shippingMarker = updateMarker(shippingMarker, e.lngLat, "#3b82f6");
        shippingCity.value = cityFeature.text;
        shippingPostal.value = postalCodeFeature.text;
        shippingStreet.value = street;
        syncFirstAndLastNames();
        syncAddressFields();
      } else {
        billingMarker = updateMarker(billingMarker, e.lngLat, "#ff0000");
        billingCity.value = cityFeature.text;
        billingPostal.value = postalCodeFeature.text;
        billingStreet.value = street;
        if (billingSameAsShippingCheckbox.checked) {
          billingMarker.getElement().style.display = "none";
        }
      }
      fitMapToMarkers();
    });
});

// --- Form submit ---
form.addEventListener("submit", () => {
  syncFirstAndLastNames();
  syncAddressFields();
});

// --- Helpers ---
function isMapSelectorHidden() {
  const el = document.querySelector(".js-map-billing-shipping");
  return el ? el.classList.contains("hidden") : false;
}
