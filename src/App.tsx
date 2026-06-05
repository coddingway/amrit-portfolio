import { useState, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { initLenis } from './lib/scroll'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoading) return
    const lenis = initLenis()
    return () => lenis.destroy()
  }, [isLoading])

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  return <RouterProvider router={router} />
}
