/**
 * Donor creation and editing form component
 */
import React, { useState, useEffect } from 'react';
import { Donor, DonorCreate, DonorUpdate, donorService } from '../../services/donorService';

interface DonorFormProps {
  donor?: Donor;
  onSave?: (donor: Donor) => void;
  onCancel?: () => void;
}

export const DonorForm: React.FC<DonorFormProps> = ({ donor, onSave, onCancel }) => {
  const [formData, setFormData] = useState<DonorCreate>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    mobile_phone: '',
    work_phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    company: '',
    job_title: '',
    preferred_contact_method: 'email',
    do_not_email: false,
    do_not_call: false,
    do_not_mail: false,
    donor_type: 'individual',
    notes: '',
    source: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (donor) {
      setFormData({
        first_name: donor.first_name,
        last_name: donor.last_name,
        email: donor.email || '',
        phone: donor.phone || '',
        // Set other fields from donor if available
        country: 'US',
        preferred_contact_method: 'email',
        do_not_email: false,
        do_not_call: false,
        do_not_mail: false,
        donor_type: donor.donor_type,
        notes: '',
        source: '',
      });
    }
  }, [donor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let savedDonor: Donor;
      
      if (donor) {
        // Update existing donor
        savedDonor = await donorService.updateDonor(donor.id, formData as DonorUpdate);
      } else {
        // Create new donor
        savedDonor = await donorService.createDonor(formData);
      }

      if (onSave) {
        onSave(savedDonor);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save donor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>{donor ? 'Edit Donor' : 'Add New Donor'}</h2>

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

      <form onSubmit={handleSubmit}>
        {/* Personal Information */}
        <fieldset style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <legend style={{ padding: '0 0.5rem', fontWeight: 'bold' }}>Personal Information</legend>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
        </fieldset>

        {/* Address Information */}
        <fieldset style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <legend style={{ padding: '0 0.5rem', fontWeight: 'bold' }}>Address</legend>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
              Address Line 1
            </label>
            <input
              type="text"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                ZIP Code
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
        </fieldset>

        {/* Professional Information */}
        <fieldset style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <legend style={{ padding: '0 0.5rem', fontWeight: 'bold' }}>Professional Information</legend>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
                Job Title
              </label>
              <input
                type="text"
                name="job_title"
                value={formData.job_title}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
        </fieldset>

        {/* Preferences */}
        <fieldset style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <legend style={{ padding: '0 0.5rem', fontWeight: 'bold' }}>Communication Preferences</legend>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
              Preferred Contact Method
            </label>
            <select
              name="preferred_contact_method"
              value={formData.preferred_contact_method}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="mail">Mail</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="do_not_email"
                checked={formData.do_not_email}
                onChange={handleChange}
              />
              Do not email
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="do_not_call"
                checked={formData.do_not_call}
                onChange={handleChange}
              />
              Do not call
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                name="do_not_mail"
                checked={formData.do_not_mail}
                onChange={handleChange}
              />
              Do not mail
            </label>
          </div>
        </fieldset>

        {/* Notes */}
        <fieldset style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
          <legend style={{ padding: '0 0.5rem', fontWeight: 'bold' }}>Additional Information</legend>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                resize: 'vertical',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>
              Source
            </label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="How did they hear about us?"
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
          </div>
        </fieldset>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#007acc',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Saving...' : (donor ? 'Update Donor' : 'Create Donor')}
          </button>
          
          {onCancel && (
            <button
              type="button"
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
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};