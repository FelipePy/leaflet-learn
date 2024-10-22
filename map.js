var map = L.map('map', {
    zoom: 4,
    center: [-14.2350, -51.9253],
    // Configurações adicionais para suavizar animações
    zoomAnimation: true,
    fadeAnimation: true,
    markerZoomAnimation: true,
    easeLinearity: 0.25 
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 6,
    minZoom: 4,
    initZoom: 4,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var southWest = L.latLng(-60.0, -100.0); // Coordenadas do canto sudoeste
var northEast = L.latLng(30.0, -10.0); // Coordenadas do canto nordeste
var bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds); // Aplica os limites máximos
console.log('Limites definidos:', map);


// Desativa a movimentação do mapa além dos limites


var drawnItems = new L.FeatureGroup();

var drawControl = new L.Control.Draw({
    draw: {
        polygon: true, // Habilitar a ferramenta de polígono
        polyline: false,
        circle: false,
        rectangle: false,
        marker: false,
        circlemarker: false,
    },
    edit: {
        featureGroup: drawnItems // Grupo para armazenar as formas desenhadas
    }
});

map.addControl(drawControl);

// Adicionar o grupo ao mapa

map.addLayer(drawnItems);

function showPolygons() {
    drawnItems.eachLayer(function(layer) {
      if (layer instanceof L.Polygon) {
        var coordinates = layer.getLatLngs(); // Obter as coordenadas do polígono
        console.log("Coordenadas do polígono:", coordinates);
      }
    });
  }

map.on('dragend', function() {
    map.panInsideBounds(bounds, { animate: false });
});

// Capturar o evento de criação do polígono
map.on(L.Draw.Event.CREATED, function (event) {
    var layer = event.layer;
    drawnItems.addLayer(layer); // Adiciona o polígono ao grupo de itens desenhados
    console.log('Poligono criado')
    showPolygons();

});

