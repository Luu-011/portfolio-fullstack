import { useState } from 'react'

// Web Storage API con useState
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  const set = (next) => {
    setValue(next)
    try {
      if (next === null) window.localStorage.removeItem(key)
      else window.localStorage.setItem(key, JSON.stringify(next))
    } catch {
      /* almacenamiento no disponible */
    }
  }

  return [value, set]
}
