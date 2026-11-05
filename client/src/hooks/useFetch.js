import { useCallback, useEffect, useState } from 'react'

// Ejecuta una función async (un service) y expone data, loading, error y reload.
// Uso: const { data, loading, error, reload } = useFetch(getProjects)
//      const { data } = useFetch(() => getProjectById(id), [id])
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(() => {
    setLoading(true)
    setError('')
    return fetcher()
      .then(setData)
      .catch((e) => setError(e.message || 'No se pudo cargar la información.'))
      .finally(() => setLoading(false))
  }, deps)

  useEffect(() => { load() }, [load])

  return { data, loading, error, reload: load }
}
