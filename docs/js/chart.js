const chartSvg = d3.select("#chart");
const chartWidth = +chartSvg.attr("width");
const chartHeight = +chartSvg.attr("height");

const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const innerWidth = chartWidth - margin.left - margin.right;
const innerHeight = chartHeight - margin.top - margin.bottom;

function updateChart(route) {
  chartSvg.selectAll("*").remove();

  d3.selectAll(".tooltip").remove();

  const g = chartSvg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const filtered = trafficData.filter(d =>
    route.routeIDs.includes(d.ROUTEID) &&
    d.AADT > 0
  );

  const totalAADT = d3.mean(filtered, d => d.AADT);

  const fromAvg = d3.mean(filtered, d => d.FROMMEASURE);
  const toAvg = d3.mean(filtered, d => d.TOMEASURE);

  const directionMeasure =
    route.measureField === "FROMMEASURE" ? fromAvg : toAvg;

  const measureDifference = directionMeasure - ((fromAvg + toAvg) / 2);

  const directionMultiplier = 1 + (measureDifference / 1000);

  const chartData = hourlyPattern.map(d => ({
    hour: d.hour,
    traffic: Math.round(totalAADT * d.factor * directionMultiplier)
  }));

  const x = d3.scaleBand()
    .domain(chartData.map(d => d.hour))
    .range([0, innerWidth])
    .padding(0.15);

  const y = d3.scaleLinear()
    .domain([0, d3.max(chartData, d => d.traffic)])
    .nice()
    .range([innerHeight, 0]);

  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  g.append("g")
    .call(d3.axisLeft(y));

  const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "white")
    .style("border", "1px solid #333")
    .style("padding", "6px 10px")
    .style("border-radius", "5px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  g.selectAll("rect")
    .data(chartData)
    .enter()
    .append("rect")
    .attr("x", d => x(d.hour))
    .attr("y", d => y(d.traffic))
    .attr("width", x.bandwidth())
    .attr("height", d => innerHeight - y(d.traffic))
    .attr("fill", "steelblue")
    .on("mouseover", function(event, d) {
      tooltip
        .style("opacity", 1)
        .html(d.hour + "<br>" + d.traffic + " vehicles/hour");

      d3.select(this).attr("fill", "orange");
    })
    .on("mousemove", function(event) {
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", function() {
      tooltip.style("opacity", 0);
      d3.select(this).attr("fill", "steelblue");
    });

  chartSvg.append("text")
    .attr("x", chartWidth / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .text("Estimated Traffic by Time of Day for " + route.name + " Route");

  chartSvg.append("text")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight - 8)
    .attr("text-anchor", "middle")
    .text("Time of Day");

  chartSvg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -chartHeight / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .text("Estimated Vehicles per Hour on Route");
}