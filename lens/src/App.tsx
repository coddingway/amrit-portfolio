import { useLens } from '@/state/store'
import Landing from '@/pages/Landing'
import Experience from '@/pages/Experience'
import SmallScreenGate from '@/components/SmallScreenGate'

export default function App() {
  const view = useLens((s) => s.view)
  return (
    <>
      <SmallScreenGate />
      {view === 'landing' ? <Landing /> : <Experience />}
    </>
  )
}
