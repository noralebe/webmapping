// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
  });

  function createFeatures(earthquakeData) {
  
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature,layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      
         
    }
  
  
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, ltlg) {
        var color;
        var r = 255;
        var g = Math.floor(255-80*feature.properties.mag);
        var b = Math.floor(255-80*feature.properties.mag);
        color= "rgb("+r+" ,"+g+","+ b+")"
        
        var geojsonMarkerOptions = {
          radius: 4*feature.properties.mag,
          fillColor: color,
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        };
        return L.circleMarker(ltlg, geojsonMarkerOptions);
      }
    });
   
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
   }
  
  function createMap(earthquakes) {
  
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: "pk.eyJ1Ijoibm9yYWxlYmUiLCJhIjoiY2p4aGxvb2ZkMGd6ajN5cXRicDNibG82ciJ9.I70hnoEXQzfAaTYA22WJuw"
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: "pk.eyJ1Ijoibm9yYWxlYmUiLCJhIjoiY2p4aGxvb2ZkMGd6ajN5cXRicDNibG82ciJ9.I70hnoEXQzfAaTYA22WJuw"
    });
   
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
      // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });

    function getColor(scale) {
      return scale < 1 ? 'rgb(255,255,255)' :
            scale < 2  ? 'rgb(255,225,225)' :
            scale < 3  ? 'rgb(255,195,195)' :
            scale < 4  ? 'rgb(255,165,165)' :
            scale < 5  ? 'rgb(255,135,135)' :
            scale < 6  ? 'rgb(255,105,105)' :
            scale < 7  ? 'rgb(255,75,75)' :
            scale < 8  ? 'rgb(255,45,45)' :
            scale < 9  ? 'rgb(255,15,15)' :
                        'rgb(255,0,0)';
  }

  // Create a legend to display information about our map
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    

      div.innerHTML+='Magnitude<br><hr>'
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  
  return div;

  
  };
    legend.addTo(myMap);
      L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
  