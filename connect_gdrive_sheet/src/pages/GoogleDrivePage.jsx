import { Helmet } from 'react-helmet-async';
import {
  Stack,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePatientStore from 'src/store/patientStore';


function extractSheetIdFromUrl(url) {
  if (typeof url !== 'string') {
    console.error('Invalid URL type');
    throw new Error('Invalid URL');
  }
  var regex = /\/d\/([a-zA-Z0-9-_]+)/;
  var match = url.match(regex);
  if (!match || !match[1]) {
    console.error('Sheet ID extraction failed');
    throw new Error('Invalid Google Sheets URL');
  }
  return match[1];
}

function useGoogleSheetHandler() {
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState(null);
  var { setGoogleSheetId } = usePatientStore();
  var navigate = useNavigate();

  function validateSheetUrl(url) {
  const regex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/;
    return regex.test(url.trim());
  }

  async function handleSheetSubmission(url) {
    if (!validateSheetUrl(url)) {
      console.warn('Invalid URL provided:', url);
      setError('Please enter a valid Google Sheet link.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      var sheetId = extractSheetIdFromUrl(url);
      console.info('Extracted Sheet ID:', sheetId);
      setGoogleSheetId(sheetId);

      var response = await fetch(
        process.env.SERVER_URL + '/api/sheet/' + sheetId
      );

      if (!response.ok) {
        console.error('Sheet verification failed:', response.status);
        setGoogleSheetId('');
        setError('Sheet could not be verified.');
        return;
      }
      sessionStorage.setItem('googleSheetId', sheetId);
      console.log('Sheet verified, navigating to addPatients');
      navigate('/dashboard/editPatients');
    } catch (err) {
      console.error('Unexpected error:', err);
      setGoogleSheetId('');
      setError('An error occurred, please retry.');
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, setError, handleSheetSubmission };
}

export default function GoogleDrivePage() {
  var [open, setOpen] = useState(false);
  var [link, setLink] = useState('');
  var { loading, error, setError, handleSheetSubmission } =
    useGoogleSheetHandler();

  function handleDialogClose() {
    if (!loading) setOpen(false);
  }

  return (
    <>
      <Helmet>
        <title> Connect to Google Drive | Bhumio </title>
      </Helmet>

      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Connect to Google Drive and Select Worksheet
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Select File from Google Drive
          </Button>
        </Stack>
      </Container>

      <Dialog open={open} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Enter Google Sheet Link</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            placeholder="Insert the Google Drive link of your Google Sheet"
            value={link}
            onChange={function (e) {
              setLink(e.target.value);
              if (error) setError(null);
            }}
            error={!!error}
            helperText={error}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={function () {
              handleSheetSubmission(link);
              setOpen(false);
            }}
            disabled={loading || error}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Checking...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}