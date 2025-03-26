import * as React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Stack,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import usePatientStore from "src/store/patientStore";

const steps = [
  { label: "Patient Details", fields: ["Patient ID", "Patient Name", "Location", "Age", "Gender", "Phone", "Address"] },
  { label: "Prescription Details", fields: ["Prescription", "Dose", "Visit Date", "Next Visit"] },
  { label: "Physician Details", fields: ["Physician ID", "Physician Name", "Physician Number", "Bill"] },
];

const EditPatientForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { formData, setFormData, googleSheetLink, setGoogleSheetLink } = usePatientStore();
  const [errors, setErrors] = useState({});
  const location = useLocation().state;

  useEffect(() => {
    const fetchSheetData = async () => {
      try {
        const res = await fetch("YOUR_GOOGLE_DRIVE_API_ENDPOINT");
        const data = await res.json();
        setFormData(data);
        setGoogleSheetLink("YOUR_GOOGLE_SHEET_LINK");
      } catch (err) {
        console.error("Failed fetching sheet:", err);
      }
    };
    fetchSheetData();
  }, [setFormData, setGoogleSheetLink]);

  useEffect(() => {
    if (location) {
      setFormData({
        "Patient Name": `${location.firstName} ${location.lastName}`,
        Location: location.Location,
        Age: location.Age,
        Gender: location.Gender,
        Phone: location.Phone,
        Address: location.Address,
        Prescription: location.Prescription,
        Dose: location.Dose,
        "Visit Date": location.VisitDate,
        "Next Visit": location.NextVisit,
        "Physician ID": location.PhysicianID,
        "Physician Name": `${location.PhysicianFirstName} ${location.PhysicianLastName}`,
        "Physician Number": location.PhysicianNumber,
        Bill: location.Bill,
        "Patient ID": location.PatientID,
      });
    }
  }, [location, setFormData]);

  const handleInputChange = useCallback(
    (e, field) => {
      const { value } = e.target;
      if (["Age", "Phone", "Physician Number"].includes(field) && isNaN(Number(value))) {
        setErrors((prev) => ({ ...prev, [field]: "Only numbers allowed." }));
        return;
      }
      setFormData({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
    },
    [setFormData]
  );

  const validateStep = useCallback(() => {
    const stepFields = steps[activeStep].fields;
    const newErrors = {};
    let valid = true;

    stepFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required.";
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  }, [activeStep, formData]);

  const handleNext = useCallback(() => {
    if (validateStep()) setActiveStep((prev) => prev + 1);
  }, [validateStep]);

  const handleBack = useCallback(() => setActiveStep((prev) => prev - 1), []);

  const handleSave = useCallback(() => {
    console.log("Form Saved:", formData);
    console.log("Google Sheet:", googleSheetLink);
  }, [formData, googleSheetLink]);

  const renderStepFields = useMemo(
    () =>
      steps.map((step, idx) => (
        <Step key={step.label}>
          <StepLabel>{step.label}</StepLabel>
          <StepContent>
            <Grid container spacing={2}>
              {step.fields.map((field) => (
                <Grid item xs={4} key={field}>
                  <TextField
                    fullWidth
                    id={field}
                    label={field}
                    value={formData[field] || ""}
                    onChange={(e) => handleInputChange(e, field)}
                    InputProps={{ readOnly: ["Patient ID", "Physician ID"].includes(field) }}
                    error={Boolean(errors[field])}
                    helperText={errors[field]}
                  />
                </Grid>
              ))}
            </Grid>
            <Box mt={2}>
              <Button variant="contained" onClick={idx === steps.length - 1 ? handleSave : handleNext} sx={{ mr: 1 }}>
                {idx === steps.length - 1 ? "Save" : "Continue"}
              </Button>
              <Button disabled={idx === 0} onClick={handleBack}>
                Back
              </Button>
            </Box>
          </StepContent>
        </Step>
      )),
    [formData, errors, handleInputChange, handleBack, handleNext, handleSave]
  );

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Edit Patient Details</Typography>
      </Stack>
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ ml: 4 }}>
        {renderStepFields}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>Review & Save your changes.</Typography>
          <Button onClick={() => setActiveStep(activeStep - 1)} sx={{ mt: 1, mr: 1 }}>
            Back
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ mt: 1 }}>
            Save
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default EditPatientForm;