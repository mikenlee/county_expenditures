
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*              County Map                                  * 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Creating map object
var myMap = L.map("map", {
  center: [38.91999, -77.26581],
  zoom: 9,
  zoomControl: false,
  scrollWheelZoom: false,
  attributionControl: false
});

// Use this link to get the geojson data.
// var link = "static/data/scoped_counties.geojson";

// Grabbing our GeoJSON data..
d3.json("/api/geojson/ncr").then(data => {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a county)
    style: function(feature) {
      return {
        color: "#6E7889",
        fillColor: '#d3d3d3',
        fillOpacity: 0.01,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup(`<strong>${feature.properties.county}</strong><hr/><strong style='text-align: center;'>${feature.properties.population}</strong>`);

      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          this.openPopup();
          layer = event.target;
          layer.setStyle({
            fillOpacity: .8            
          });
                
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          this.closePopup();
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.01
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        // click: function(event) {
        //   myMap.fitBounds(event.target.getBounds());
        // }
      });
      

    }
  }).addTo(myMap);

});

