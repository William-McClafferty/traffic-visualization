const svg = d3.select("#chart");
const width = +svg.attr("width");
const height = +svg.attr("height");

const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const g = svg
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("data/2018_Traffic_Volume.csv").then(data => {
  data.forEach(d => {
    d.ROUTEID = +d.ROUTEID;
    d.AADT = +d.AADT;
  });

  // Home to school route segments
  const routeIDs = [11094052, 11090702, 11059602];

  const filtered = data.filter(d =>
    routeIDs.includes(d.ROUTEID) &&
    d.AADT > 0
  );

  console.log("Loaded data:", data);
  console.log("Filtered route data:", filtered);

  // Average AADT for selected route
  const avgAADT = d3.mean(filtered, d => d.AADT);

  // Estimated hourly traffic multipliers
  // These simulate lower traffic late at night and higher traffic during commute times
  const hourlyPattern = [
    { hour: "12 AM", factor: 0.25 },
    { hour: "1 AM", factor: 0.20 },
    { hour: "2 AM", factor: 0.18 },
    { hour: "3 AM", factor: 0.18 },
    { hour: "4 AM", factor: 0.22 },
    { hour: "5 AM", factor: 0.35 },
    { hour: "6 AM", factor: 0.60 },
    { hour: "7 AM", factor: 0.90 },
    { hour: "8 AM", factor: 1.00 },
    { hour: "9 AM", factor: 0.85 },
    { hour: "10 AM", factor: 0.65 },
    { hour: "11 AM", factor: 0.60 },
    { hour: "12 PM", factor: 0.62 },
    { hour: "1 PM", factor: 0.64 },
    { hour: "2 PM", factor: 0.68 },
    { hour: "3 PM", factor: 0.75 },
    { hour: "4 PM", factor: 0.90 },
    { hour: "5 PM", factor: 1.00 },
    { hour: "6 PM", factor: 0.88 },
    { hour: "7 PM", factor: 0.70 },
    { hour: "8 PM", factor: 0.55 },
    { hour: "9 PM", factor: 0.45 },
    { hour: "10 PM", factor: 0.35 },
    { hour: "11 PM", factor: 0.28 }
  ];

  const chartData = hourlyPattern.map(d => ({
    hour: d.hour,
    traffic: Math.round(avgAADT * d.factor)
  }));

  console.log("Chart data:", chartData);

  const x = d3.scaleBand()
    .domain(chartData.map(d => d.hour))
    .range([0, innerWidth])
    .padding(0.15);

  const y = d3.scaleLinear()
    .domain([0, d3.max(chartData, d => d.traffic)])
    .nice()
    .range([innerHeight, 0]);

  // X axis
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  g.append("g")
    .call(d3.axisLeft(y));

  // Bars
  g.selectAll("rect")
    .data(chartData)
    .enter()
    .append("rect")
    .attr("x", d => x(d.hour))
    .attr("y", d => y(d.traffic))
    .attr("width", x.bandwidth())
    .attr("height", d => innerHeight - y(d.traffic))
    .attr("fill", "steelblue");

  // Chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .text("Estimated Traffic by Time of Day for Home to School Route");

  // X label
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 5)
    .attr("text-anchor", "middle")
    .text("Time of Day");

  // Y label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .text("Estimated Traffic Level");

}).catch(error => {
  console.error("Error loading CSV:", error);
});