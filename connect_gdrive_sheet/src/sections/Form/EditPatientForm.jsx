import * as React from "react";
import { useState, useEffect, useCallback } from "react";
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
  {
    label: "Patient Details",
    fields: ["Patient ID", "Patient Name", "Location", "Age", "Gender", "Phone", "Address"],
  },
  {
    label: "Prescription Details",
    fields: ["Prescription", "Dose", "Visit Date", "Next Visit"],
  },
  {
    label: "Physician Details",
    fields: ["Physician ID", "Physician Name", "Physician Number", "Bill"],
  },
];

export default function EditPatientForm() {
  const [activeStep, setActiveStep] = useState(0);
  const { formData, setFormData, googleSheetLink, setGoogleSheetLink } = usePatientStore();
  const [errors, setErrors] = useState({});
  const location = useLocation()?.state;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("YOUR_GOOGLE_DRIVE_API_ENDPOINT");
        const data = await response.json();
        setFormData(data);
        setGoogleSheetLink("YOUR_GOOGLE_SHEET_LINK");
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    fetchData();
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

  const handleChange = useCallback(
    (e, field) => {
      const { value } = e.target;
      if (["Age", "Phone", "Physician Number"].includes(field) && isNaN(Number(value))) {
        setErrors((prev) => ({ ...prev, [field]: "Numbers only" }));
        return;
      }
      setFormData({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
    },
    [setFormData]
  );

  const validateStep = useCallback(() => {
    const newErrors = {};
    let valid = true;
    steps[activeStep].fields.forEach((f) => {
      if (!formData[f]) {
        newErrors[f] = "Required field";
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
    console.log("Saving Data:", formData, googleSheetLink);
  }, [formData, googleSheetLink]);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Edit Patient Details</Typography>
      </Stack>

      <Box>
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ ml: 5 }}>
          {steps.map((step, i) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <form>
                  <Grid container spacing={2}>
                    {step.fields.map((field) => (
                      <Grid item xs={4} key={field}>
                        <TextField
                          fullWidth
                          id={field}
                          label={field}
                          variant="outlined"
                          value={formData[field] || ""}
                          onChange={(e) => handleChange(e, field)}
                          InputProps={{ readOnly: ["Patient ID", "Physician ID"].includes(field) }}
                          sx={{ mt: 2 }}
                          error={!!errors[field]}
                          helperText={errors[field]}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </form>

                <Box sx={{ mb: 2, mt: 2 }}>
                  <Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
                    {i === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button disabled={i === 0} onClick={handleBack}>
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>Review all details and save.</Typography>
            <Button onClick={() => setActiveStep(steps.length - 1)} sx={{ mt: 1, mr: 1 }}>
              Back
            </Button>
            <Button onClick={handleSave} variant="contained" sx={{ mt: 1 }}>
              Save
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
