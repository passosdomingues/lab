
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import type { GraphData, Node, Link } from '../types';

declare const d3: any;

const colors: { [key: string]: string } = {
  'Patient': '#3b82f6', // blue-500
  'Anatomy': '#22c55e', // green-500
  'Finding': '#ef4444', // red-500
  'Metadata': '#a855f7', // purple-500
  'default': '#6b7280', // gray-500
};

export interface GraphVisualizerHandles {
  getSVGElement: () => SVGSVGElement | null;
}

interface GraphVisualizerProps {
  graphData: GraphData;
}

const GraphVisualizer = forwardRef<GraphVisualizerHandles, GraphVisualizerProps>(({ graphData }, ref) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useImperativeHandle(ref, () => ({
    getSVGElement: () => svgRef.current,
  }));

  useEffect(() => {
    if (!svgRef.current || !graphData) return;

    const { nodes, links } = graphData;

    if (!nodes || !links || nodes.length === 0) return;

    const graphNodes: (Node & { x?: number, y?: number })[] = JSON.parse(JSON.stringify(nodes));
    const graphLinks: (Link & { source: string | Node, target: string | Node })[] = JSON.parse(JSON.stringify(links));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    d3.select(".graph-tooltip").remove();
    const tooltip = d3.select("body").append("div")
      .attr("class", "graph-tooltip")
      .style("opacity", 0);

    const parent = svg.node().parentElement;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    
    const rootGroup = svg.append('g');

    const simulation = d3.forceSimulation(graphNodes)
      .force("link", d3.forceLink(graphLinks).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(15));

    const link = rootGroup.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(graphLinks)
      .join("line")
      .attr("stroke-width", 1.5)
      .on("mouseover", (event: MouseEvent, d: any) => {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`Relationship: <strong>${d.type}</strong>`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    const node = rootGroup.append("g")
      .selectAll("g")
      .data(graphNodes)
      .join("g")
      .call(drag(simulation))
      .on("mouseover", (event: MouseEvent, d: Node) => {
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`<strong>${d.label}</strong><br/>Group: ${d.group}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      });

    node.append("circle")
      .attr("r", 10)
      .attr("fill", (d: Node) => colors[d.group] || colors['default'])
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);
    
    node.append("text")
      .attr("x", 15)
      .attr("y", "0.31em")
      .text((d: Node) => d.label)
      .attr("fill", "#e5e7eb")
      .attr("font-size", "12px")
      .attr("font-family", "sans-serif");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
    });
    
    const zoom = d3.zoom().on('zoom', (event: any) => {
        rootGroup.attr('transform', event.transform);
    });

    svg.call(zoom);

    function drag(simulation: any) {
        function dragstarted(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event: any, d: any) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
    
    return () => {
      simulation.stop();
      tooltip.remove();
    };
  }, [graphData]);

  return <svg ref={svgRef} width="100%" height="100%"></svg>;
});

export { GraphVisualizer };
