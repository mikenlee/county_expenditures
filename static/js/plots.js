
d3.json("/api/fairfax").then(response => {
  var filteredFairfax = response.filter(d => d.fiscal_year == "2013");

  var labels = filteredFairfax.map(d => d.department)

  // Empty array for parents
  var parents = new Array(labels.length).fill("2013");

  var expenditure_values = filteredFairfax.map(data => data.expenditures_ytd)

  //convert currency strings to float
  expenditure_values = expenditure_values.map(x => Number(x.replace(/[^0-9.-]+/g,"")));

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
      text: "<b>FairFax County Expenditures</b>",
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
