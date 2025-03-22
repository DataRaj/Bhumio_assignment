/* eslint-disable camelcase */
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import {
  Stack,
  Popover,
  MenuItem,
  Container,
  Typography,
  TextField,

} from '@mui/material';
// components
import Iconify from '../components/iconify';
import DataTable from '../sections/DataTable/DataTable';



export default function EditPage() {
  const [open, setOpen] = useState(null);

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };


  return (
    <>
      <Helmet>
        <title> Edit Patients | Bhumio </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Edit Patients
          </Typography>

        </Stack>
        <TextField
          label="Search Patients"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ marginBottom: '16px' }}
        />
        <DataTable searchQuery={searchQuery} />
      </Container>

    </>
  );
}
