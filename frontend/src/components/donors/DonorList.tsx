/**
 * Donor list component with search functionality
 */
import React, { useState, useEffect } from 'react';
import { Donor, donorService } from '../../services/donorService';

interface DonorListProps {
  onSelectDonor?: (donor: Donor) => void;
  onCreateNew?: () => void;
}

export const DonorList: React.FC<DonorListProps> = ({ onSelectDonor, onCreateNew }) => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      setLoading(true);
      const data = await donorService.getDonors(0, 100);
      setDonors(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load donors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDonors();
      return;
    }

    try {
      setLoading(true);
      const data = await donorService.searchDonors(searchQuery);
      setDonors(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading donors...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <h2>Donor Management</h2>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            style={{
              background: '#007acc',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Add New Donor
          </button>
        )}
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder="Search donors by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
        <button
          onClick={loadDonors}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Clear
        </button>
      </div>

      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '0.75rem', 
          borderRadius: '4px',
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Phone</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Location</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Total Gifts</th>
              <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donors.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                  {searchQuery ? 'No donors found matching your search.' : 'No donors found. Start by adding your first donor!'}
                </td>
              </tr>
            ) : (
              donors.map((donor) => (
                <tr key={donor.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    <strong>{donor.full_name || `${donor.first_name} ${donor.last_name}`}</strong>
                    {donor.company && <div style={{ fontSize: '0.9em', color: '#666' }}>{donor.company}</div>}
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    {donor.email || '-'}
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    {donor.phone || '-'}
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    {donor.city && donor.state ? `${donor.city}, ${donor.state}` : (donor.city || donor.state || '-')}
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8em',
                        background: donor.donor_status === 'active' ? '#d4edda' : '#f8d7da',
                        color: donor.donor_status === 'active' ? '#155724' : '#721c24',
                      }}
                    >
                      {donor.donor_status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    <div>{formatCurrency(donor.total_gifts)}</div>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>({donor.total_gift_count} gifts)</div>
                  </td>
                  <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                    {onSelectDonor && (
                      <button
                        onClick={() => onSelectDonor(donor)}
                        style={{
                          background: '#007acc',
                          color: 'white',
                          border: 'none',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.9em',
                        }}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {donors.length > 0 && (
        <div style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
          Showing {donors.length} donors
        </div>
      )}
    </div>
  );
};