import * as d3 from "d3";
import { createTooltip } from "../utils/tooltipUtils";

export const renderNetworkGraph = (svg, results) => {
  console.time("networkGraphRender");
  console.time("forceSimulation");
  const width = 800;
  const height = 600;

  svg.attr("width", width).attr("height", height);

  // Create nodes with category information
  const nodes = results.map((d, i) => ({
    id: i,
    title: d.title,
    text: d.text,
    score: d.score,
    category: d.category || "Other",
    keywords: d.keywords || [],
    x: width / 2 + Math.random() * 100 - 50,
    y: height / 2 + Math.random() * 100 - 50,
  }));

  // Create links based on shared keywords and categories
  const links = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let similarity = 0;

      // Category similarity
      if (nodes[i].category === nodes[j].category) {
        similarity += 0.3;
      }

      // Keyword similarity
      const keywords1 = nodes[i].keywords || [];
      const keywords2 = nodes[j].keywords || [];

      if (keywords1.length > 0 && keywords2.length > 0) {
        const intersection = keywords1.filter((k1) =>
          keywords2.some(
            (k2) =>
              k1.toLowerCase().includes(k2.toLowerCase()) ||
              k2.toLowerCase().includes(k1.toLowerCase())
          )
        );
        const keywordSimilarity =
          intersection.length / Math.max(keywords1.length, keywords2.length);
        similarity += keywordSimilarity * 0.5;
      }

      // Text similarity (fallback)
      const getWords = (text) =>
        text
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .split(/\s+/)
          .filter((w) => w.length > 3);
      const words1 = getWords(nodes[i].text + " " + nodes[i].title);
      const words2 = getWords(nodes[j].text + " " + nodes[j].title);
      const wordIntersection = words1.filter((word) => words2.includes(word));
      const textSimilarity =
        wordIntersection.length / Math.max(words1.length, words2.length);
      similarity += textSimilarity * 0.2;

      if (similarity > 0.15) {
        links.push({
          source: i,
          target: j,
          strength: Math.min(similarity, 1),
        });
      }
    }
  }

  // Color scale for nodes based on category
  const categories = [...new Set(nodes.map((d) => d.category))];
  const categoryColors = d3
    .scaleOrdinal()
    .domain(categories)
    .range(d3.schemeCategory10);

  // Size scale based on score
  const sizeScale = d3
    .scaleLinear()
    .domain([0, d3.max(results, (d) => d.score)])
    .range([8, 25]);

  // Create force simulation
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance((d) => 100 / (d.strength * 5 + 1))
        .strength((d) => d.strength)
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(30));

  // Create links
  const linkElements = svg
    .selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke", "#999")
    .style("stroke-opacity", (d) => d.strength * 2)
    .style("stroke-width", (d) => Math.max(1, d.strength * 10));

  // Create nodes
  const nodeElements = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", (d) => sizeScale(d.score))
    .attr("fill", (d) => categoryColors(d.category))
    .style("cursor", "pointer")
    .style("stroke", "#fff")
    .style("stroke-width", 2);

  // Add labels
  const labelElements = svg
    .selectAll(".label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .style("font-size", "10px")
    .style("font-weight", "bold")
    .style("text-anchor", "middle")
    .style("fill", "#333")
    .style("pointer-events", "none")
    .text((d) =>
      d.title.length > 15 ? d.title.substring(0, 12) + "..." : d.title
    );

  const tooltip = createTooltip();

  // Add interactivity
  nodeElements
    .on("mouseover", function (event, d) {
      // Fix the node position to prevent movement on hover
      d.fx = d.x;
      d.fy = d.y;

      // Scale the node by directly changing its radius instead of using CSS transform
      const currentRadius = sizeScale(d.score);
      const hoverRadius = currentRadius * 1.3;

      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", hoverRadius)
        .style("stroke", "#4f46e5")
        .style("stroke-width", 4)
        .style("cursor", "pointer");

      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`
      <div style="font-weight: bold; color: #1f2937; margin-bottom: 8px;">${
        d.title
      }</div>
      <div style="color: ${categoryColors(
        d.category
      )}; font-weight: 600; margin-bottom: 6px;">${d.category}</div>
      <div style="color: #4f46e5; font-weight: 600; margin-bottom: 6px;">Score: ${d.score.toFixed(
        3
      )}</div>
      <div style="color: #6b7280; font-style: italic; font-size: 12px; line-height: 1.3;">${d.text.substring(
        0,
        150
      )}...</div>
    `);

      // Smart positioning to avoid going off-screen
      const tooltipWidth = 320;
      const tooltipHeight = 120;
      let left = event.pageX + 10;
      let top = event.pageY - 28;

      if (left + tooltipWidth > window.innerWidth) {
        left = event.pageX - tooltipWidth - 10;
      }
      if (top < 0) {
        top = event.pageY + 10;
      }
      if (top + tooltipHeight > window.innerHeight) {
        top = event.pageY - tooltipHeight - 10;
      }

      tooltip.style("left", left + "px").style("top", top + "px");
    })
    .on("mouseout", function (event, d) {
      // Release the fixed position to allow natural movement
      d.fx = null;
      d.fy = null;

      // Reset the node radius to original size
      const originalRadius = sizeScale(d.score);

      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", originalRadius)
        .style("stroke", "#fff")
        .style("stroke-width", 2)
        .style("cursor", "pointer");
      tooltip.transition().duration(500).style("opacity", 0);
    })
    .call(
      d3
        .drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

  // Add category legend
  const legend = svg
    .append("g")
    .attr("class", "legend")
    .attr("transform", "translate(20, 20)");

  const legendItems = legend
    .selectAll(".legend-item")
    .data(categories)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legendItems
    .append("circle")
    .attr("r", 6)
    .attr("fill", (d) => categoryColors(d))
    .attr("stroke", "#fff")
    .attr("stroke-width", 1);

  legendItems
    .append("text")
    .attr("x", 15)
    .attr("y", 0)
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .style("fill", "#333")
    .text((d) => d);

  // Update positions on each tick
  simulation.on("tick", () => {
    linkElements
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    nodeElements.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    labelElements.attr("x", (d) => d.x).attr("y", (d) => d.y + 35);
  });

  simulation.on("end", () => {
    console.timeEnd("forceSimulation");
  });

  console.timeEnd("networkGraphRender");

  return tooltip;
};
