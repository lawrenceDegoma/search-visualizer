// Copilot context: Building a Search Result Visualizer using React + D3.js.
// Fetches search results from backend and displays them as an interactive D3 bar chart.

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import * as d3 from 'd3'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [visualizationType, setVisualizationType] = useState('bar') // 'bar' or 'network'
  const svgRef = useRef()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`http://localhost:3001/search?q=${encodeURIComponent(query)}`)
      setResults(response.data)
    } catch (error) {
      console.error('Search error:', error)
      setError('Failed to fetch search results. Please make sure the backend server is running.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Create shared tooltip
  const createTooltip = () => {
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

  // Bar Chart Visualization
  const renderBarChart = (svg, results) => {
    const margin = { top: 20, right: 30, bottom: 40, left: 200 }
    const width = 800 - margin.left - margin.right
    const height = Math.max(400, results.length * 40) - margin.top - margin.bottom

    svg.attr('width', width + margin.left + margin.right)
       .attr('height', height + margin.top + margin.bottom)

    const g = svg.append('g')
                 .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3.scaleLinear()
                     .domain([0, d3.max(results, d => d.score)])
                     .range([0, width])

    const yScale = d3.scaleBand()
                     .domain(results.map(d => d.title))
                     .range([0, height])
                     .padding(0.1)

    const colorScale = d3.scaleSequential()
                         .domain([0, d3.max(results, d => d.score)])
                         .interpolator(d3.interpolateRgb("#e0e7ff", "#4f46e5"))

    const bars = g.selectAll('.bar')
                  .data(results)
                  .enter()
                  .append('rect')
                  .attr('class', 'bar')
                  .attr('x', 0)
                  .attr('y', d => yScale(d.title))
                  .attr('width', 0)
                  .attr('height', yScale.bandwidth())
                  .attr('fill', d => colorScale(d.score))
                  .style('cursor', 'pointer')

    bars.transition()
        .duration(750)
        .attr('width', d => xScale(d.score))

    g.selectAll('.score-label')
     .data(results)
     .enter()
     .append('text')
     .attr('class', 'score-label')
     .attr('x', d => xScale(d.score) + 5)
     .attr('y', d => yScale(d.title) + yScale.bandwidth() / 2)
     .attr('dy', '0.35em')
     .style('font-size', '12px')
     .style('fill', '#333')
     .text(d => d.score.toFixed(3))
     .style('opacity', 0)
     .transition()
     .duration(750)
     .delay(500)
     .style('opacity', 1)

    g.selectAll('.title-label')
     .data(results)
     .enter()
     .append('text')
     .attr('class', 'title-label')
     .attr('x', -10)
     .attr('y', d => yScale(d.title) + yScale.bandwidth() / 2)
     .attr('dy', '0.35em')
     .attr('text-anchor', 'end')
     .style('font-size', '12px')
     .style('fill', '#333')
     .text(d => d.title.length > 25 ? d.title.substring(0, 22) + '...' : d.title)

    g.append('g')
     .attr('class', 'x-axis')
     .attr('transform', `translate(0,${height})`)
     .call(d3.axisBottom(xScale).ticks(5))

    g.append('text')
     .attr('class', 'x-label')
     .attr('transform', `translate(${width/2},${height + 35})`)
     .style('text-anchor', 'middle')
     .style('font-size', '14px')
     .text('Relevance Score')

    const tooltip = createTooltip()

    bars.on('mouseover', function(event, d) {
      d3.select(this).style('opacity', 0.8)
      tooltip.transition().duration(200).style('opacity', 1)
      tooltip.html(`
        <div style="font-weight: bold; color: #1f2937; margin-bottom: 8px;">${d.title}</div>
        <div style="color: #4f46e5; font-weight: 600; margin-bottom: 6px;">Score: ${d.score.toFixed(3)}</div>
        <div style="color: #6b7280; font-style: italic; font-size: 12px;">${d.text.substring(0, 150)}...</div>
      `)
      
      // Smart positioning to avoid going off-screen
      const tooltipWidth = 320
      const tooltipHeight = 100
      let left = event.pageX + 10
      let top = event.pageY - 28
      
      if (left + tooltipWidth > window.innerWidth) {
        left = event.pageX - tooltipWidth - 10
      }
      if (top < 0) {
        top = event.pageY + 10
      }
      
      tooltip.style('left', left + 'px').style('top', top + 'px')
    })
    .on('mouseout', function() {
      d3.select(this).style('opacity', 1)
      tooltip.transition().duration(500).style('opacity', 0)
    })

    return tooltip
  }

  // Network Graph Visualization
  const renderNetworkGraph = (svg, results) => {
    const width = 800
    const height = 600

    svg.attr('width', width).attr('height', height)

    // Create nodes with category information
    const nodes = results.map((d, i) => ({
      id: i,
      title: d.title,
      text: d.text,
      score: d.score,
      category: d.category || 'Other',
      keywords: d.keywords || [],
      x: width / 2 + Math.random() * 100 - 50,
      y: height / 2 + Math.random() * 100 - 50
    }))

    // Create links based on shared keywords and categories
    const links = []
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        let similarity = 0
        
        // Category similarity
        if (nodes[i].category === nodes[j].category) {
          similarity += 0.3
        }
        
        // Keyword similarity
        const keywords1 = nodes[i].keywords || []
        const keywords2 = nodes[j].keywords || []
        
        if (keywords1.length > 0 && keywords2.length > 0) {
          const intersection = keywords1.filter(k1 => 
            keywords2.some(k2 => 
              k1.toLowerCase().includes(k2.toLowerCase()) || 
              k2.toLowerCase().includes(k1.toLowerCase())
            )
          )
          const keywordSimilarity = intersection.length / Math.max(keywords1.length, keywords2.length)
          similarity += keywordSimilarity * 0.5
        }
        
        // Text similarity (fallback)
        const getWords = (text) => text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3)
        const words1 = getWords(nodes[i].text + ' ' + nodes[i].title)
        const words2 = getWords(nodes[j].text + ' ' + nodes[j].title)
        const wordIntersection = words1.filter(word => words2.includes(word))
        const textSimilarity = wordIntersection.length / Math.max(words1.length, words2.length)
        similarity += textSimilarity * 0.2
        
        if (similarity > 0.15) {
          links.push({
            source: i,
            target: j,
            strength: Math.min(similarity, 1)
          })
        }
      }
    }

    // Color scale for nodes based on category
    const categories = [...new Set(nodes.map(d => d.category))]
    const categoryColors = d3.scaleOrdinal()
                             .domain(categories)
                             .range(d3.schemeCategory10)
    
    // Size scale based on score
    const sizeScale = d3.scaleLinear()
                        .domain([0, d3.max(results, d => d.score)])
                        .range([8, 25])

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
                         .force('link', d3.forceLink(links)
                                         .id(d => d.id)
                                         .distance(d => 100 / (d.strength * 5 + 1))
                                         .strength(d => d.strength))
                         .force('charge', d3.forceManyBody().strength(-200))
                         .force('center', d3.forceCenter(width / 2, height / 2))
                         .force('collision', d3.forceCollide().radius(30))

    // Create links
    const linkElements = svg.selectAll('.link')
                            .data(links)
                            .enter()
                            .append('line')
                            .attr('class', 'link')
                            .style('stroke', '#999')
                            .style('stroke-opacity', d => d.strength * 2)
                            .style('stroke-width', d => Math.max(1, d.strength * 10))

    // Create nodes
    const nodeElements = svg.selectAll('.node')
                            .data(nodes)
                            .enter()
                            .append('circle')
                            .attr('class', 'node')
                            .attr('r', d => sizeScale(d.score))
                            .attr('fill', d => categoryColors(d.category))
                            .style('cursor', 'pointer')
                            .style('stroke', '#fff')
                            .style('stroke-width', 2)

    // Add labels
    const labelElements = svg.selectAll('.label')
                             .data(nodes)
                             .enter()
                             .append('text')
                             .attr('class', 'label')
                             .style('font-size', '10px')
                             .style('font-weight', 'bold')
                             .style('text-anchor', 'middle')
                             .style('fill', '#333')
                             .style('pointer-events', 'none')
                             .text(d => d.title.length > 15 ? d.title.substring(0, 12) + '...' : d.title)

    const tooltip = createTooltip()

    // Add interactivity
    nodeElements.on('mouseover', function(event, d) {
      d3.select(this)
        .style('stroke', '#4f46e5')
        .style('stroke-width', 4)
        .style('cursor', 'pointer')
      tooltip.transition().duration(200).style('opacity', 1)
      tooltip.html(`
        <div style="font-weight: bold; color: #1f2937; margin-bottom: 8px;">${d.title}</div>
        <div style="color: ${categoryColors(d.category)}; font-weight: 600; margin-bottom: 6px;">📂 ${d.category}</div>
        <div style="color: #4f46e5; font-weight: 600; margin-bottom: 6px;">Score: ${d.score.toFixed(3)}</div>
        <div style="color: #6b7280; font-style: italic; font-size: 12px; line-height: 1.3;">${d.text.substring(0, 150)}...</div>
      `)
      
      // Smart positioning to avoid going off-screen
      const tooltipWidth = 320
      const tooltipHeight = 120
      let left = event.pageX + 10
      let top = event.pageY - 28
      
      if (left + tooltipWidth > window.innerWidth) {
        left = event.pageX - tooltipWidth - 10
      }
      if (top < 0) {
        top = event.pageY + 10
      }
      if (top + tooltipHeight > window.innerHeight) {
        top = event.pageY - tooltipHeight - 10
      }
      
      tooltip.style('left', left + 'px').style('top', top + 'px')
    })
    .on('mouseout', function() {
      d3.select(this)
        .style('stroke', '#fff')
        .style('stroke-width', 2)
        .style('cursor', 'pointer')
      tooltip.transition().duration(500).style('opacity', 0)
    })
    .call(d3.drag()
            .on('start', (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart()
              d.fx = d.x
              d.fy = d.y
            })
            .on('drag', (event, d) => {
              d.fx = event.x
              d.fy = event.y
            })
            .on('end', (event, d) => {
              if (!event.active) simulation.alphaTarget(0)
              d.fx = null
              d.fy = null
            }))

    // Add category legend
    const legend = svg.append('g')
                      .attr('class', 'legend')
                      .attr('transform', 'translate(20, 20)')

    const legendItems = legend.selectAll('.legend-item')
                              .data(categories)
                              .enter()
                              .append('g')
                              .attr('class', 'legend-item')
                              .attr('transform', (d, i) => `translate(0, ${i * 20})`)

    legendItems.append('circle')
               .attr('r', 6)
               .attr('fill', d => categoryColors(d))
               .attr('stroke', '#fff')
               .attr('stroke-width', 1)

    legendItems.append('text')
               .attr('x', 15)
               .attr('y', 0)
               .attr('dy', '0.35em')
               .style('font-size', '12px')
               .style('fill', '#333')
               .text(d => d)

    // Update positions on each tick
    simulation.on('tick', () => {
      linkElements.attr('x1', d => d.source.x)
                  .attr('y1', d => d.source.y)
                  .attr('x2', d => d.target.x)
                  .attr('y2', d => d.target.y)

      nodeElements.attr('cx', d => d.x)
                  .attr('cy', d => d.y)

      labelElements.attr('x', d => d.x)
                   .attr('y', d => d.y + 35)
    })

    return tooltip
  }

  // Main visualization effect
  useEffect(() => {
    if (!results.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    let tooltip
    if (visualizationType === 'bar') {
      tooltip = renderBarChart(svg, results)
    } else {
      tooltip = renderNetworkGraph(svg, results)
    }

    return () => {
      if (tooltip) tooltip.remove()
    }
  }, [results, visualizationType])

  return (
    <div className="app">
      <div className="header">
        <h1>🔍 Search Result Visualizer</h1>
        <p>Enter a query to see how documents rank based on relevance</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
            className="search-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !query.trim()}
          >
            {loading ? '🔄' : '🔍'} Search
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h2>Search Results ({results.length} found)</h2>
            <div className="visualization-controls">
              <button 
                className={`viz-button ${visualizationType === 'bar' ? 'active' : ''}`}
                onClick={() => setVisualizationType('bar')}
              >
                📊 Bar Chart
              </button>
              <button 
                className={`viz-button ${visualizationType === 'network' ? 'active' : ''}`}
                onClick={() => setVisualizationType('network')}
              >
                🕸️ Network Graph
              </button>
            </div>
          </div>
          <div className="chart-container">
            <div className="viz-description">
              {visualizationType === 'bar' ? 
                'Bar chart showing document relevance scores. Hover for details.' :
                'Network graph showing document relationships. Drag nodes to explore connections.'
              }
            </div>
            <svg ref={svgRef}></svg>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {results.length === 0 && query && !loading && !error && (
        <div className="no-results">
          <p>No results found for "{query}". Try a different search term.</p>
        </div>
      )}
    </div>
  )
}

export default App
