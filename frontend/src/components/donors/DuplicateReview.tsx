/**
 * Duplicate donor detection and review component
 */
import React, { useState, useEffect } from 'react';
import { Donor, donorService } from '../../services/donorService';

interface DuplicateReviewProps {
  donor: Donor;
  onMergeComplete?: (mergedDonor: Donor) => void;
  onCancel?: () => void;
}

export const DuplicateReview: React.FC<DuplicateReviewProps> = ({
  donor,
  onMergeComplete,
  onCancel,
}) => {
  const [duplicates, setDuplicates] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDuplicates();
  }, [donor.id]);

  const loadDuplicates = async () => {
    try {
      setLoading(true);
      const data = await donorService.findDuplicates(donor.id);
      setDuplicates(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find duplicates');
    } finally {
      setLoading(false);
    }
  };

  const handleMerge = async (duplicateId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to merge these donor records? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setMerging(true);
      const mergedDonor = await donorService.mergeDonors(donor.id, duplicateId);
      
      if (onMergeComplete) {
        onMergeComplete(mergedDonor);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to merge donors');
    } finally {
      setMerging(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getSimilarityScore = (dup: Donor) => {
    let score = 0;
    let factors = [];

    // Name similarity
    if (donor.full_name && dup.full_name) {
      const name1 = donor.full_name.toLowerCase();
      const name2 = dup.full_name.toLowerCase();
      if (name1 === name2) {
        score += 40;
        factors.push('Exact name match');
      } else if (name1.includes(name2) || name2.includes(name1)) {
        score += 25;
        factors.push('Partial name match');
      }
    }

    // Email similarity
    if (donor.email && dup.email && donor.email.toLowerCase() === dup.email.toLowerCase()) {
      score += 35;
      factors.push('Same email');
    }

    // Phone similarity
    if (donor.phone && dup.phone) {
      const phone1 = donor.phone.replace(/\D/g, '');
      const phone2 = dup.phone.replace(/\D/g, '');
      if (phone1 === phone2) {
        score += 25;
        factors.push('Same phone');
      }
    }

    return { score, factors };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Checking for duplicate donors...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Duplicate Detection Review</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>Primary Donor Record</h3>
        <div style={{ 
          background: '#e7f5ff', 
          padding: '1rem', 
          borderRadius: '4px',
          border: '2px solid #007acc'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <strong>{donor.full_name || `${donor.first_name} ${donor.last_name}`}</strong>
              {donor.company && <div style={{ color: '#666' }}>{donor.company}</div>}
            </div>
            <div>
              <div>📧 {donor.email || 'No email'}</div>
              <div>📱 {donor.phone || 'No phone'}</div>
            </div>
            <div>
              <div>💰 {formatCurrency(donor.total_gifts)}</div>
              <div>🎁 {donor.total_gift_count} gifts</div>
            </div>
          </div>
        </div>
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

      {duplicates.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          background: '#d4edda',
          color: '#155724',
          borderRadius: '4px'
        }}>
          <h3>✅ No Duplicates Found</h3>
          <p>This donor appears to be unique in your database.</p>
          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '1rem',
              }}
            >
              Continue
            </button>
          )}
        </div>
      ) : (
        <div>
          <h3>⚠️ Potential Duplicates Found ({duplicates.length})</h3>
          <p>Review these potential duplicate records and decide whether to merge them:</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {duplicates.map((duplicate) => {
              const similarity = getSimilarityScore(duplicate);
              
              return (
                <div
                  key={duplicate.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '1rem',
                    background: similarity.score >= 70 ? '#fff3cd' : '#f8f9fa',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>
                        {duplicate.full_name || `${duplicate.first_name} ${duplicate.last_name}`}
                        <span
                          style={{
                            marginLeft: '1rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.8em',
                            background: similarity.score >= 70 ? '#dc3545' : similarity.score >= 50 ? '#ffc107' : '#28a745',
                            color: similarity.score >= 70 ? 'white' : similarity.score >= 50 ? '#856404' : 'white',
                          }}
                        >
                          {similarity.score}% match
                        </span>
                      </h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          {duplicate.company && <div style={{ color: '#666' }}>{duplicate.company}</div>}
                          <div>📧 {duplicate.email || 'No email'}</div>
                          <div>📱 {duplicate.phone || 'No phone'}</div>
                        </div>
                        <div>
                          <div>{duplicate.city && duplicate.state ? `${duplicate.city}, ${duplicate.state}` : (duplicate.city || duplicate.state || 'No location')}</div>
                          <div>Status: <span style={{ 
                            color: duplicate.donor_status === 'active' ? '#28a745' : '#dc3545' 
                          }}>{duplicate.donor_status}</span></div>
                        </div>
                        <div>
                          <div>💰 {formatCurrency(duplicate.total_gifts)}</div>
                          <div>🎁 {duplicate.total_gift_count} gifts</div>
                          <div style={{ fontSize: '0.9em', color: '#666' }}>
                            Created: {new Date(duplicate.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {similarity.factors.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <strong>Matching factors:</strong>
                          <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                            {similarity.factors.map((factor, index) => (
                              <li key={index} style={{ fontSize: '0.9em', color: '#666' }}>{factor}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div style={{ marginLeft: '1rem' }}>
                      <button
                        onClick={() => handleMerge(duplicate.id)}
                        disabled={merging}
                        style={{
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: merging ? 'not-allowed' : 'pointer',
                          opacity: merging ? 0.7 : 1,
                        }}
                      >
                        {merging ? 'Merging...' : 'Merge Records'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            {onCancel && (
              <button
                onClick={onCancel}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Skip Duplicate Check
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};