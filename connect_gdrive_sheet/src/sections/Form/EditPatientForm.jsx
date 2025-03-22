import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Container, Grid, Stack, TextField, Button, Typography, Box, Paper } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import { create } from "zustand";

// Zustand store
const usePatientStore = create((set) => ({
  formData: {},
  setFormData: (newData) => set((state) => ({ formData: { ...state.formData, ...newData } })),
  googleSheetLink: "",
  setGoogleSheetLink: (link) => set({ googleSheetLink: link }),
}));

// Steps configuration
const steps = [
  { label: "Patient Details", fields: ["Patient ID", "Patient Name", "Location", "Age", "Gender", "Phone", "Address"] },
  { label: "Prescription Details", fields: ["Prescription", "Dose", "Visit Date", "Next Visit"] },
  { label: "Physician Details", fields: ["Physician ID", "Physician Name", "Physician Number", "Bill"] },
];

export default function EditPatientForm() {
  const [activeStep, setActiveStep] = useState(0);
  const { formData, setFormData, googleSheetLink, setGoogleSheetLink } = usePatientStore();
  const [errors, setErrors] = useState({});
  const location = useLocation().state;

  // Fetch form data from Google Drive
  useEffect(() => {
    async function fetchGoogleSheetData() {
      try {
        const response = await fetch("YOUR_GOOGLE_DRIVE_API_ENDPOINT");
        const data = await response.json();
        setFormData(data);
        setGoogleSheetLink("YOUR_GOOGLE_SHEET_LINK");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchGoogleSheetData();
  }, [setFormData, setGoogleSheetLink]);

  useEffect(() => {
    if (location) {
      setFormData({
        "Patient Name": `${location?.firstName} ${location?.lastName}`,
        "Location": location?.Location,
        "Age": location?.Age,
        "Gender": location?.Gender,
        "Phone": location?.Phone,
        "Address": location?.Address,
        "Prescription": location?.Prescription,
        "Dose": location?.Dose,
        "Visit Date": location?.VisitDate,
        "Next Visit": location?.NextVisit,
        "Physician ID": location?.PhysicianID,
        "Physician Name": `${location?.PhysicianFirstName} ${location?.PhysicianLastName}`,
        "Physician Number": location?.PhysicianNumber,
        "Bill": location?.Bill,
        "Patient ID": location?.PatientID,
      });
    }
  }, [location, setFormData]);

  const handleNext = useCallback(() => {
    if (validateFields()) setActiveStep((prev) => prev + 1);
  }, [validateFields]);

  const handleBack = useCallback(() => setActiveStep((prev) => prev - 1), []);

  const handleInputChange = useCallback(
    (event, fieldName) => {
      const { value } = event.target;
      if (["Age", "Phone", "Physician Number"].includes(fieldName) && isNaN(Number(value))) {
        setErrors((prev) => ({ ...prev, [fieldName]: "Should contain only numbers." }));
        return;
      }
      setFormData({ [fieldName]: value });
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    },
    [setFormData]
  );

  const validateFields = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    steps[activeStep].fields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required.";
        isValid = false;
      }
    });
    setErrors(newErrors);
    return isValid;
  }, [activeStep, formData]);

  const handleFinish = useCallback(() => {
    console.log("Final Form Data:", formData);
    console.log("Google Sheet Link:", googleSheetLink);
  }, [formData, googleSheetLink]);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Edit Patient Details</Typography>
      </Stack>

      <Box>
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ ml: 5 }}>
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography>{step.label}</Typography>

                <form>
                  <Grid container spacing={2}>
                    {step.fields.map((field) => (
                      <Grid item xs={4} key={field}>
                        <TextField
                          id={field}
                          label={field}
                          variant="outlined"
                          value={formData[field] || ""}
                          onChange={(event) => handleInputChange(event, field)}
                          InputProps={{ readOnly: ["Patient ID", "Physician ID"].includes(field) }}
                          sx={{ mt: 2 }}
                        />
                        <Typography style={{ color: "red" }}>{errors[field]}</Typography>
                      </Grid>
                    ))}
                  </Grid>
                </form>

                <Box sx={{ mb: 2 }}>
                  <Container>
                    <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1 }}>
                      {index === steps.length - 1 ? "Finish" : "Continue"}
                    </Button>
                    <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Back
                    </Button>
                  </Container>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>Want to update these details?</Typography>
            <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
              Back
            </Button>
            <Button onClick={handleFinish} sx={{ mt: 1, mr: 1 }} variant="contained">
              Save
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
