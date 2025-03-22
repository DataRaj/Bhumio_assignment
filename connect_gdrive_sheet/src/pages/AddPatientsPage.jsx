import { Stack, Typography } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet-async";
import PatientForm from "../sections/Form/PatientForm";



export default function AddPatientsPage() {

  return (
    <>

      <Helmet>
        <title> Add Patients | Bhumio </title>
      </Helmet>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Add Patients Form
        </Typography>
      </Stack>
      <PatientForm />

    </>
  );
}
