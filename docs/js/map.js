const mapSvg = d3.select("#map");
const mapWidth = +mapSvg.attr("width");
const mapHeight = +mapSvg.attr("height");

function drawMap() {
  mapSvg.selectAll("*").remove();

  const zoom = 14;
  const center = {
    lat: 38.9322,
    lon: -77.0808
  };

  const centerPixel = lonLatToWorldPixel(center.lon, center.lat, zoom);
  const topLeftPixel = {
    x: centerPixel.x - mapWidth / 2,
    y: centerPixel.y - mapHeight / 2
  };

  drawMapTiles(topLeftPixel, zoom);
  drawStreetLabels(topLeftPixel, zoom);
  drawRouteLines(topLeftPixel, zoom);
  drawLocationPoints(topLeftPixel, zoom);
  drawMapTitle();
}

function lonLatToWorldPixel(lon, lat, zoom) {
  const tileSize = 256;
  const scale = tileSize * Math.pow(2, zoom);

  const x = (lon + 180) / 360 * scale;

  const latRad = lat * Math.PI / 180;
  const y = (
    1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI
  ) / 2 * scale;

  return { x: x, y: y };
}

function mapPoint(place, topLeftPixel, zoom) {
  const pixel = lonLatToWorldPixel(place.lon, place.lat, zoom);

  return [
    pixel.x - topLeftPixel.x,
    pixel.y - topLeftPixel.y
  ];
}

function drawMapTiles(topLeftPixel, zoom) {
  const tileSize = 256;

  const firstTileX = Math.floor(topLeftPixel.x / tileSize);
  const firstTileY = Math.floor(topLeftPixel.y / tileSize);
  const lastTileX = Math.floor((topLeftPixel.x + mapWidth) / tileSize);
  const lastTileY = Math.floor((topLeftPixel.y + mapHeight) / tileSize);

  const tiles = [];

  for (let x = firstTileX; x <= lastTileX; x++) {
    for (let y = firstTileY; y <= lastTileY; y++) {
      tiles.push({ x: x, y: y });
    }
  }

  mapSvg.append("g")
    .selectAll("image")
    .data(tiles)
    .enter()
    .append("image")
    .attr("x", d => d.x * tileSize - topLeftPixel.x)
    .attr("y", d => d.y * tileSize - topLeftPixel.y)
    .attr("width", tileSize)
    .attr("height", tileSize)
    .attr("href", d => {
      return "https://a.basemaps.cartocdn.com/light_all/" +
        zoom + "/" + d.x + "/" + d.y + ".png";
    });
}

function drawStreetLabels(topLeftPixel, zoom) {
  mapSvg.selectAll(".street-label-shadow")
    .data(streetLabels)
    .enter()
    .append("text")
    .attr("class", "street-label-shadow")
    .attr("x", d => mapPoint(d, topLeftPixel, zoom)[0])
    .attr("y", d => mapPoint(d, topLeftPixel, zoom)[1])
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .attr("stroke", "white")
    .attr("stroke-width", 4)
    .attr("paint-order", "stroke")
    .attr("fill", "#333")
    .attr("opacity", 0.95)
    .attr("transform", d => {
      const point = mapPoint(d, topLeftPixel, zoom);
      return "rotate(" + d.angle + "," + point[0] + "," + point[1] + ")";
    })
    .text(d => d.name);

  mapSvg.selectAll(".street-label")
    .data(streetLabels)
    .enter()
    .append("text")
    .attr("class", "street-label")
    .attr("x", d => mapPoint(d, topLeftPixel, zoom)[0])
    .attr("y", d => mapPoint(d, topLeftPixel, zoom)[1])
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .attr("fill", "#333")
    .attr("opacity", 0.95)
    .attr("transform", d => {
      const point = mapPoint(d, topLeftPixel, zoom);
      return "rotate(" + d.angle + "," + point[0] + "," + point[1] + ")";
    })
    .text(d => d.name);
}

function drawRouteLines(topLeftPixel, zoom) {
  const line = d3.line()
    .x(d => mapPoint(d, topLeftPixel, zoom)[0])
    .y(d => mapPoint(d, topLeftPixel, zoom)[1])
    .curve(d3.curveLinear);

  mapSvg.selectAll(".route-path-background")
    .data(routes)
    .enter()
    .append("path")
    .attr("class", "route-path-background")
    .attr("d", d => line(d.points))
    .attr("fill", "none")
    .attr("stroke", "#111")
    .attr("stroke-width", d => d.name === selectedRoute.name ? 12 : 6)
    .attr("opacity", d => d.name === selectedRoute.name ? 0.75 : 0.25)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round");

  mapSvg.selectAll(".route-path")
    .data(routes)
    .enter()
    .append("path")
    .attr("class", "route-path")
    .attr("d", d => line(d.points))
    .attr("fill", "none")
    .attr("stroke", d => d.name === selectedRoute.name ? "#00ff55" : "#ffffff")
    .attr("stroke-width", d => d.name === selectedRoute.name ? 7 : 3)
    .attr("opacity", d => d.name === selectedRoute.name ? 1 : 0.35)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round");
}

function drawLocationPoints(topLeftPixel, zoom) {
  const placeData = Object.values(places);
  const startNode = selectedRoute.points[0];
  const endNode = selectedRoute.points[selectedRoute.points.length - 1];

  mapSvg.selectAll(".location-dot-outer")
    .data(placeData)
    .enter()
    .append("circle")
    .attr("class", "location-dot-outer")
    .attr("cx", d => mapPoint(d, topLeftPixel, zoom)[0])
    .attr("cy", d => mapPoint(d, topLeftPixel, zoom)[1])
    .attr("r", 13)
    .attr("fill", "white");

  mapSvg.selectAll(".location-dot")
    .data(placeData)
    .enter()
    .append("circle")
    .attr("class", "location-dot")
    .attr("cx", d => mapPoint(d, topLeftPixel, zoom)[0])
    .attr("cy", d => mapPoint(d, topLeftPixel, zoom)[1])
    .attr("r", 9)
    .attr("fill", d => {
      if (d.name === startNode.name) return "red";
      if (d.name === endNode.name) return "#0077ff";
      return "#111";
    });

  mapSvg.selectAll(".location-label-shadow")
    .data(placeData)
    .enter()
    .append("text")
    .attr("x", d => mapPoint(d, topLeftPixel, zoom)[0] + 16)
    .attr("y", d => mapPoint(d, topLeftPixel, zoom)[1] - 2)
    .attr("font-size", "15px")
    .attr("font-weight", "bold")
    .attr("stroke", "white")
    .attr("stroke-width", 3)
    .attr("paint-order", "stroke")
    .attr("fill", "white")
    .text(d => d.name);

  mapSvg.selectAll(".location-label")
    .data(placeData)
    .enter()
    .append("text")
    .attr("x", d => mapPoint(d, topLeftPixel, zoom)[0] + 16)
    .attr("y", d => mapPoint(d, topLeftPixel, zoom)[1] - 2)
    .attr("font-size", "15px")
    .attr("font-weight", "bold")
    .attr("fill", "black")
    .text(d => d.name);
}

function drawMapTitle() {
  // Title box (keep this part)
  mapSvg.append("rect")
    .attr("x", 12)
    .attr("y", 12)
    .attr("width", 287)
    .attr("height", 36)
    .attr("rx", 8)
    .attr("fill", "rgba(0, 0, 0, 0.65)");

  mapSvg.append("text")
    .attr("x", 25)
    .attr("y", 35)
    .attr("fill", "white")
    .attr("font-size", "17px")
    .attr("font-weight", "bold")
    .text("Selected Route: " + selectedRoute.name);

  const legendX = mapWidth - 190;
  const legendY = 20;

  mapSvg.append("rect")
    .attr("x", legendX)
    .attr("y", legendY)
    .attr("width", 170)
    .attr("height", 115)
    .attr("rx", 10)
    .attr("fill", "rgba(0, 0, 0, 0.7)");

  mapSvg.append("text")
    .attr("x", legendX + 85)
    .attr("y", legendY + 20)
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .attr("font-size", "13px")
    .attr("font-weight", "bold")
    .text("Legend");

    mapSvg.append("circle")
    .attr("cx", legendX + 25)
    .attr("cy", legendY + 45)
    .attr("r", 7)
    .attr("fill", "red");

  mapSvg.append("text")
    .attr("x", legendX + 45)
    .attr("y", legendY + 49)
    .attr("fill", "white")
    .attr("font-size", "12px")
    .text("Start");

  mapSvg.append("circle")
    .attr("cx", legendX + 25)
    .attr("cy", legendY + 70)
    .attr("r", 7)
    .attr("fill", "#0077ff");

  mapSvg.append("text")
    .attr("x", legendX + 45)
    .attr("y", legendY + 74)
    .attr("fill", "white")
    .attr("font-size", "12px")
    .text("Destination");

  // OTHER / NOT INCLUDED dot
mapSvg.append("circle")
  .attr("cx", legendX + 25)
  .attr("cy", legendY + 95)
  .attr("r", 7)
  .attr("fill", "#111");

mapSvg.append("text")
  .attr("x", legendX + 45)
  .attr("y", legendY + 99)
  .attr("fill", "white")
  .attr("font-size", "12px")
  .text("Not Included");
}