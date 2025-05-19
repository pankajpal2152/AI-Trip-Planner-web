import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Hero from './components/custom/Hero'
import Footer from './view-trip/components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Hero */}
      <Hero />
      {/* Footer */}
      <Footer />
    </>
  )
}

export default App
