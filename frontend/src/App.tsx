import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        {/* Routes */}
        <main style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={(<></>)} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
