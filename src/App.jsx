import React, { useState } from 'react'
import './App.css'
import { useSearchData } from './hooks/useSearchData'
import { useVisualization } from './hooks/useVisualization'
import { SearchForm } from './components/SearchForm'
import { DataPreview } from './components/DataPreview'
import { SearchResults } from './components/SearchResults'
import { ErrorMessage } from './components/ErrorMessage'
import { NoResults } from './components/NoResults'

function App() {
  const [visualizationType, setVisualizationType] = useState('bar')
  
  const {
    query,
    setQuery,
    results,
    allData,
    loading,
    error,
    handleSearch,
    resetSearch
  } = useSearchData()

  const svgRef = useVisualization(results, visualizationType)

  const handleTitleClick = () => {
    resetSearch()
    setVisualizationType('bar')
  }

  return (
    <div className="app">
      <div className="header">
        <h1 onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
          Search Result Visualizer
        </h1>
      </div>

      <p className="subtext">See how documents rank based on relevance</p>
      
      <SearchForm 
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        loading={loading}
      />

      <DataPreview allData={allData} results={results} />

      <SearchResults 
        results={results}
        allData={allData}
        visualizationType={visualizationType}
        setVisualizationType={setVisualizationType}
        svgRef={svgRef}
      />

      <ErrorMessage error={error} />

      <NoResults results={results} query={query} loading={loading} error={error} />
    </div>
  )
}

export default App
