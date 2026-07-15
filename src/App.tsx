import { useState, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'framer-motion'
import { router } from './router'
import { initLenis } from './lib/scroll'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const lenis = initLenis()
    return () => lenis.destroy()
  }, [])

  return (
    <LazyMotion features={domAnimation}>
      <RouterProvider router={router} />
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
    </LazyMotion>
  )
}
