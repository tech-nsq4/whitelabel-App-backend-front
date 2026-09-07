import { useState, useCallback } from 'react'

export function useValidation() {
  const [errors, setErrors] = useState({})

  /**
   * Returns true when a value should be considered empty/invalid.
   * Covers: undefined, null, '', '   ', [], 0 treated as valid (0 is a valid number)
   * false is treated as valid (checkbox unchecked is intentional).
   */
  function isEmpty(val) {
    if (val === undefined || val === null) return true
    if (typeof val === 'string' && !val.trim()) return true
    if (Array.isArray(val) && val.length === 0) return true
    return false
  }

  const validate = useCallback((form, rules) => {
    const next = {}
    for (const [key, msg] of Object.entries(rules)) {
      if (isEmpty(form[key])) {
        next[key] = msg
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }, [])

  const clearError = useCallback((key) => {
    setErrors(prev => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }, [])

  const resetErrors = useCallback(() => setErrors({}), [])

  return { errors, validate, clearError, resetErrors }
}
