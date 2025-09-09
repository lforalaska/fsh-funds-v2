import { createBrowserRouter } from 'react-router-dom';
import { DonorOnboarding } from './pages/donors/DonorOnboarding';

// Simple Dashboard component
function Dashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>FSH Funds Dashboard</h1>
      <p>Welcome to your fundraising management platform!</p>
      <div style={{ marginTop: '2rem' }}>
        <a href="/donors" style={{ 
          background: '#007acc', 
          color: 'white', 
          padding: '0.75rem 1.5rem', 
          textDecoration: 'none', 
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          Manage Donors
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/donors',
    element: <DonorOnboarding />
  }
]);