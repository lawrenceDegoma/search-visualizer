import React from 'react'

export const NoResults = ({ results, query, loading, error }) => {
  if (results.length > 0 || !query || loading || error) {
    return null
  }

  return (
    <div className="no-results">
      <p>No results found for "{query}". Try a different search term.</p>
    </div>
  )
}
