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
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { set } from 'lodash';
import usePatientStore from 'src/store/patientStore';

export default function GoogleDrivePage() {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');
  const [error, setError] = useState('');
  const [sheetId, setSheetId] = useState('');
  const {setGoogleSheetId} = usePatientStore()
  const Navigate = useNavigate();

  const googleSheetRegex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/;

  function extractSheetId(url) {
    if (typeof url !== 'string') {
      throw new Error('Invalid URL: Must be a string');
    }
    const regex = /\/d\/([a-zA-Z0-9-_]+)/;
    const match = url.match(regex);
    if (!match || !match[1]) {
      throw new Error('Invalid Google Sheets URL');
    }
    return match[1];
  }

  const handleSubmit = () => {
    if (!googleSheetRegex.test(link.trim())) {
      setError('Please enter a valid Google Sheet link.');
      return;
    }
    setError('');
    setOpen(false);
  
    const handleSuccess = async () => {
      try {
        const extractedSheetId = extractSheetId(link);
        setSheetId(extractedSheetId);
        setGoogleSheetId(extractedSheetId);
  
        const response = await fetch(
          `${process.env.SERVER_URL}/api/sheet/${extractedSheetId}`
        );
        if (!response.ok) {
          console.error('Failed to submit link:', response.statusText);
          return;
        }
  
        Navigate('/dashboard/addPatients');
        console.log('Valid link:', link);
      } catch (error) {
        console.error('Failed to extract sheet ID from link:', link);
      }
    };
  
    handleSuccess();
  };
  

  return (
    <>
      <Helmet>
        <title> Connect to Google Drive | Bhumio </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Connect to Google Drive and Select Worksheet
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Select File from Google Drive
          </Button>
        </Stack>
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Enter Google Sheet Link</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            placeholder="Insert the Google Drive link of your Google Sheet"
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              if (error) setError('');
            }}
            error={!!error}
            helperText={error}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
