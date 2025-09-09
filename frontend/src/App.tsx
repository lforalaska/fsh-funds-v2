import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import { DonorOnboarding } from './pages/donors/DonorOnboarding'

function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>FSH Funds - Fundraising Management Platform</h1>
      <p>Welcome to your comprehensive fundraising management system!</p>
      <div style={{ marginTop: '2rem' }}>
        <p>🚀 Frontend: React + TypeScript + Vite</p>
        <p>⚡ Backend: FastAPI + Python</p>
        <p>🗄️ Database: PostgreSQL</p>
      </div>
      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link 
          to="/donors"
          style={{ 
            background: '#007acc', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          🎯 Donor Onboarding
        </Link>
        <a 
          href="http://localhost:8000/docs" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            background: '#28a745', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            textDecoration: 'none', 
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          📚 API Documentation
        </a>
      </div>
      <div style={{ marginTop: '3rem', maxWidth: '800px', margin: '3rem auto 0' }}>
        <h2>Donor Onboarding Workflow</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>1. Data Import</h3>
            <p style={{ fontSize: '0.9em', color: '#666' }}>Import existing donor data from spreadsheets</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>2. Duplicate Detection</h3>
            <p style={{ fontSize: '0.9em', color: '#666' }}>Identify potential duplicate records</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>3. Data Cleaning</h3>
            <p style={{ fontSize: '0.9em', color: '#666' }}>Review and merge duplicates</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>4. Profile Creation</h3>
            <p style={{ fontSize: '0.9em', color: '#666' }}>Complete donor contact information</p>
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>5. Segmentation</h3>
            <p style={{ fontSize: '0.9em', color: '#666' }}>Assign tags for targeted outreach</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Navigation() {
  return (
    <nav style={{ 
      background: '#007acc', 
      padding: '1rem 2rem',
      color: 'white'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2em' }}>
          FSH Funds
        </Link>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
          <Link to="/donors" style={{ color: 'white', textDecoration: 'none' }}>Donors</Link>
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/donors" element={<DonorOnboarding />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
