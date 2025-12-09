import * as d3 from "d3";
import { createTooltip } from "../utils/tooltipUtils";

export const renderBarChart = (svg, results) => {
  console.time("barChartRender");
  const margin = { top: 20, right: 30, bottom: 40, left: 200 };
  const width = 800 - margin.left - margin.right;
  const height =
    Math.max(400, results.length * 40) - margin.top - margin.bottom;

  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(results, (d) => d.score)])
    .range([0, width]);

  const yScale = d3
    .scaleBand()
    .domain(results.map((d) => d.title))
    .range([0, height])
    .padding(0.1);

  const colorScale = d3
    .scaleSequential()
    .domain([0, d3.max(results, (d) => d.score)])
    .interpolator(d3.interpolateRgb("#e0e7ff", "#4f46e5"));

  const bars = g
    .selectAll(".bar")
    .data(results)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", (d) => yScale(d.title))
    .attr("width", 0)
    .attr("height", yScale.bandwidth())
    .attr("fill", (d) => colorScale(d.score))
    .style("cursor", "pointer");

  bars
    .transition()
    .duration(750)
    .attr("width", (d) => xScale(d.score));

  g.selectAll(".score-label")
    .data(results)
    .enter()
    .append("text")
    .attr("class", "score-label")
    .attr("x", (d) => xScale(d.score) + 5)
    .attr("y", (d) => yScale(d.title) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .style("font-size", "12px")
    .style("fill", "#333")
    .text((d) => d.score.toFixed(3))
    .style("opacity", 0)
    .transition()
    .duration(750)
    .delay(500)
    .style("opacity", 1);

  g.selectAll(".title-label")
    .data(results)
    .enter()
    .append("text")
    .attr("class", "title-label")
    .attr("x", -10)
    .attr("y", (d) => yScale(d.title) + yScale.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .style("font-size", "12px")
    .style("fill", "#333")
    .text((d) =>
      d.title.length > 25 ? d.title.substring(0, 22) + "..." : d.title
    );

  g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(5));

  g.append("text")
    .attr("class", "x-label")
    .attr("transform", `translate(${width / 2},${height + 35})`)
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Relevance Score");

  const tooltip = createTooltip();

  bars
    .on("mouseover", function (event, d) {
      d3.select(this).style("opacity", 0.8);
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`
      <div style="font-weight: bold; color: #1f2937; margin-bottom: 8px;">${
        d.title
      }</div>
      <div style="color: #4f46e5; font-weight: 600; margin-bottom: 6px;">Score: ${d.score.toFixed(
        3
      )}</div>
      <div style="color: #6b7280; font-style: italic; font-size: 12px;">${d.text.substring(
        0,
        150
      )}...</div>
    `);

      // Smart positioning to avoid going off-screen
      const tooltipWidth = 320;
      let left = event.pageX + 10;
      let top = event.pageY - 28;

      if (left + tooltipWidth > window.innerWidth) {
        left = event.pageX - tooltipWidth - 10;
      }
      if (top < 0) {
        top = event.pageY + 10;
      }

      tooltip.style("left", left + "px").style("top", top + "px");
    })
    .on("mouseout", function () {
      d3.select(this).style("opacity", 1);
      tooltip.transition().duration(500).style("opacity", 0);
    });
  console.timeEnd("barChartRender");
  return tooltip;
};
