import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>FastAPI + React Boilerplate</h1>
      <p>Welcome to your full-stack application!</p>
      <div style={{ marginTop: '2rem' }}>
        <p>🚀 Frontend: React + TypeScript + Vite</p>
        <p>⚡ Backend: FastAPI + Python</p>
        <p>🗄️ Database: PostgreSQL</p>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <a 
          href="/docs" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            background: '#007acc', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            textDecoration: 'none', 
            borderRadius: '4px',
            margin: '0 0.5rem'
          }}
        >
          API Documentation
        </a>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        <main style={{ padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
