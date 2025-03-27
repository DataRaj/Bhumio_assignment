import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton as MuiIconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import usePatientStore from 'src/store/patientStore';

function Row({ row }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          <Link to="/dashboard/editPatient_form" state={row}>
            <MuiIconButton aria-label="edit" size="small" title="Edit">
              <EditIcon fontSize="small" />
            </MuiIconButton>
          </Link>
        </TableCell>
        <TableCell>{row.patientId}</TableCell>
        <TableCell>{`${row.first_name} ${row.last_name}`}</TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>{row.age}</TableCell>
        <TableCell>{row.phone}</TableCell>
        <TableCell>{row.gender}</TableCell>
        <TableCell>{row.address}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={12} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2 }}>
              <Typography variant="h6" gutterBottom>
                Prescription and Physician Details
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Prescription</TableCell>
                    <TableCell>Dose</TableCell>
                    <TableCell>Physician Name</TableCell>
                    <TableCell>Physician Number</TableCell>
                    <TableCell>Bill</TableCell>
                    <TableCell>Physician ID</TableCell>
                    <TableCell>Visit Date</TableCell>
                    <TableCell>Next Visit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.dose}</TableCell>
                    <TableCell>{`${row.name}`}</TableCell>
                    <TableCell>{row.physicianNumber}</TableCell>
                    <TableCell>{row.bill}</TableCell>
                    <TableCell>{row.physician}</TableCell>
                    <TableCell>{row.start_dt_time}</TableCell>
                    <TableCell>{row.next_dt_time}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
};

export default function DataTable({ searchQuery }) {
  const { patients, fetchPatients } = usePatientStore();

  console.log(patients);

  React.useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const filteredPatients = patients.filter((patient) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return Object.values(patient).some((val) =>
      String(val).toLowerCase().includes(lowerCaseQuery)
    );
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Actions</TableCell>
            <TableCell>Patient ID</TableCell>
            <TableCell>Patient Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredPatients.map((row) => (
            <Row key={row.patientId} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
