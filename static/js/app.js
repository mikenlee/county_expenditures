
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
      //use to go back to original text on mouse out
      var originalText = d3.select('#county-info').html()

      //look up table for geojson properties
      var propertyLabels = {
        founded: 'Founded: ',
        named_for: 'Named for: ',
        seat: 'Seat: ',
        largest_town: 'Largest Town: ', 
        population: 'Population: ',
        density: 'Density: ',
        total_area: 'Total Area: ',
        land_area: 'Land Area: ',
        water_area: 'Water Area: '
      };
      
      console.log(feature.properties);

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
            <em>Founded:  </em>${(feature.properties.founded !== null) ?  
              feature.properties.founded : '-'
            }
            <br>
            <em>Named for:  </em>${feature.properties.named_for}
            <br>
            <em>Seat:  </em>${feature.properties.seat}
            <br>
            <em>Largest Town:  </em>${feature.properties.largest_town}
            <br>
            <hr>
            <em>Population:  </em>${feature.properties.population}
            <br>
            <em>Density:  </em>${feature.properties.density}
            <br>
            <em>Total Area:  </em>${feature.properties.total_area}
            <br>
            <em>Land Area:  </em>${feature.properties.land_area}
            <br>
            <em>Water Area:  </em>${feature.properties.water_area}           
            `
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

