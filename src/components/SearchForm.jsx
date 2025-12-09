import React from 'react'

export const SearchForm = ({ query, setQuery, handleSearch, loading }) => {
  const onSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    handleSearch(query)
  }

  return (
    <form onSubmit={onSubmit} className="search-form">
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
          {loading ? '' : ''} Search
        </button>
      </div>
    </form>
  )
}
