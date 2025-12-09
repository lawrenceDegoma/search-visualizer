import React from 'react'
import { renderDataTable } from './DataTable'

export const DataPreview = ({ allData, results }) => {
  if (results.length > 0 || allData.length === 0) {
    return null
  }

  return (
    <div className="data-preview-section">
      <div className="data-preview-header">
        <h3>Available Documents ({allData.length} total)</h3>
        <p>Browse the dataset below to see what information you can search for</p>
      </div>
      <div className="data-preview-container">
        {renderDataTable(allData, false)}
      </div>
    </div>
  )
}
