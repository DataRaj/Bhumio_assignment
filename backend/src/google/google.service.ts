/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { googleApiConfig } from 'config/google-api.config'; 
import { drive_v3, google, sheets_v4 } from 'googleapis';
import { ArrayToJson } from 'src/utils/ArrayToJson.util';
import { mergeEntitiesByIndex } from 'src/utils/MergeObjects.util';

@Injectable()
export class GoogleService {
  private readonly drive: drive_v3.Drive;
  private readonly sheets: sheets_v4.Sheets;

  constructor() {
    try {
      const auth = this.authorize();
      this.drive = google.drive({ version: 'v3', auth });
      this.sheets = google.sheets({ version: 'v4', auth });
    } catch (e) {
      console.error('Error initializing Google services:', e.message);
    }
  }

  private authorize() {
    try {
      const auth = new google.auth.JWT({
        email: googleApiConfig.credentials.client_email,
        key: googleApiConfig.credentials.private_key,
        scopes: googleApiConfig.scopes,
      });
      return auth;
    } catch (e) {
      console.error('Authentication error:', e.message);
      throw e;
    }
  }

  async fetchFile(fileId: string): Promise<any> {
    try {
      return await this.drive.files.get({ fileId });
    } catch (e) {
      console.error('Error fetching file:', e.message);
      throw e;
    }
  }


  private extractSheetId(url: string): string {
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

  

  async retrieveSheetData(spreadsheetId: string): Promise<any> {
    try {
      const [patient, physician, appointment, prescription] = await Promise.all([
        this.fetchSheetRange(spreadsheetId, 'patient'),
        this.fetchSheetRange(spreadsheetId, 'physician'),
        this.fetchSheetRange(spreadsheetId, 'appointment'),
        this.fetchSheetRange(spreadsheetId, 'prescribes'),
      ]);

      const result = mergeEntitiesByIndex({
        patient: ArrayToJson(patient.data.values),
        physician: ArrayToJson(physician.data.values),
        appointment: ArrayToJson(appointment.data.values),
        prescription: ArrayToJson(prescription.data.values),
      });
      
      // Normalize the data to ensure consistent property names
      return result.map(item => {
        // Create a normalized version with lowercase keys
        return {
          ...item,
          patientId: item.patientID || item.PatientID || item.patientId
        };
      });
    } catch (e) {
      console.error('Error retrieving sheet data:', e.message);
      throw e;
    }
  }

  private async fetchSheetRange(spreadsheetId: string, range: string): Promise<any> {
    return this.sheets.spreadsheets.values.get({ spreadsheetId, range });
  }

  async addSheetData(spreadsheetId: string, data: any): Promise<any> {
    try {
      const [patient, prescription, physician, appointment] = this.prepareDataForSheets(data);
      console.log(patient.toLocaleString())
      const results = await Promise.all([
        this.appendToSheet(spreadsheetId, 'patient', patient),
        this.appendToSheet(spreadsheetId, 'prescribes', prescription),
        this.appendToSheet(spreadsheetId, 'physician', physician),
        this.appendToSheet(spreadsheetId, 'appointment', appointment),
      ]);

      return results.map((result) => result.status);
    } catch (e) {
      console.error('Error adding sheet data:', e.message);
      throw e;
    }
  }

  private prepareDataForSheets(data: any) {
    return [
      [data.patientId, data.firstName, data.lastName, data.address, data.location, data.email, data.phone],
      [data.physicianId, data.patientId, data.prescription, data.dose],
      [data.physicianId, data.physicianFirstName, data.physicianlastName, data.physicianNumber],
      [data.appointmentId, data.patientId, data.physicianId, data.visitDate, data.nextVisit],
    ];
  }

  private async appendToSheet(spreadsheetId: string, range: string, values: any[]): Promise<any> {
    return this.sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [values] },
    });
  }

  async modifySheetData(spreadsheetId: string, data: any): Promise<any> {
    try {
      const index = await this.findRowIndex(spreadsheetId, data.patientId);
      const [patient, prescription, physician, appointment] = this.prepareDataForSheets(data);
      console.log(`prescription is ${prescription.toLocaleString()}) ` )
      const results = await Promise.all([
        this.updateSheetRange(spreadsheetId, `patient!A${index}:I${index}`, [patient]),
        this.updateSheetRange(spreadsheetId, `prescribes!A${index}:D${index}`, [prescription]),
        this.updateSheetRange(spreadsheetId, `physician!A${index}:E${index}`, [physician]),
        this.updateSheetRange(spreadsheetId, `appointment!A${index}:F${index}`, [appointment]),
      ]);

      return results.map((result) => result.status);
    } catch (e) {
      console.error('Error modifying sheet data:', e.message);
      throw e;
    }
  }

  private async findRowIndex(spreadsheetId: string, patientId: string): Promise<number> {
    const data = await this.retrieveSheetData(spreadsheetId);
    console.log("Retrieved data:", JSON.stringify(data));
    console.log("Patient IDs:", data.map(item => item.patientId));
    console.log("Looking for patient ID:", patientId);
    
    const index = data.findIndex((entry) => entry.patientId === patientId);
    console.log("Found index:", index);
    
    if (index === -1) throw new Error('Patient ID not found');
    return index + 2; // +2 to account for header row and 1-based indexing
  }

  private async updateSheetRange(spreadsheetId: string, range: string, values: any[]): Promise<any> {
    return this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });
  }
}
