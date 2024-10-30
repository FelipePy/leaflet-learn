
var map = L.map('map', {
    zoom: 4,
    center: [-19.2350, -59.9253],
    // Configurações adicionais para suavizar animações
    zoomAnimation: true,
    fadeAnimation: true,
    markerZoomAnimation: true,
    easeLinearity: 0.25 
});

// function adicionarBanda(bandaNome) {
//     const imageUrl = `imagens/${bandaNome}`; // Caminho da imagem
//     const imageBounds = [[-60.0, -100.0], [30.0, -10.0]]; // Ajuste conforme necessário
    
//     // Adiciona a imagem overlay
//     const overlay = L.imageOverlay(imageUrl, imageBounds).addTo(map);
    
//     // Ajusta o mapa para os limites da imagem
//     map.fitBounds(imageBounds);
// }


// adicionarBanda('banda1_amazonia.png')

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 5,
    minZoom: 4,
    initZoom: 5,
    attribution: '&copy; OpenStreetMap contributors',
    noWrap: true // Impede que os tiles desapareçam
}).addTo(map);

const tiles1 = L.tileLayer('./tiles/{z}/{x}/{y}.png', {
    tms: true, // Defina para true se o seu tile estiver no formato TMS
    opacity: 1,
    attribution: 'Tiles &copy; OpenStreetMap contributors',
    maxZoom: 5,
    minZoom: 4,
    noWrap: true // Impede que os tiles desapareçam
}).addTo(map);

const tiles2 = L.tileLayer('./tiles/{z}/{x}/{y}.png', {
    tms: true, // Defina para true se o seu tile estiver no formato TMS
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 5,
    minZoom: 4,
    opacity: 1,
    noWrap: true // Impede que os tiles desapareçam
});

const baseMaps = {
    "Custom Tiles": tiles1,
    "OpenStreetMap": tiles2,
};

// L.control.layers(baseMaps).addTo(map);


var southWest = L.latLng(-60.0, -100.0); // Coordenadas do canto sudoeste
var northEast = L.latLng(30.0, -15.9253); // Coordenadas do canto nordeste
var bounds = L.latLngBounds(southWest, northEast);

map.setMaxBounds(bounds); // Aplica os limites máximos


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
    }, 
    position: 'topright',
});

map.addControl(drawControl);

// Adicionar o grupo ao mapa

map.addLayer(drawnItems);

function showPolygons() {
    drawnItems.eachLayer(function(layer) {
      if (layer instanceof L.Polygon) {
        var coordinates = layer.getLatLngs(); // Obter as coordenadas do polígono
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
    showPolygons();

});

