const svg = d3.select("#chart");
const width = +svg.attr("width");
const height = +svg.attr("height");

d3.csv("data/2018_Traffic_Volume.csv").then(data => {
  console.log("DATA LOADED:", data);

  // convert numbers
  data.forEach(d => {
    d.ROUTEID = +d.ROUTEID;
    d.AADT = +d.AADT;
  });

  // filter your routes
  const routeIDs = [11094052, 11090702, 11059602];

  const filtered = data.filter(d =>
    routeIDs.includes(d.ROUTEID) && d.AADT > 0
  );

  console.log("FILTERED:", filtered);

  // simple visualization (just circles)
  svg.selectAll("circle")
    .data(filtered)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => 50 + i * 30)
    .attr("cy", d => height - d.AADT / 100)
    .attr("r", 5)
    .attr("fill", "steelblue");

}).catch(error => {
  console.error("Error loading CSV:", error);
});