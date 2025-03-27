import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Stepper, Step, StepLabel, StepContent, Button, Paper,
  Typography, Container, Grid, TextField, CircularProgress
} from '@mui/material';
import IDGenerater from '../../utils/IdGenerater';
import usePatientStore from 'src/store/patientStore';
import { useNavigate } from 'react-router-dom';

const steps = [
  { label: 'Patient Details', description: 'Enter Patient Details:', fields: ['Patient Name (First, Last Name)', 'Location', 'Age', 'Gender', 'Phone', 'Address', 'Patient ID'] },
  { label: 'Prescription Details', description: 'Enter Prescription Details:', fields: ['Prescription', 'Dose', 'Visit Date', 'Next Visit'] },
  { label: 'Physician Details', description: 'Enter Physician Details:', fields: ['Physician ID', 'Physician Name (First, Last Name)', 'Physician Number', 'Bill'] },
];

export default function PatientForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const firstErrorFieldRef = useRef(null);

  const googleSheetId = usePatientStore(state => state.googleSheetId);
  const fetchPatients = usePatientStore(state => state.fetchPatients);
  const navigate = useNavigate();

  const sheetId = sessionStorage.getItem('googleSheetId');
    if(!sheetId) {
    navigate('/dashboard/select_file');
    }

  useEffect(() => {
    (async () => await fetchPatients())();
  }, [fetchPatients]);


  const getAutoDetails = async () => {
    const DrId = await IDGenerater(290, "dr")
    const PatientID = await IDGenerater(344, "a12kj")
    formData['Physician ID'] = DrId || '';
    formData['Patient ID'] = PatientID || '';
}


useEffect( () => {
  getAutoDetails();
  console.log(`lets just render this once`)
}, []);



  const handleInputChange = (event, fieldName) => {
    const value = event.target.value;

    if ((['Age', 'Phone', 'Physician Number'].includes(fieldName)) && !/^\d*$/.test(value)) {
      setErrors(prev => ({ ...prev, [fieldName]: `${fieldName} should contain only numbers.` }));
      return;
    }

    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
  };

  const validateStepFields = () => {
    const currentStepFields = steps[activeStep].fields;
    const newErrors = {};
    currentStepFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'This field is required.';
      }
      if (field.includes('(First, Last Name)') && formData[field] && formData[field].split(' ').length < 2) {
        newErrors[field] = 'Please provide both first and last names.';
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstErrorKey = Object.keys(newErrors)[0];
        document.getElementById(firstErrorKey)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStepFields()) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const handleFinish = async () => {
    if (!validateStepFields()) return;

    const payload = {
      patientId: formData['Patient ID'],
      firstName: formData['Patient Name (First, Last Name)']?.split(' ')[0] || '',
      lastName: formData['Patient Name (First, Last Name)']?.split(' ')[1] || '',
      address: formData['Address'] || '',
      location: formData['Location'] || '',
      phone: formData['Phone'] || '',
      physicianId: formData['Physician ID'],
      prescription: formData['Prescription'] || '',
      dose: formData['Dose'] || '',
      physicianFirstName: formData['Physician Name (First, Last Name)']?.split(' ')[0] || '',
      physicianlastName: formData['Physician Name (First, Last Name)']?.split(' ')[1] || '',
      physicianNumber: formData['Physician Number'] || '',
      visitDate: formData['Visit Date'] || '',
      nextVisit: formData['Next Visit'] || '',
    };

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/sheets/${sheetId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      console.log('Submitted successfully');
      setFormData({});
      setActiveStep(0);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ ml: 5 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {step.fields.map(fieldName => (
                  <Grid item xs={4} key={fieldName}>
                    <TextField
                      id={fieldName}
                      label={fieldName}
                      variant="outlined"
                      value={formData[fieldName] || ''}
                      onChange={(e) => handleInputChange(e, fieldName)}
                      error={!!errors[fieldName]}
                      helperText={errors[fieldName] || ''}
                      fullWidth
                      InputProps={{
                        readOnly: ['Patient ID', 'Physician ID'].includes(fieldName),
                      }}
                    />
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={index === steps.length - 1 ? handleFinish : handleNext} disabled={loading}>
                  {loading && index === steps.length - 1 ? <CircularProgress size={20} color="inherit" /> : index === steps.length - 1 ? 'Save' : 'Continue'}
                </Button>
                <Button onClick={handleBack} disabled={index === 0 || loading} sx={{ ml: 1 }}>
                  Back
                </Button>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Want to save these details?</Typography>
          <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>Back</Button>
          <Button onClick={handleFinish} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Save'}
          </Button>
        </Paper>
      )}
    </Box>
  );
}
