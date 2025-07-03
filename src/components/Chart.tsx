"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface ChartProps {
  data: Record<string, unknown>[];
  chartType: "bar" | "line" | "pie" | "scatter";
  width: number;
  height: number;
}

export default function Chart({ data, chartType, width, height }: ChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Get the first string column and first numeric column
    const keys = Object.keys(data[0]);
    const stringKey = keys.find(key => typeof data[0][key] === 'string') || keys[0];
    const numericKey = keys.find(key => typeof data[0][key] === 'number') || keys[1] || keys[0];

    if (chartType === "bar") {
      // Bar chart
      const xScale = d3
        .scaleBand()
        .domain(data.map(d => String(d[stringKey])))
        .range([0, innerWidth])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => Number(d[numericKey])) || 0])
        .range([innerHeight, 0]);

      // X axis
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

      // Y axis
      g.append("g").call(d3.axisLeft(yScale));

      // Bars
      g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(String(d[stringKey])) || 0)
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(Number(d[numericKey])))
        .attr("height", d => innerHeight - yScale(Number(d[numericKey])))
        .attr("fill", "#10a37f");

    } else if (chartType === "pie") {
      // Pie chart
      const pie = d3.pie<any>().value(d => Number(d[numericKey]));
      const arc = d3.arc().innerRadius(0).outerRadius(Math.min(innerWidth, innerHeight) / 2);

      const pieData = pie(data);
      const colors = d3.scaleOrdinal(d3.schemeCategory10);

      const pieG = g
        .append("g")
        .attr("transform", `translate(${innerWidth / 2},${innerHeight / 2})`);

      pieG
        .selectAll(".arc")
        .data(pieData)
        .enter()
        .append("path")
        .attr("class", "arc")
        .attr("d", arc as any)
        .attr("fill", (d, i) => colors(String(i)));

      // Labels
      pieG
        .selectAll(".label")
        .data(pieData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("transform", d => `translate(${arc.centroid(d as any)})`)
        .attr("text-anchor", "middle")
        .text(d => String(d.data[stringKey]));

    } else if (chartType === "line") {
      // Line chart
      const xScale = d3
        .scalePoint()
        .domain(data.map(d => String(d[stringKey])))
        .range([0, innerWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => Number(d[numericKey])) || 0])
        .range([innerHeight, 0]);

      // X axis
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

      // Y axis
      g.append("g").call(d3.axisLeft(yScale));

      // Line
      const line = d3
        .line<any>()
        .x(d => xScale(String(d[stringKey])) || 0)
        .y(d => yScale(Number(d[numericKey])));

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#10a37f")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Points
      g.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(String(d[stringKey])) || 0)
        .attr("cy", d => yScale(Number(d[numericKey])))
        .attr("r", 4)
        .attr("fill", "#10a37f");

    } else if (chartType === "scatter") {
      // Scatter plot (use first two numeric columns)
      const numericKeys = keys.filter(key => typeof data[0][key] === 'number');
      const xKey = numericKeys[0] || numericKey;
      const yKey = numericKeys[1] || numericKey;

      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d => Number(d[xKey])) as [number, number])
        .range([0, innerWidth]);

      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d => Number(d[yKey])) as [number, number])
        .range([innerHeight, 0]);

      // X axis
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));

      // Y axis
      g.append("g").call(d3.axisLeft(yScale));

      // Points
      g.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(Number(d[xKey])))
        .attr("cy", d => yScale(Number(d[yKey])))
        .attr("r", 4)
        .attr("fill", "#10a37f");
    }

  }, [data, chartType, width, height]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
}
