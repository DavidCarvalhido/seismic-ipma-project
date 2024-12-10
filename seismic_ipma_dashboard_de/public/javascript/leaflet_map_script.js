var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

var openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: 'Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap (CC-BY-SA)'
});

var map = L.map('map', {
    center: [37.91, -11.35],
    zoom: 5.3,
    layers: osm,
});

var baseMaps = {
    "OpenStreetMap": osm,
};

var layerControl = L.control.layers(baseMaps).addTo(map);
layerControl.addBaseLayer(openTopoMap, "OpenTopoMap");

// Get the markers from the server
fetch('/earthquakes').then(response => response.json()).then(data => {
    if (Array.isArray(data.data)) {
        data.data.forEach(marker => {
            L.marker([marker.lat, marker.lon]).addTo(map).bindPopup(marker.obsregion);
        });
    } else {
        console.error('The property "data" does not contain a list:', data);
    }
}).catch(err => console.error('Error when loading bookmarks:', err));
