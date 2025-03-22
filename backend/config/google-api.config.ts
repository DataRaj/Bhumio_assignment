import { config } from 'dotenv';
config();
// config/google-api.config.ts


export const googleApiConfig = {
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')!,
    },
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  };