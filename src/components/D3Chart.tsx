'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Box } from '@mui/material';

interface D3ChartProps {
  data: Record<string, unknown>[];
  chartType: 'bar' | 'line' | 'pie' | 'scatter';
  width?: number;
  height?: number;
}

export default function D3Chart({ data, chartType, width = 600, height = 400 }: D3ChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    switch (chartType) {
      case 'bar':
        renderBarChart(g, data, innerWidth, innerHeight);
        break;
      case 'line':
        renderLineChart(g, data, innerWidth, innerHeight);
        break;
      case 'pie':
        renderPieChart(g, data, innerWidth, innerHeight);
        break;
      case 'scatter':
        renderScatterPlot(g, data, innerWidth, innerHeight);
        break;
    }
  }, [data, chartType, width, height]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}
      />
    </Box>
  );
}

function renderBarChart(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: Record<string, unknown>[],
  width: number,
  height: number
) {
  const columns = Object.keys(data[0]);
  const xColumn = columns.find(col => typeof data[0][col] === 'string') || columns[0];
  const yColumn = columns.find(col => typeof data[0][col] === 'number') || columns[1];

  if (!xColumn || !yColumn) return;

  // Aggregate data if needed
  const aggregatedData = d3.rollup(
    data,
    v => d3.sum(v, d => Number(d[yColumn]) || 0),
    d => String(d[xColumn])
  );

  const chartData = Array.from(aggregatedData, ([key, value]) => ({ x: key, y: value }));

  const xScale = d3.scaleBand()
    .domain(chartData.map(d => d.x))
    .range([0, width])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(chartData, d => d.y) || 0])
    .range([height, 0]);

  // Add axes
  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-45)');

  g.append('g')
    .call(d3.axisLeft(yScale));

  // Add bars
  g.selectAll('.bar')
    .data(chartData)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d.x) || 0)
    .attr('width', xScale.bandwidth())
    .attr('y', d => yScale(d.y))
    .attr('height', d => height - yScale(d.y))
    .attr('fill', '#6366f1')
    .attr('opacity', 0.8)
    .on('mouseover', function(event, d) {
      d3.select(this).attr('opacity', 1);
      
      // Add tooltip
      const tooltip = g.append('g').attr('class', 'tooltip');
      tooltip.append('rect')
        .attr('x', (xScale(d.x) || 0) + xScale.bandwidth() / 2 - 30)
        .attr('y', yScale(d.y) - 30)
        .attr('width', 60)
        .attr('height', 20)
        .attr('fill', 'black')
        .attr('opacity', 0.8)
        .attr('rx', 4);
      
      tooltip.append('text')
        .attr('x', (xScale(d.x) || 0) + xScale.bandwidth() / 2)
        .attr('y', yScale(d.y) - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .text(d.y);
    })
    .on('mouseout', function() {
      d3.select(this).attr('opacity', 0.8);
      g.select('.tooltip').remove();
    });
}

function renderLineChart(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: Record<string, unknown>[],
  width: number,
  height: number
) {
  const columns = Object.keys(data[0]);
  const xColumn = columns.find(col => {
    const val = data[0][col];
    return typeof val === 'string' && !isNaN(Date.parse(val));
  }) || columns[0];
  const yColumn = columns.find(col => typeof data[0][col] === 'number') || columns[1];

  if (!xColumn || !yColumn) return;

  const parseTime = d3.timeParse('%Y-%m-%d');
  const chartData = data.map(d => ({
    x: parseTime(String(d[xColumn])) || new Date(String(d[xColumn])),
    y: Number(d[yColumn]) || 0
  })).filter(d => d.x);

  const xScale = d3.scaleTime()
    .domain(d3.extent(chartData, d => d.x) as [Date, Date])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(chartData, d => d.y) as [number, number])
    .range([height, 0]);

  const line = d3.line<{x: Date, y: number}>()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveMonotoneX);

  // Add axes
  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  g.append('g')
    .call(d3.axisLeft(yScale));

  // Add line
  g.append('path')
    .datum(chartData)
    .attr('fill', 'none')
    .attr('stroke', '#6366f1')
    .attr('stroke-width', 2)
    .attr('d', line);

  // Add dots
  g.selectAll('.dot')
    .data(chartData)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 4)
    .attr('fill', '#6366f1');
}

function renderPieChart(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: Record<string, unknown>[],
  width: number,
  height: number
) {
  const columns = Object.keys(data[0]);
  const labelColumn = columns.find(col => typeof data[0][col] === 'string') || columns[0];
  const valueColumn = columns.find(col => typeof data[0][col] === 'number') || columns[1];

  if (!labelColumn || !valueColumn) return;

  const radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const pie = d3.pie<Record<string, unknown>>()
    .value(d => Number(d[valueColumn]) || 0);

  const arc = d3.arc<d3.PieArcDatum<Record<string, unknown>>>()
    .innerRadius(0)
    .outerRadius(radius - 10);

  const chartG = g.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`);

  const arcs = chartG.selectAll('.arc')
    .data(pie(data))
    .enter().append('g')
    .attr('class', 'arc');

  arcs.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => color(i.toString()));

  arcs.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .text(d => String(d.data[labelColumn]));
}

function renderScatterPlot(
  g: d3.Selection<SVGGElement, unknown, null, undefined>,
  data: Record<string, unknown>[],
  width: number,
  height: number
) {
  const columns = Object.keys(data[0]);
  const numericColumns = columns.filter(col => typeof data[0][col] === 'number');
  
  if (numericColumns.length < 2) return;

  const xColumn = numericColumns[0];
  const yColumn = numericColumns[1];

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => Number(d[xColumn])) as [number, number])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => Number(d[yColumn])) as [number, number])
    .range([height, 0]);

  // Add axes
  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale));

  g.append('g')
    .call(d3.axisLeft(yScale));

  // Add dots
  g.selectAll('.dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScale(Number(d[xColumn])))
    .attr('cy', d => yScale(Number(d[yColumn])))
    .attr('r', 4)
    .attr('fill', '#6366f1')
    .attr('opacity', 0.7);
}
