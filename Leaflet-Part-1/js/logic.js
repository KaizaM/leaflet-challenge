// Storing the API endpoint as url.
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
// Performing a GET request to the query URL
d3.json(url).then(function (data) {
  bubbles(data.features);
});

// general map code
function map(earthquakes) {
      var base_map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
    
      var myMap = L.map("map", {
        center: [
          0.0, 0.0
        ],
        zoom: 3,
        layers: [base_map, earthquakes]
      });
    
        legend.addTo(myMap);
}

// functions for earthquake data
function bubbles(earthquakeData) {
    function popup(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

    function circle(feature, latlng){
        let options = {
        radius:5*feature.properties.mag,
        fillColor: color(feature.properties.mag),
        color: color(feature.properties.mag)
        } 
        
        return L.circleMarker(latlng,options);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: popup,
        pointToLayer: circle
    });

    map(earthquakes);
}

// color based off magnitude
function color(magnitude){
    switch(true){
      case(magnitude <= 2):
      return "#00FF00";
      case (magnitude <= 3):
          return "#99FF99";
      case (magnitude <= 4):
          return "#FFB266";
      case (magnitude <= 5):
          return "#FF6666";
      case (magnitude > 5):
          return "#660000";
    }
}

// Creating Legend
var legend = L.control({
  position: "bottomleft"
});

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
 
  var bins = [0,2,3,4,5];

  for (var i = 0; i < bins.length; i++) {
    div.innerHTML += 
    "<i style='background: " + color(bins[i]+ 1) + "'></i> " + bins[i] + (bins[i + 1] ? "&ndash;" + bins[i + 1] + "<br>" : "+");
  }
return div;
};

