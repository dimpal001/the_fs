import { useEffect } from 'react'

export function useDebounceEffect(fn, waitTime, deps) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn()
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, deps)
}
