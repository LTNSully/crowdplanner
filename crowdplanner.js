//Initialize the map
var map = L.map('map').setView([51.505, -0.09], 13);

//Add OpenstreetMap tiles 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

  // drawing layer
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

    // draw controls
  var drawControl = new L.Control.Draw({
    draw: {
      polyline: false,
      rectangle: false,
      circle: false,
      marker: false,
      circlemarker: false,
      polygon: {
        allowIntersection: false,
        showArea: true,
        drawError: {
          color: 'red',
          timeout: 1000
        },
        shapeOptions: {
          color: 'purple'
        }
      }
    },
    edit: {
      featureGroup: drawnItems
    }
  });
  map.addControl(drawControl);

  // Handle created shapes
map.on('draw:created', function (e) {
  var layer = e.layer;
  drawnItems.addLayer(layer);

  // Get the coordinates of the polygon
  var latlngs = layer.getLatLngs()[0]; // First ring of the polygon

  // Convert Leaflet latlngs to GeoJSON-like format
  var coords = latlngs.map(function (latlng) {
    return [latlng.lng, latlng.lat]; // GeoJSON uses [lng, lat]
  });

  // Close the polygon if not already
  if (coords[0][0] !== coords[coords.length - 1][0] ||
      coords[0][1] !== coords[coords.length - 1][1]) {
    coords.push(coords[0]);
  }

  // Create Turf polygon
  var turfPolygon = turf.polygon([coords]);
  // Calculate area in square meters
  var area = turf.area(turfPolygon);
  // Optional: format nicely
  var areaKm = (area / 1_000_000).toFixed(2);
  // Show area as a popup
  layer.bindPopup("Area: " + areaKm + " km²").openPopup();
  console.log("Area in m²:", area);
});

//show scale on the map
L.control.scale({
  position: 'bottomleft',  
  maxWidth: 200,          
  metric: true,            // Show metric units (meters/kilometers)
  imperial: false          // Disable imperial units if you want
}).addTo(map);