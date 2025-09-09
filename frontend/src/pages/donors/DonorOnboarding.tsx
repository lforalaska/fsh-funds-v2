/**
 * Main donor onboarding workflow page
 */
import React, { useState } from 'react';
import { Donor } from '../../services/donorService';
import { DonorList } from '../../components/donors/DonorList';
import { DonorForm } from '../../components/donors/DonorForm';
import { DuplicateReview } from '../../components/donors/DuplicateReview';

type WorkflowStep = 'list' | 'create' | 'edit' | 'duplicateCheck';

export const DonorOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('list');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [newlyCreatedDonor, setNewlyCreatedDonor] = useState<Donor | null>(null);

  const handleCreateNew = () => {
    setSelectedDonor(null);
    setCurrentStep('create');
  };

  const handleSelectDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setCurrentStep('edit');
  };

  const handleDonorSaved = (donor: Donor) => {
    setNewlyCreatedDonor(donor);
    setCurrentStep('duplicateCheck');
  };

  const handleDuplicateCheckComplete = (mergedDonor?: Donor) => {
    setCurrentStep('list');
    setSelectedDonor(null);
    setNewlyCreatedDonor(null);
  };

  const handleCancel = () => {
    setCurrentStep('list');
    setSelectedDonor(null);
    setNewlyCreatedDonor(null);
  };

  const renderWorkflowSteps = () => {
    const steps = [
      { id: 'list', label: 'Donor List', active: currentStep === 'list' },
      { id: 'create', label: 'Create/Edit', active: ['create', 'edit'].includes(currentStep) },
      { id: 'duplicateCheck', label: 'Duplicate Check', active: currentStep === 'duplicateCheck' },
    ];

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        background: '#f8f9fa',
        borderRadius: '4px'
      }}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                background: step.active ? '#007acc' : '#e9ecef',
                color: step.active ? 'white' : '#6c757d',
                fontWeight: step.active ? 'bold' : 'normal',
              }}
            >
              <span style={{ 
                marginRight: '0.5rem',
                background: step.active ? 'rgba(255,255,255,0.3)' : '#ced4da',
                color: step.active ? 'white' : '#6c757d',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8em',
                fontWeight: 'bold'
              }}>
                {index + 1}
              </span>
              {step.label}
            </div>
            {index < steps.length - 1 && (
              <div style={{ 
                width: '40px', 
                height: '2px', 
                background: '#dee2e6', 
                alignSelf: 'center' 
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            🎯 Donor Onboarding Workflow
          </h1>
          
          <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
            Follow this guided workflow to import, review, and organize your donor data
          </p>

          {renderWorkflowSteps()}

          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            minHeight: '400px'
          }}>
            {currentStep === 'list' && (
              <DonorList 
                onSelectDonor={handleSelectDonor}
                onCreateNew={handleCreateNew}
              />
            )}

            {(currentStep === 'create' || currentStep === 'edit') && (
              <DonorForm
                donor={selectedDonor || undefined}
                onSave={handleDonorSaved}
                onCancel={handleCancel}
              />
            )}

            {currentStep === 'duplicateCheck' && newlyCreatedDonor && (
              <DuplicateReview
                donor={newlyCreatedDonor}
                onMergeComplete={handleDuplicateCheckComplete}
                onCancel={handleDuplicateCheckComplete}
              />
            )}
          </div>

          {/* Workflow Description */}
          <div style={{ 
            marginTop: '2rem', 
            padding: '1.5rem',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>Donor Onboarding Process</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <h4>1. Data Import</h4>
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                  Import existing donor data from spreadsheets or other systems
                </p>
              </div>
              <div>
                <h4>2. Duplicate Detection</h4>
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                  System identifies potential duplicates for review
                </p>
              </div>
              <div>
                <h4>3. Data Cleaning</h4>
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                  Staff reviews and merges duplicate records
                </p>
              </div>
              <div>
                <h4>4. Profile Creation</h4>
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                  Complete donor profiles with full contact information
                </p>
              </div>
              <div>
                <h4>5. Segmentation</h4>
                <p style={{ fontSize: '0.9em', color: '#666' }}>
                  Assign tags and categories for targeted outreach
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};