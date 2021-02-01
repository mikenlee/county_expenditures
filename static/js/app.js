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