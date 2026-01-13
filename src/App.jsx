import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Current from './Pages/Current'
import History from './Pages/History'
import Navbar from './compos/Navbar'

const App = () => {
  return (
    <div className="w-screen h-screen overflow-y-scroll border flex justify-center relative bg-neutral-900 ">
      <Navbar />

      <Routes>
          <Route path='/' element={<Current />} />
          <Route path='/History' element={<History />} />
      </Routes>

    </div>
  )
}

export default App