
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*              County Map                                  * 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Creating map object
var myMap = L.map("map", {
  center: [38.91999, -77.26581],
  zoomSnap: .1, //allow fractional zoom
  zoom: 8.6,
  zoomControl: false,
  scrollWheelZoom: false,
  attributionControl: false,
  maxBoundsViscosity: 1.0
});

myMap.dragging.disable();

// Use this link to get the geojson data.
// var link = "static/data/scoped_counties.geojson";

// Grabbing our GeoJSON data.
d3.json("/api/geojson/ncr").then(data => {
  console.log(data);
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
      var originalText = d3.select('#county-info').html()

      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature (county), the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: .8            
          });

          d3.select('#county-info').html(
            `<br>
            <h5><strong>${feature.properties.county}</strong></h5>
            <strong>Population: ${feature.properties.population}</strong>
            <strong></strong>`
            )
                
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.01
          });

          d3.select('#county-info').html(
            originalText
            )

        },
        // When a feature (county) is clicked, it displays information in html
        // click: function(event) {
        //   myMap.fitBounds(event.target.getBounds());
        // }
      });
      

    }
  }).addTo(myMap);
});

