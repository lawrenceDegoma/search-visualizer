import React from 'react'

export const ErrorMessage = ({ error }) => {
  if (!error) {
    return null
  }

  return (
    <div className="error-message">
      <p>{error}</p>
    </div>
  )
}
