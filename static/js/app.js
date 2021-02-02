/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              Initialize the visualization               *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

d3.json("/api/fairfax").then(response => {
  //select FY drop down element
  var fyElement = d3.select("#selFY");

  // get Fiscal Year values for dropdown options
  var fyOptions = [...new Set(response.map(obj => obj.fiscal_year))];
  //convert to integer and sort
  fyOptions = fyOptions.map(x => +x);
  fyOptions.sort((a,b) => (a-b));

  //loop through array of FYs and create new DOM node for each and append
  fyOptions.forEach(fy => {
    fyElement
      .append("option")
      .text(fy)
      .property('value', fy)
  });

  var firstFY = fyOptions[0];
  buildCharts(firstFY);
});
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*              buildCharts() function                     *
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  
function buildCharts(fy) {
  d3.json("/api/fairfax").then(response => {
    // filter data on fiscal year
    var filteredFairfax = response.filter(d => d.fiscal_year == fy);
    // department labels
    var labels = filteredFairfax.map(d => d.department)
    // Empty array for parents
    var parents = new Array(labels.length).fill("");
    // Expenditure values
    var expenditure_values = filteredFairfax.map(data => data.expenditures_ytd)

    //convert currency strings to float
    expenditure_values = expenditure_values.map(x => Number(x.replace(/[^0-9.-]+/g,"")));

    /****** TREE MAP *******/
    var data = [{
          type: "treemap",
          labels: labels,
          parents: parents,
          values:  expenditure_values,
          textinfo: "label+value+percent parent+percent entry",
          // domain: {"x": [0, 0.48]},
          outsidetextfont: {"size": 20, "color": "#377eb8"},
          marker: {"line": {"width": 2}},
          pathbar: {"visible": false}
        }];

    var layout = {
      // title: "<b>FairFax County Expenditures</b>",
      annotations: [{
        showarrow: false,
        text: `<b>${fy} FairFax County Expenditures</b>`,
        font: {
          family: 'arial',
          size: 28,
          color: '#000000'
        },
        x: 0.25,
        xanchor: "center",
        y: 1.1,
        yanchor: "bottom"
        }]}

    Plotly.newPlot('fairfaxPlot', data, layout)
});
}
  

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*              optionChanged() function                   * 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

function optionChanged(newFY) {
  //Fetch new data each time a new FY from dropdown is selected
  buildCharts(newFY);
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*              County Map                                  * 
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Creating map object
var myMap = L.map("map", {
  center: [38, -77],
  zoom: 11
});

/*
// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);
*/

// Use this link to get the geojson data.
var link = "static/data/scoped_counties.geojson";

// Grabbing our GeoJSON data..
d3.json(link).then(data => {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
      return {
        color: "red",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: 'blue',
        fillOpacity: 0.5,
        weight: 1.5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
        // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
        // click: function(event) {
        //   myMap.fitBounds(event.target.getBounds());
        // }
      });
      // Giving each feature a pop-up with information pertinent to it
      // layer.bindPopup(`<h1>${feature.properties.neighborhood}</h1><hr/><h2 style='text-align: center;'>${feature.properties.borough}</h2>`);

    }
  }).addTo(myMap);

});

