let trafficData = [];
let selectedRoute = routes[0];

d3.csv("data/2018_Traffic_Volume.csv").then(data => {
  data.forEach(d => {
  d.ROUTEID = +d.ROUTEID;
  d.AADT = +String(d.AADT).replace(/,/g, "");
  d.FROMMEASURE = +d.FROMMEASURE;
  d.TOMEASURE = +d.TOMEASURE;
});

  trafficData = data;

  drawButtons();
  drawMap();
  updateChart(selectedRoute);
}).catch(error => {
  console.error("Error loading CSV:", error);
});

function drawButtons() {
  d3.select("#route-buttons")
    .selectAll("button")
    .data(routes)
    .enter()
    .append("button")
    .attr("class", d => d.name === selectedRoute.name ? "route-button active" : "route-button")
    .text(d => d.name)
    .on("click", function(event, d) {
      selectedRoute = d;

      d3.selectAll(".route-button")
        .classed("active", false);

      d3.select(this)
        .classed("active", true);

      drawMap();
      updateChart(selectedRoute);
    });
}