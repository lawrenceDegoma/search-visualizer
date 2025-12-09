import React from 'react'
import { renderDataTable } from './DataTable'

export const SearchResults = ({ 
  results, 
  allData, 
  visualizationType, 
  setVisualizationType, 
  svgRef 
}) => {
  if (results.length === 0) {
    return null
  }

  return (
    <div className="results-section">
      <div className="results-header">
        <h2>Search Results ({results.length} found)</h2>
        <div className="visualization-controls">
          <button 
            className={`viz-button ${visualizationType === 'bar' ? 'active' : ''}`}
            onClick={() => setVisualizationType('bar')}
          >
            Bar Chart
          </button>
          <button 
            className={`viz-button ${visualizationType === 'network' ? 'active' : ''}`}
            onClick={() => setVisualizationType('network')}
          >
            Network Graph
          </button>
          <button 
            className={`viz-button ${visualizationType === 'data' ? 'active' : ''}`}
            onClick={() => setVisualizationType('data')}
          >
            All Data
          </button>
        </div>
      </div>
      <div className="chart-container">
        <div className="viz-description">
          {visualizationType === 'bar' ? 
            'Bar chart showing document relevance scores. Hover for details.' :
            visualizationType === 'network' ?
            'Network graph showing document relationships. Drag nodes to explore connections.' :
            'Complete dataset showing all available documents for reference.'
          }
        </div>
        {visualizationType === 'data' ? 
          renderDataTable(allData, false) :
          <svg ref={svgRef}></svg>
        }
      </div>
    </div>
  )
}
