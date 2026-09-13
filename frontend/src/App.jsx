import { Route, Routes } from 'react-router-dom'
import Nav from './components/Nav'
import Dashboard from './pages/Dashboard'
import Calibration from './pages/Calibration'
import './App.css'

function App() {
  return (
    <>
      <Nav />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calibration" element={<Calibration />} />
        </Routes>
      </main>
    </>
  )
}

export default App
