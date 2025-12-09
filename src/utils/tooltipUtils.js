import * as d3 from 'd3'

export const createTooltip = () => {
  return d3.select('body').append('div')
           .attr('class', 'tooltip')
           .style('opacity', 0)
           .style('position', 'absolute')
           .style('background', '#ffffff')
           .style('color', '#333333')
           .style('border', '2px solid #4f46e5')
           .style('border-radius', '8px')
           .style('padding', '12px')
           .style('font-size', '13px')
           .style('font-family', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif')
           .style('line-height', '1.4')
           .style('max-width', '320px')
           .style('box-shadow', '0 4px 12px rgba(0,0,0,0.15)')
           .style('pointer-events', 'none')
           .style('z-index', '1000')
}
