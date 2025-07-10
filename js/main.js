// Using Leaflet for creating the map and adding controls for interacting with the map

//
// --- Part 1: Initializing the map and base layers ---

// Creating the map; centered on Salzburg and setting zoom level
const map = L.map("map").setView([47.8011, 13.0439], 14);

// Defining base layers (CartoDB Positron and OpenStreetMap)
const baseLayers = {
  "CartoDB Positron": L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap & CartoDB",
    maxZoom: 19
  }),
  "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap",
    maxZoom: 19
  })
};

// Adding default base layer (CartoDB Positron) to the map
baseLayers["CartoDB Positron"].addTo(map);

// Adding a layer control to switch between base maps
L.control.layers(baseLayers).addTo(map);

//
// --- Part 2: Adding scale bar ---
//

// Adds a scale bar to the bottom-left of the map (metric only)
L.control.scale().addTo(map);

//
// --- Part 3: Locate user and show location on the map ---
//

// Handle location button click to trigger geolocation
const locateBtn = document.getElementById("locate-btn");
locateBtn.addEventListener("click", () => {
  map.locate({ setView: true, maxZoom: 16 });
});

// When location is found, place a custom marker and popup
map.on("locationfound", (e) => {
  const locationIcon = L.icon({
    iconUrl: "icons/location.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  L.marker(e.latlng, { icon: locationIcon })
    .addTo(map)
    .bindPopup("You are here")
    .openPopup();
});

//
// --- Part 4: Load GeoJSON data and initialize filters ---
//

// Variables to hold all features and state of current filters
let allFeatures = [];
let geojsonLayer = null;
let currentType = "all";
let currentCategory = "all";
let shopMarkers = []; 

let markers = [];


// Load GeoJSON data from external file
fetch("data/clothshops-data.geojson")
  .then(res => res.json())
  .then(data => {
    allFeatures = data.features;
    filterAndSearch(); // Initial display of all features
  })
  .catch(err => console.error("GeoJSON load error:", err));

//
// --- Part 5: Display filtered shops on the map ---
function displayShops(features) {
  // Fade out and remove previous markers
  shopMarkers.forEach(marker => {
    fadeOut(marker);
  });
  shopMarkers = [];

  // Create and fade in new markers
  features.forEach(feature => {
    let type = feature.properties.clothes.split(",")[0].trim().toLowerCase();
    const icon = L.icon({
      iconUrl: `icons/${type}.png`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });

    const marker = L.marker(
      [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
      { icon }
    );

    marker.feature = feature;

    marker.bindPopup(
      `<b>${feature.properties.name || "Unnamed Shop"}</b><br>` +
      `Type: ${feature.properties.clothes}<br>` +
      `Category: ${feature.properties.category}<br>` +
      `Opening hours: ${feature.properties.opening_ho}`
    );

    marker.on("click", () => {
      map.setView(marker.getLatLng(), 17);
    });

    fadeIn(marker);
    shopMarkers.push(marker);
  });
}



//
// --- Part 6: Filtering shops by type, category, and search ---
//
function filterAndSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allFeatures.filter(f => {
    const matchesType = currentType === "all" || f.properties.clothes.toLowerCase().includes(currentType);
    const matchesSearch = f.properties.name.toLowerCase().includes(query);
    const matchesCategory = currentCategory === "all" || f.properties.category.toLowerCase() === currentCategory;
    return matchesType && matchesSearch && matchesCategory;
  });

  displayShops(filtered);
}

//
// --- Part 7: UI event listeners for filters ---
//

// Filter by clothing type (clickable legend items)
document.querySelectorAll(".legend-item").forEach(item => {
  item.addEventListener("click", () => {
    currentType = item.dataset.type.toLowerCase();
    document.querySelectorAll(".legend-item").forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    filterAndSearch();
  });
});

// Filter by search input (button click or Enter key)
document.getElementById("searchButton").addEventListener("click", filterAndSearch);
document.getElementById("searchInput").addEventListener("keypress", e => {
  if (e.key === "Enter") filterAndSearch();
});

// Filter by clothing category (select dropdown)
document.getElementById("categorySelect").addEventListener("change", (e) => {
  currentCategory = e.target.value;
  filterAndSearch();
});

// Metadata show/hide logic
const metadataPanel = document.getElementById("metadataPanel");
const metadataCloseBtn = document.getElementById("metadataCloseBtn");
const metadataToggleBtn = document.getElementById("metadataToggleBtn");

// Show panel on load in center
metadataPanel.classList.remove("hidden");
metadataPanel.classList.add("center");
metadataToggleBtn.style.display = "none";

// When OK is clicked
metadataCloseBtn.addEventListener("click", () => {
  // Animate hiding
  metadataPanel.classList.add("hidden");

  // After animation, move to top-left
  setTimeout(() => {
    metadataPanel.classList.remove("center");
    metadataPanel.classList.add("left");
    metadataToggleBtn.style.display = "block";
  }, 500); // match CSS transition duration
});

// 📕 button shows panel again at top-left
metadataToggleBtn.addEventListener("click", () => {
  metadataPanel.classList.remove("hidden");
  metadataToggleBtn.style.display = "none";
});

function fadeOut(marker, callback) {
  const el = marker.getElement();
  if (!el) {
    map.removeLayer(marker);
    if (callback) callback();
    return;
  }

  el.style.opacity = 1;

  let opacity = 1;
  const interval = setInterval(() => {
    opacity -= 0.1;
    el.style.opacity = opacity;

    if (opacity <= 0) {
      clearInterval(interval);
      map.removeLayer(marker);
      if (callback) callback();
    }
  }, 20);
}

function fadeIn(marker) {
  marker.addTo(map);

  const el = marker.getElement();
  if (!el) return;

  el.style.opacity = 0;
  let opacity = 0;

  const interval = setInterval(() => {
    opacity += 0.1;
    el.style.opacity = opacity;

    if (opacity >= 1) clearInterval(interval);
  }, 20);
}
