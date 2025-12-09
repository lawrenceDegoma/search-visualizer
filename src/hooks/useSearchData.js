import { useState, useEffect } from 'react'
import axios from 'axios'

export const useSearchData = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [allData, setAllData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/data')
        setAllData(response.data)
      } catch (error) {
        console.error('Error loading data:', error)
        try {
          const response = await axios.get('http://localhost:3001/search?q=')
          setAllData(response.data)
        } catch (fallbackError) {
          console.error('Error loading data via fallback:', fallbackError)
        }
      }
    }
    
    loadAllData()
  }, [])

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError('')
    try {
      const response = await axios.get(`http://localhost:3001/search?q=${encodeURIComponent(searchQuery)}`)
      setResults(response.data)
    } catch (error) {
      console.error('Search error:', error)
      setError('Failed to fetch search results. Please make sure the backend server is running.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const resetSearch = () => {
    setQuery('')
    setResults([])
    setError('')
  }

  return {
    query,
    setQuery,
    results,
    allData,
    loading,
    error,
    handleSearch,
    resetSearch
  }
}
