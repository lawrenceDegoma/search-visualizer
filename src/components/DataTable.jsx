import React from 'react'

export const renderDataTable = (results, showScores = true) => {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Title</th>
            <th>Category</th>
            {showScores && <th>Score</th>}
            <th>Keywords</th>
            <th>Text</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td className="rank-cell">{index + 1}</td>
              <td className="title-cell">{result.title}</td>
              <td className="category-cell">
                <span className="category-badge">{result.category}</span>
              </td>
              {showScores && <td className="score-cell">{result.score.toFixed(3)}</td>}
              <td className="keywords-cell">
                {result.keywords && result.keywords.length > 0 ? (
                  <div className="keywords-list">
                    {result.keywords.map((keyword, idx) => (
                      <span key={idx} className="keyword-tag">{keyword}</span>
                    ))}
                  </div>
                ) : (
                  <span className="no-keywords">No keywords</span>
                )}
              </td>
              <td className="text-cell">{result.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
