import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { createTooltip } from '../utils/tooltipUtils'
import { renderBarChart } from '../visualizations/BarChart'
import { renderNetworkGraph } from '../visualizations/NetworkGraph'

export const useVisualization = (results, visualizationType) => {
  const svgRef = useRef()

  useEffect(() => {
    if (!results.length) return

    if (visualizationType === 'data') {
      // No need to clear SVG for data table
      return
    }

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    let tooltip
    if (visualizationType === 'bar') {
      tooltip = renderBarChart(svg, results)
    } else if (visualizationType === 'network') {
      tooltip = renderNetworkGraph(svg, results)
    }

    return () => {
      if (tooltip) tooltip.remove()
    }
  }, [results, visualizationType])

  return svgRef
}
