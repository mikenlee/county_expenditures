/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *              Initialize the visualization               *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

d3.json("/api/ncr_counties_expenditures").then(response => {
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
  d3.json("/api/ncr_counties_expenditures").then(response => {
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
      title: `<b>${fy} FairFax County Expenditures</b>`,
      font: {
        family: 'arial',
        size: 20,
        color: '#ffffff'
      },
      paper_bgcolor: 'rgba(255,0,0,0.0)',
      plot_bgcolor: 'rgba(255,0,0,0.0)'}

    Plotly.newPlot('fairfaxPlot', data, layout, {displayModeBar: false});
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
  center: [38.91999, -77.26581],
  zoom: 8,
  zoomControl: false,
  scrollWheelZoom: false,
  attributionControl: false
});

myMap.dragging.disable();

// Use this link to get the geojson data.
var link = "static/data/scoped_counties.geojson";

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

      // set popup css and content
      var popupOptions = 
      {
        'className': 'custom-popup',
        'autoPan': 'false'
      };

      var popupContent = 
        `<strong>${feature.properties.county}</strong>
        <hr/>
        <strong>Population:</strong>
        ${feature.properties.population}`

      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup(popupContent, {className: 'custom-popup', autoPan:false});

      // Set mouse events to change map styling
      layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
          this.openPopup();
          layer = event.target;
          layer.setStyle({
            fillOpacity: 1            
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
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup(`<h4>${feature.properties.county}</h4><hr/><h5 style='text-align: center;'>${feature.properties.population}</h5>`);

    }
  }).addTo(myMap);

});

