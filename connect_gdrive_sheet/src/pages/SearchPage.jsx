import { Helmet } from 'react-helmet-async';

import {
  Card,
  Stack,
  Container,
  Typography,

} from '@mui/material';
import Searchbar from '../layouts/dashboard/header/Searchbar';
// components
// ----------------------------------------------------------------------



// ----------------------------------------------------------------------




export default function SearchPage() {

  return (
    <>
      <Helmet>
        <title> Search Patients | Bhumio </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Search Patients
          </Typography>

        </Stack>

        <Searchbar />
      </Container>
    </>
  );
}
