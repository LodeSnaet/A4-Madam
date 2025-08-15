mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
let marker = null;

window.onload = function () {
  const mapContainer = document.getElementById("map");
  if (!mapContainer) return;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [4.4699, 50.5039],
    zoom: 7,
    maxBounds: [
      [2.5, 49.5],
      [6.5, 51.5],
    ],
  });

  marker = new mapboxgl.Marker().setLngLat(map.getCenter()).addTo(map);

  const streetInput = document.getElementById("shipping-street-input");
  const cityInput = document.getElementById("city-input");
  const postalInput = document.getElementById("postal-code-input");

  const billingStreet = document.getElementById("billing-street-input");
  const billingCity = document.getElementById("billing-city-input");
  const billingPostal = document.getElementById("billing-postal-code-input");

  const form = document.getElementById("checkout-form");

  // Sync billing automatically
  const syncBillingFields = () => {
    billingStreet.value = streetInput.value;
    billingCity.value = cityInput.value;
    billingPostal.value = postalInput.value;
  };

  // Forward geocode from city/postal
  const forwardGeocodeAndUpdate = (city, postalCode) => {
    if (!city || !postalCode) return;

    const query = `${city}, ${postalCode}, Belgium`;
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=be&limit=1`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const newLngLat = data.features[0].center;
          map.flyTo({ center: newLngLat, zoom: 12 });
          marker.setLngLat(newLngLat);
        }
      });
  };

  // Update on input
  [streetInput, cityInput, postalInput].forEach((input) =>
    input?.addEventListener("input", () => {
      syncBillingFields();
      if (cityInput.value.length > 2 && postalInput.value.length > 0) {
        forwardGeocodeAndUpdate(cityInput.value, postalInput.value);
      }
    }),
  );

  // Reverse geocode on map click
  map.on("click", (e) => {
    if (marker) marker.remove();
    marker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);

    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          const featuresContext = feature.context || [];

          const postalCodeFeature = featuresContext.find((c) =>
            c.id.startsWith("postcode"),
          );
          const cityFeature = featuresContext.find((c) =>
            c.id.startsWith("place"),
          );

          let street = "";
          if (feature.address) {
            street = `${feature.address} ${feature.text}`;
          } else if (feature.text) {
            street = feature.text;
          }

          if (postalCodeFeature && cityFeature) {
            cityInput.value = cityFeature.text;
            postalInput.value = postalCodeFeature.text;
            streetInput.value = street;
            syncBillingFields();
          }
        }
      });
  });

  // Ensure billing fields are synced just before submit
  form.addEventListener("submit", () => {
    syncBillingFields();
  });
};
